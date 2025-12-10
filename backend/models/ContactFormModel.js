import supabase from '../lib/supabaseClient.js';

const TABLE = 'contact_forms';

export const ContactFormModel = {
  async getAll() {
    const { data, error } = await supabase
      .from(TABLE)
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  },

  async create(contactData) {
    const { data, error } = await supabase
      .from(TABLE)
      .insert({
        name: contactData.name,
        email: contactData.email,
        phone: contactData.phone,
        message: contactData.message,
        created_at: new Date().toISOString()
      })
      .select()
      .single();
    if (error) throw error;
    return data;
  }
};

export default ContactFormModel;
