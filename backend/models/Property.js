import supabase from '../lib/supabaseClient.js';

const TABLE = 'properties';

export const PropertyModel = {
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

  async findRecent(limit = 5, selectFields = null) {
    let query = supabase.from(TABLE).select(selectFields || '*');
    query = query.order('created_at', { ascending: false }).limit(limit);
    
    const { data, error } = await query;
    if (error) throw error;
    return data.map(this.formatForResponse);
  },

  async create(propertyData) {
    const { data, error } = await supabase
      .from(TABLE)
      .insert({
        title: propertyData.title,
        location: propertyData.location,
        price: propertyData.price,
        image: propertyData.image,
        beds: propertyData.beds,
        baths: propertyData.baths,
        sqft: propertyData.sqft,
        type: propertyData.type,
        availability: propertyData.availability,
        description: propertyData.description,
        amenities: propertyData.amenities,
        phone: propertyData.phone,
        status: propertyData.status || 'active',
        created_at: new Date().toISOString()
      })
      .select()
      .single();
    if (error) throw error;
    return this.formatForResponse(data);
  },

  async update(id, updateData) {
    const mappedData = { updated_at: new Date().toISOString() };
    const fields = ['title', 'location', 'price', 'image', 'beds', 'baths', 'sqft', 'type', 'availability', 'description', 'amenities', 'phone', 'status'];
    
    fields.forEach(field => {
      if (updateData[field] !== undefined) mappedData[field] = updateData[field];
    });

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

  async count(conditions = {}) {
    let query = supabase.from(TABLE).select('*', { count: 'exact', head: true });
    
    for (const [key, value] of Object.entries(conditions)) {
      query = query.eq(key, value);
    }
    
    const { count, error } = await query;
    if (error) throw error;
    return count || 0;
  },

  formatForResponse(property) {
    if (!property) return null;
    return {
      _id: property.id,
      id: property.id,
      title: property.title,
      location: property.location,
      price: property.price,
      image: property.image,
      beds: property.beds,
      baths: property.baths,
      sqft: property.sqft,
      type: property.type,
      availability: property.availability,
      description: property.description,
      amenities: property.amenities,
      phone: property.phone,
      status: property.status,
      createdAt: property.created_at,
      updatedAt: property.updated_at
    };
  }
};

export default PropertyModel;
