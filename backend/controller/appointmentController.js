import StatsModel from '../models/Stats.js';
import PropertyModel from '../models/Property.js';
import AppointmentModel from '../models/Appointment.js';
import UserModel from '../models/User.js';
import transporter from "../config/nodemailer.js";
import { getSchedulingEmailTemplate, getEmailTemplate } from '../email.js';

const formatRecentProperties = (properties) => {
  return properties.map(property => ({
    type: 'property',
    description: `New property listed: ${property.title}`,
    timestamp: property.createdAt
  }));
};

const formatRecentAppointments = (appointments) => {
  return appointments.map(appointment => ({
    type: 'appointment',
    description: appointment.userId && appointment.propertyId
      ? `${appointment.userId.name} scheduled viewing for ${appointment.propertyId.title}`
      : 'Appointment scheduled',
    timestamp: appointment.createdAt
  }));
};

export const getAdminStats = async (req, res) => {
  try {
    const [
      totalProperties,
      activeListings,
      totalUsers,
      pendingAppointments,
      recentActivity,
      viewsData,
      revenue
    ] = await Promise.all([
      PropertyModel.count(),
      PropertyModel.count({ status: 'active' }),
      UserModel.count(),
      AppointmentModel.count({ status: 'pending' }),
      getRecentActivity(),
      getViewsData(),
      calculateRevenue()
    ]);

    res.json({
      success: true,
      stats: {
        totalProperties,
        activeListings,
        totalUsers,
        pendingAppointments,
        recentActivity,
        viewsData,
        revenue
      }
    });
  } catch (error) {
    console.error('Admin stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching admin statistics'
    });
  }
};

const getRecentActivity = async () => {
  try {
    const recentProperties = await PropertyModel.findRecent(5, 'id, title, created_at');
    const recentAppointments = await AppointmentModel.findRecent(5);

    const validAppointments = recentAppointments.filter(
      appointment => appointment.userId && appointment.propertyId
    );

    return [
      ...formatRecentProperties(recentProperties),
      ...formatRecentAppointments(validAppointments)
    ].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  } catch (error) {
    console.error('Error getting recent activity:', error);
    return [];
  }
};

const getViewsData = async () => {
  try {
    return await StatsModel.getViewsData(30);
  } catch (error) {
    console.error('Error generating chart data:', error);
    return {
      labels: [],
      datasets: [{
        label: 'Property Views',
        data: [],
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        tension: 0.4,
        fill: true
      }]
    };
  }
};

const calculateRevenue = async () => {
  try {
    const properties = await PropertyModel.getAll();
    return properties.reduce((total, property) => total + Number(property.price), 0);
  } catch (error) {
    console.error('Error calculating revenue:', error);
    return 0;
  }
};

export const getAllAppointments = async (req, res) => {
  try {
    const appointments = await AppointmentModel.getAll();

    res.json({
      success: true,
      appointments
    });
  } catch (error) {
    console.error('Error fetching appointments:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching appointments'
    });
  }
};

export const updateAppointmentStatus = async (req, res) => {
  try {
    const { appointmentId, status } = req.body;
    
    const appointment = await AppointmentModel.update(appointmentId, { status });

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found'
      });
    }

    const mailOptions = {
      from: process.env.EMAIL,
      to: appointment.userId.email,
      subject: `Viewing Appointment ${status.charAt(0).toUpperCase() + status.slice(1)} - BuildEstate`,
      html: getEmailTemplate(appointment, status)
    };

    await transporter.sendMail(mailOptions);

    res.json({
      success: true,
      message: `Appointment ${status} successfully`,
      appointment
    });
  } catch (error) {
    console.error('Error updating appointment:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating appointment'
    });
  }
};

export const scheduleViewing = async (req, res) => {
  try {
    const { propertyId, date, time, notes } = req.body;
    const userId = req.user.id;

    const property = await PropertyModel.getById(propertyId);
    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found'
      });
    }

    const existingAppointment = await AppointmentModel.findExisting(propertyId, date, time);

    if (existingAppointment) {
      return res.status(400).json({
        success: false,
        message: 'This time slot is already booked'
      });
    }

    const appointment = await AppointmentModel.create({
      propertyId,
      userId,
      date,
      time,
      notes,
      status: 'pending'
    });

    const mailOptions = {
      from: process.env.EMAIL,
      to: req.user.email,
      subject: "Viewing Scheduled - BuildEstate",
      html: getSchedulingEmailTemplate(appointment, date, time, notes)
    };

    await transporter.sendMail(mailOptions);

    res.status(201).json({
      success: true,
      message: 'Viewing scheduled successfully',
      appointment
    });
  } catch (error) {
    console.error('Error scheduling viewing:', error);
    res.status(500).json({
      success: false,
      message: 'Error scheduling viewing'
    });
  }
};

export const cancelAppointment = async (req, res) => {
  try {
    const appointmentId = req.params.id;
    const appointment = await AppointmentModel.getById(appointmentId);

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found'
      });
    }

    if (appointment.userId.id.toString() !== req.user.id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to cancel this appointment'
      });
    }

    await AppointmentModel.update(appointmentId, {
      status: 'cancelled',
      cancelReason: req.body.reason || 'Cancelled by user'
    });

    const mailOptions = {
      from: process.env.EMAIL,
      to: appointment.userId.email,
      subject: 'Appointment Cancelled - BuildEstate',
      html: `
        <div style="max-width: 600px; margin: 20px auto; padding: 30px; background: #ffffff; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
          <h1 style="color: #2563eb; text-align: center;">Appointment Cancelled</h1>
          <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p>Your viewing appointment for <strong>${appointment.propertyId.title}</strong> has been cancelled.</p>
            <p><strong>Date:</strong> ${new Date(appointment.date).toLocaleDateString()}</p>
            <p><strong>Time:</strong> ${appointment.time}</p>
            ${req.body.reason ? `<p><strong>Reason:</strong> ${req.body.reason}</p>` : ''}
          </div>
          <p style="color: #4b5563;">You can schedule another viewing at any time.</p>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);

    res.json({
      success: true,
      message: 'Appointment cancelled successfully'
    });
  } catch (error) {
    console.error('Error cancelling appointment:', error);
    res.status(500).json({
      success: false,
      message: 'Error cancelling appointment'
    });
  }
};

export const getAppointmentsByUser = async (req, res) => {
  try {
    const appointments = await AppointmentModel.findByUserId(req.user.id);

    res.json({
      success: true,
      appointments
    });
  } catch (error) {
    console.error('Error fetching user appointments:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching appointments'
    });
  }
};

export const updateAppointmentMeetingLink = async (req, res) => {
  try {
    const { appointmentId, meetingLink } = req.body;
    
    const appointment = await AppointmentModel.update(appointmentId, { meetingLink });

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found'
      });
    }

    const mailOptions = {
      from: process.env.EMAIL,
      to: appointment.userId.email,
      subject: "Meeting Link Updated - BuildEstate",
      html: `
        <div style="max-width: 600px; margin: 20px auto; font-family: 'Arial', sans-serif; line-height: 1.6;">
          <div style="background: linear-gradient(135deg, #2563eb, #1e40af); padding: 40px 20px; border-radius: 15px 15px 0 0; text-align: center;">
            <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 700;">Meeting Link Updated</h1>
          </div>
          <div style="background: #ffffff; padding: 40px 30px; border-radius: 0 0 15px 15px; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);">
            <p>Your viewing appointment for <strong>${appointment.propertyId.title}</strong> has been updated with a meeting link.</p>
            <p><strong>Date:</strong> ${new Date(appointment.date).toLocaleDateString()}</p>
            <p><strong>Time:</strong> ${appointment.time}</p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${meetingLink}" 
                 style="display: inline-block; padding: 12px 24px; background: linear-gradient(135deg, #2563eb, #1e40af); 
                        color: white; text-decoration: none; border-radius: 8px; font-weight: bold;">
                Join Meeting
              </a>
            </div>
          </div>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);

    res.json({
      success: true,
      message: 'Meeting link updated successfully',
      appointment
    });
  } catch (error) {
    console.error('Error updating meeting link:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating meeting link'
    });
  }
};

export const getAppointmentStats = async (req, res) => {
  try {
    const [pending, confirmed, cancelled, completed] = await Promise.all([
      AppointmentModel.count({ status: 'pending' }),
      AppointmentModel.count({ status: 'confirmed' }),
      AppointmentModel.count({ status: 'cancelled' }),
      AppointmentModel.count({ status: 'completed' })
    ]);

    res.json({
      success: true,
      stats: {
        total: pending + confirmed + cancelled + completed,
        pending,
        confirmed,
        cancelled,
        completed,
        dailyStats: []
      }
    });
  } catch (error) {
    console.error('Error fetching appointment stats:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching appointment statistics'
    });
  }
};

export const submitAppointmentFeedback = async (req, res) => {
  try {
    const { id } = req.params;
    const { rating, comment } = req.body;

    const appointment = await AppointmentModel.getById(id);

    if (!appointment) {
      return res.status(404).json({
        success: false,
        message: 'Appointment not found'
      });
    }

    if (appointment.userId.id.toString() !== req.user.id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to submit feedback for this appointment'
      });
    }

    await AppointmentModel.update(id, {
      feedback: { rating, comment },
      status: 'completed'
    });

    res.json({
      success: true,
      message: 'Feedback submitted successfully'
    });
  } catch (error) {
    console.error('Error submitting feedback:', error);
    res.status(500).json({
      success: false,
      message: 'Error submitting feedback'
    });
  }
};

export const getUpcomingAppointments = async (req, res) => {
  try {
    const appointments = await AppointmentModel.findByUserId(req.user.id);
    const now = new Date();
    
    const upcoming = appointments
      .filter(apt => new Date(apt.date) >= now && ['pending', 'confirmed'].includes(apt.status))
      .slice(0, 5);

    res.json({
      success: true,
      appointments: upcoming
    });
  } catch (error) {
    console.error('Error fetching upcoming appointments:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching upcoming appointments'
    });
  }
};
