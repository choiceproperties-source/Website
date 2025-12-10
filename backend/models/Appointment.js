import supabase from '../lib/supabaseClient.js';

const TABLE = 'appointments';

export const AppointmentModel = {
  async getAll() {
    const { data, error } = await supabase
      .from(TABLE)
      .select(`
        *,
        property:properties(id, title, location, image),
        user:users(id, name, email)
      `)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data.map(this.formatForResponse);
  },

  async getById(id) {
    const { data, error } = await supabase
      .from(TABLE)
      .select(`
        *,
        property:properties(id, title, location, image),
        user:users(id, name, email)
      `)
      .eq('id', id)
      .single();
    if (error && error.code !== 'PGRST116') throw error;
    return data ? this.formatForResponse(data) : null;
  },

  async findByUserId(userId) {
    const { data, error } = await supabase
      .from(TABLE)
      .select(`
        *,
        property:properties(id, title, location, image)
      `)
      .eq('user_id', userId)
      .order('date', { ascending: true });
    if (error) throw error;
    return data.map(this.formatForResponse);
  },

  async findOne(conditions) {
    let query = supabase.from(TABLE).select('*');
    
    for (const [key, value] of Object.entries(conditions)) {
      if (key === 'propertyId') {
        query = query.eq('property_id', value);
      } else if (key === 'status' && value.$ne) {
        query = query.neq('status', value.$ne);
      } else {
        query = query.eq(key, value);
      }
    }
    
    const { data, error } = await query.single();
    if (error && error.code !== 'PGRST116') throw error;
    return data ? this.formatForResponse(data) : null;
  },

  async findRecent(limit = 5) {
    const { data, error } = await supabase
      .from(TABLE)
      .select(`
        *,
        property:properties(id, title),
        user:users(id, name)
      `)
      .order('created_at', { ascending: false })
      .limit(limit);
    if (error) throw error;
    return data.map(this.formatForResponse);
  },

  async create(appointmentData) {
    const { data, error } = await supabase
      .from(TABLE)
      .insert({
        property_id: appointmentData.propertyId,
        user_id: appointmentData.userId,
        date: appointmentData.date,
        time: appointmentData.time,
        status: appointmentData.status || 'pending',
        meeting_link: appointmentData.meetingLink || null,
        meeting_platform: appointmentData.meetingPlatform || 'other',
        notes: appointmentData.notes || null,
        cancel_reason: appointmentData.cancelReason || null,
        reminder_sent: appointmentData.reminderSent || false,
        feedback_rating: appointmentData.feedback?.rating || null,
        feedback_comment: appointmentData.feedback?.comment || null,
        created_at: new Date().toISOString()
      })
      .select(`
        *,
        property:properties(id, title, location, image),
        user:users(id, name, email)
      `)
      .single();
    if (error) throw error;
    return this.formatForResponse(data);
  },

  async update(id, updateData) {
    const mappedData = { updated_at: new Date().toISOString() };
    
    if (updateData.status !== undefined) mappedData.status = updateData.status;
    if (updateData.meetingLink !== undefined) mappedData.meeting_link = updateData.meetingLink;
    if (updateData.meetingPlatform !== undefined) mappedData.meeting_platform = updateData.meetingPlatform;
    if (updateData.notes !== undefined) mappedData.notes = updateData.notes;
    if (updateData.cancelReason !== undefined) mappedData.cancel_reason = updateData.cancelReason;
    if (updateData.reminderSent !== undefined) mappedData.reminder_sent = updateData.reminderSent;
    if (updateData.feedback?.rating !== undefined) mappedData.feedback_rating = updateData.feedback.rating;
    if (updateData.feedback?.comment !== undefined) mappedData.feedback_comment = updateData.feedback.comment;

    const { data, error } = await supabase
      .from(TABLE)
      .update(mappedData)
      .eq('id', id)
      .select(`
        *,
        property:properties(id, title, location, image),
        user:users(id, name, email)
      `)
      .single();
    if (error) throw error;
    return this.formatForResponse(data);
  },

  async remove(id) {
    const { error } = await supabase
      .from(TABLE)
      .delete()
      .eq('id', id);
    if (error) throw error;
    return true;
  },

  async count(conditions = {}) {
    let query = supabase.from(TABLE).select('*', { count: 'exact', head: true });
    
    for (const [key, value] of Object.entries(conditions)) {
      if (key === 'status') query = query.eq('status', value);
    }
    
    const { count, error } = await query;
    if (error) throw error;
    return count || 0;
  },

  formatForResponse(appointment) {
    if (!appointment) return null;
    
    const formatted = {
      _id: appointment.id,
      id: appointment.id,
      propertyId: appointment.property ? {
        _id: appointment.property.id,
        id: appointment.property.id,
        title: appointment.property.title,
        location: appointment.property.location,
        image: appointment.property.image
      } : appointment.property_id,
      userId: appointment.user ? {
        _id: appointment.user.id,
        id: appointment.user.id,
        name: appointment.user.name,
        email: appointment.user.email
      } : appointment.user_id,
      date: appointment.date,
      time: appointment.time,
      status: appointment.status,
      meetingLink: appointment.meeting_link,
      meetingPlatform: appointment.meeting_platform,
      notes: appointment.notes,
      cancelReason: appointment.cancel_reason,
      reminderSent: appointment.reminder_sent,
      feedback: appointment.feedback_rating ? {
        rating: appointment.feedback_rating,
        comment: appointment.feedback_comment
      } : null,
      createdAt: appointment.created_at,
      updatedAt: appointment.updated_at
    };
    
    return formatted;
  }
};

export default AppointmentModel;
