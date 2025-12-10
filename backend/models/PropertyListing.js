import supabase from '../lib/supabaseClient.js';

const TABLE = 'properties';

export const PropertyListingModel = {
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

  async create(propertyData) {
    const { data, error } = await supabase
      .from(TABLE)
      .insert({
        title: propertyData.title,
        address: propertyData.address,
        city: propertyData.city,
        state: propertyData.state,
        zip: propertyData.zip,
        price: propertyData.price,
        beds: propertyData.beds,
        baths: propertyData.baths,
        sqft: propertyData.sqft,
        description: propertyData.description,
        amenities: propertyData.amenities,
        images: propertyData.images || null,
        contact_phone: propertyData.contact_phone,
        contact_email: propertyData.contact_email,
        created_at: new Date().toISOString()
      })
      .select()
      .single();
    if (error) throw error;
    return data;
  },

  async update(id, updateData) {
    const mappedData = {};
    const fields = ['title', 'address', 'city', 'state', 'zip', 'price', 'beds', 'baths', 'sqft', 'description', 'amenities', 'images', 'contact_phone', 'contact_email'];
    
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
    return data;
  },

  async remove(id) {
    const { error } = await supabase
      .from(TABLE)
      .delete()
      .eq('id', id);
    if (error) throw error;
    return true;
  }
};

export default PropertyListingModel;
