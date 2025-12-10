-- SUPABASE TABLES SCHEMA
-- Copy and paste all of this into Supabase SQL Editor and run

-- 1. USERS TABLE (if not already created)
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL,
  reset_token TEXT,
  reset_token_expire TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- 2. PROPERTIES TABLE (for property listings)
CREATE TABLE IF NOT EXISTS properties (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  address TEXT NOT NULL,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  zip TEXT NOT NULL,
  price INTEGER NOT NULL,
  beds INTEGER NOT NULL,
  baths NUMERIC NOT NULL,
  sqft INTEGER NOT NULL,
  description TEXT,
  amenities TEXT,
  images TEXT,
  contact_phone TEXT,
  contact_email TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_properties_city ON properties(city);
CREATE INDEX IF NOT EXISTS idx_properties_created_at ON properties(created_at DESC);

-- 3. APPLICATIONS TABLE (for user applications)
CREATE TABLE IF NOT EXISTS applications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  interest_type TEXT CHECK (interest_type IN ('buy', 'rent', 'sell')),
  budget INTEGER,
  message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_applications_email ON applications(email);
CREATE INDEX IF NOT EXISTS idx_applications_created_at ON applications(created_at DESC);

-- 4. AGENTS TABLE (for real estate agents)
CREATE TABLE IF NOT EXISTS agents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  phone TEXT NOT NULL,
  about TEXT,
  specialties TEXT,
  photo TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_agents_email ON agents(email);

-- 5. CONTACT_FORMS TABLE (for contact form submissions)
CREATE TABLE IF NOT EXISTS contact_forms (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_contact_forms_email ON contact_forms(email);
CREATE INDEX IF NOT EXISTS idx_contact_forms_created_at ON contact_forms(created_at DESC);

-- 6. APPOINTMENTS TABLE (for scheduling)
CREATE TABLE IF NOT EXISTS appointments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  property_id UUID REFERENCES properties(id),
  user_id UUID REFERENCES users(id),
  date DATE NOT NULL,
  time TEXT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed')),
  meeting_link TEXT,
  meeting_platform TEXT DEFAULT 'other',
  notes TEXT,
  cancel_reason TEXT,
  reminder_sent BOOLEAN DEFAULT FALSE,
  feedback_rating INTEGER CHECK (feedback_rating >= 1 AND feedback_rating <= 5),
  feedback_comment TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_appointments_user_id ON appointments(user_id);
CREATE INDEX IF NOT EXISTS idx_appointments_property_id ON appointments(property_id);

-- 7. API_STATS TABLE (for analytics)
CREATE TABLE IF NOT EXISTS api_stats (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  endpoint TEXT NOT NULL,
  method TEXT NOT NULL,
  response_time INTEGER,
  status_code INTEGER,
  timestamp TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_api_stats_endpoint ON api_stats(endpoint);
CREATE INDEX IF NOT EXISTS idx_api_stats_created_at ON api_stats(created_at DESC);

-- 8. NEWSLETTERS TABLE (for newsletter subscriptions)
CREATE TABLE IF NOT EXISTS newsletters (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_newsletters_email ON newsletters(email);
