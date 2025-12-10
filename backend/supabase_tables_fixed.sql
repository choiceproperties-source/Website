-- SUPABASE TABLES - SIMPLIFIED SCHEMA
-- Run one section at a time in Supabase SQL Editor

-- ============================================
-- 1. PROPERTIES TABLE
-- ============================================
DROP TABLE IF EXISTS properties CASCADE;
CREATE TABLE properties (
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
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_properties_city ON properties(city);
CREATE INDEX idx_properties_created_at ON properties(created_at DESC);

-- ============================================
-- 2. APPLICATIONS TABLE
-- ============================================
DROP TABLE IF EXISTS applications CASCADE;
CREATE TABLE applications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  interest_type TEXT,
  budget INTEGER,
  message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_applications_email ON applications(email);
CREATE INDEX idx_applications_created_at ON applications(created_at DESC);

-- ============================================
-- 3. AGENTS TABLE
-- ============================================
DROP TABLE IF EXISTS agents CASCADE;
CREATE TABLE agents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  phone TEXT NOT NULL,
  about TEXT,
  specialties TEXT,
  photo TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_agents_email ON agents(email);

-- ============================================
-- 4. CONTACT_FORMS TABLE
-- ============================================
DROP TABLE IF EXISTS contact_forms CASCADE;
CREATE TABLE contact_forms (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_contact_forms_email ON contact_forms(email);
CREATE INDEX idx_contact_forms_created_at ON contact_forms(created_at DESC);

-- ============================================
-- 5. USERS TABLE
-- ============================================
DROP TABLE IF EXISTS users CASCADE;
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT,
  email TEXT UNIQUE,
  password TEXT,
  reset_token TEXT,
  reset_token_expire TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);

-- ============================================
-- 6. APPOINTMENTS TABLE
-- ============================================
DROP TABLE IF EXISTS appointments CASCADE;
CREATE TABLE appointments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  property_id UUID REFERENCES properties(id) ON DELETE SET NULL,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  date DATE NOT NULL,
  time TEXT NOT NULL,
  status TEXT DEFAULT 'pending',
  meeting_link TEXT,
  meeting_platform TEXT DEFAULT 'other',
  notes TEXT,
  cancel_reason TEXT,
  reminder_sent BOOLEAN DEFAULT FALSE,
  feedback_rating INTEGER,
  feedback_comment TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_appointments_user_id ON appointments(user_id);
CREATE INDEX idx_appointments_property_id ON appointments(property_id);

-- ============================================
-- 7. API_STATS TABLE
-- ============================================
DROP TABLE IF EXISTS api_stats CASCADE;
CREATE TABLE api_stats (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  endpoint TEXT NOT NULL,
  method TEXT NOT NULL,
  response_time INTEGER,
  status_code INTEGER,
  timestamp TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_api_stats_endpoint ON api_stats(endpoint);
CREATE INDEX idx_api_stats_created_at ON api_stats(created_at DESC);

-- ============================================
-- 8. NEWSLETTERS TABLE
-- ============================================
DROP TABLE IF EXISTS newsletters CASCADE;
CREATE TABLE newsletters (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_newsletters_email ON newsletters(email);

-- ============================================
-- DONE! All tables created successfully
-- ============================================
