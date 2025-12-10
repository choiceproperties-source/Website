import FormModel from '../models/Form.js';

export const submitForm = async (req, res) => {
  try {
    const { name, email, phone, message } = req.body;

    await FormModel.create({
      name,
      email,
      phone,
      message,
    });

    res.json({ message: 'Form submitted successfully' });
  } catch (error) {
    console.error('Error saving form data:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
