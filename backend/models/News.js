import supabase from '../lib/supabaseClient.js';

const TABLE = 'newsletters';

export const NewsModel = {
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

  async findByEmail(email) {
    const { data, error } = await supabase
      .from(TABLE)
      .select('*')
      .eq('email', email.toLowerCase().trim())
      .single();
    if (error && error.code !== 'PGRST116') throw error;
    return data ? this.formatForResponse(data) : null;
  },

  async create(newsData) {
    const { data, error } = await supabase
      .from(TABLE)
      .insert({
        email: newsData.email.toLowerCase().trim(),
        created_at: new Date().toISOString()
      })
      .select()
      .single();
    if (error) throw error;
    return this.formatForResponse(data);
  },

  async update(id, updateData) {
    const { data, error } = await supabase
      .from(TABLE)
      .update({
        email: updateData.email,
        updated_at: new Date().toISOString()
      })
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

  formatForResponse(news) {
    if (!news) return null;
    return {
      _id: news.id,
      id: news.id,
      email: news.email,
      createdAt: news.created_at,
      updatedAt: news.updated_at
    };
  }
};

export default NewsModel;
