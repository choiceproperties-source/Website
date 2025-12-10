import supabase from '../lib/supabaseClient.js';

const TABLE = 'agents';

export const AgentModel = {
  async getAll() {
    const { data, error } = await supabase
      .from(TABLE)
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data;
  },

  async getById(id) {
    const { data, error } = await supabase
      .from(TABLE)
      .select('*')
      .eq('id', id)
      .single();
    if (error && error.code !== 'PGRST116') throw error;
    return data;
  },

  async create(agentData) {
    const { data, error } = await supabase
      .from(TABLE)
      .insert({
        name: agentData.name,
        email: agentData.email,
        phone: agentData.phone,
        about: agentData.about || null,
        specialties: agentData.specialties,
        photo: agentData.photo || null,
        created_at: new Date().toISOString()
      })
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async update(id, updateData) {
    const { data, error } = await supabase
      .from(TABLE)
      .update(updateData)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  }
};

export default AgentModel;
