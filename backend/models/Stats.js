import supabase from '../lib/supabaseClient.js';

const TABLE = 'api_stats';

export const StatsModel = {
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

  async create(statsData) {
    const { data, error } = await supabase
      .from(TABLE)
      .insert({
        endpoint: statsData.endpoint,
        method: statsData.method,
        response_time: statsData.responseTime,
        status_code: statsData.statusCode,
        timestamp: statsData.timestamp || new Date().toISOString(),
        created_at: new Date().toISOString()
      })
      .select()
      .single();
    if (error) throw error;
    return this.formatForResponse(data);
  },

  async getViewsData(days = 30) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const { data, error } = await supabase
      .from(TABLE)
      .select('timestamp')
      .like('endpoint', '/api/products/single/%')
      .eq('method', 'GET')
      .gte('timestamp', startDate.toISOString());

    if (error) throw error;

    const countsByDate = {};
    data.forEach(stat => {
      const dateStr = new Date(stat.timestamp).toISOString().split('T')[0];
      countsByDate[dateStr] = (countsByDate[dateStr] || 0) + 1;
    });

    const labels = [];
    const counts = [];
    for (let i = days; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateString = date.toISOString().split('T')[0];
      labels.push(dateString);
      counts.push(countsByDate[dateString] || 0);
    }

    return {
      labels,
      datasets: [{
        label: 'Property Views',
        data: counts,
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        tension: 0.4,
        fill: true
      }]
    };
  },

  async remove(id) {
    const { error } = await supabase
      .from(TABLE)
      .delete()
      .eq('id', id);
    if (error) throw error;
    return true;
  },

  formatForResponse(stat) {
    if (!stat) return null;
    return {
      _id: stat.id,
      id: stat.id,
      endpoint: stat.endpoint,
      method: stat.method,
      responseTime: stat.response_time,
      statusCode: stat.status_code,
      timestamp: stat.timestamp,
      createdAt: stat.created_at
    };
  }
};

export default StatsModel;
