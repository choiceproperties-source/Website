import supabase from '../lib/supabaseClient.js';

const TABLE = 'users';

export const UserModel = {
  async getAll() {
    const { data, error } = await supabase
      .from(TABLE)
      .select('*');
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

  async findOne(conditions) {
    let query = supabase.from(TABLE).select('*');
    
    for (const [key, value] of Object.entries(conditions)) {
      if (key === 'resetTokenExpire' && value.$gt) {
        query = query.gt('reset_token_expire', new Date(value.$gt).toISOString());
      } else {
        query = query.eq(key === 'resetToken' ? 'reset_token' : key, value);
      }
    }
    
    const { data, error } = await query.single();
    if (error && error.code !== 'PGRST116') throw error;
    return data;
  },

  async findByEmail(email) {
    const { data, error } = await supabase
      .from(TABLE)
      .select('*')
      .eq('email', email)
      .single();
    if (error && error.code !== 'PGRST116') throw error;
    return data;
  },

  async create(userData) {
    const { data, error } = await supabase
      .from(TABLE)
      .insert({
        name: userData.name,
        email: userData.email,
        password: userData.password,
        reset_token: userData.resetToken || null,
        reset_token_expire: userData.resetTokenExpire || null,
        created_at: new Date().toISOString()
      })
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async update(id, updateData) {
    const mappedData = {};
    if (updateData.name !== undefined) mappedData.name = updateData.name;
    if (updateData.email !== undefined) mappedData.email = updateData.email;
    if (updateData.password !== undefined) mappedData.password = updateData.password;
    if (updateData.resetToken !== undefined) mappedData.reset_token = updateData.resetToken;
    if (updateData.resetTokenExpire !== undefined) mappedData.reset_token_expire = updateData.resetTokenExpire;
    mappedData.updated_at = new Date().toISOString();

    const { data, error } = await supabase
      .from(TABLE)
      .update(mappedData)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async remove(id) {
    const { error } = await supabase
      .from(TABLE)
      .delete()
      .eq('id', id);
    if (error) throw error;
    return true;
  },

  async count() {
    const { count, error } = await supabase
      .from(TABLE)
      .select('*', { count: 'exact', head: true });
    if (error) throw error;
    return count || 0;
  },

  formatForResponse(user) {
    if (!user) return null;
    return {
      _id: user.id,
      id: user.id,
      name: user.name,
      email: user.email,
      password: user.password,
      resetToken: user.reset_token,
      resetTokenExpire: user.reset_token_expire,
      createdAt: user.created_at,
      updatedAt: user.updated_at
    };
  }
};

export default UserModel;
