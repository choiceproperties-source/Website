import supabase from '../lib/supabaseClient.js';

const TABLE = 'applications';

export const ApplicationModel = {
  async getAll() {
    const { data, error } = await supabase
      .from(TABLE)
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  },

  async create(applicationData) {
    const { data, error } = await supabase
      .from(TABLE)
      .insert({
        name: applicationData.name,
        email: applicationData.email,
        phone: applicationData.phone,
        interest_type: applicationData.interested_in || applicationData.interest_type,
        budget: applicationData.budget_max || null,
        message: applicationData.message,
        created_at: new Date().toISOString()
      })
      .select()
      .single();
    if (error) throw error;
    return data;
  }
};

export default ApplicationModel;
