import supabase from '../lib/supabaseClient.js';

const TABLE = 'contact_forms';

export const FormModel = {
  async getAll() {
    const { data, error } = await supabase
      .from(TABLE)
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data.map(this.formatForResponse);
  },

  async getById(id) {
    const { data, error } = await supabase
      .from(TABLE)
      .select('*')
      .eq('id', id)
      .single();
    if (error && error.code !== 'PGRST116') throw error;
    return data ? this.formatForResponse(data) : null;
  },

  async create(formData) {
    const { data, error } = await supabase
      .from(TABLE)
      .insert({
        name: formData.name,
        email: formData.email,
        phone: formData.phone || null,
        message: formData.message,
        created_at: new Date().toISOString()
      })
      .select()
      .single();
    if (error) throw error;
    return this.formatForResponse(data);
  },

  async update(id, updateData) {
    const mappedData = { updated_at: new Date().toISOString() };
    if (updateData.name !== undefined) mappedData.name = updateData.name;
    if (updateData.email !== undefined) mappedData.email = updateData.email;
    if (updateData.phone !== undefined) mappedData.phone = updateData.phone;
    if (updateData.message !== undefined) mappedData.message = updateData.message;

    const { data, error } = await supabase
      .from(TABLE)
      .update(mappedData)
      .eq('id', id)
      .select()
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

  formatForResponse(form) {
    if (!form) return null;
    return {
      _id: form.id,
      id: form.id,
      name: form.name,
      email: form.email,
      phone: form.phone,
      message: form.message,
      createdAt: form.created_at,
      updatedAt: form.updated_at
    };
  }
};

export default FormModel;
