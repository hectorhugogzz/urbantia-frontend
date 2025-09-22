// src/types/index.ts

/**
 * Represents a Place of Interest (POI) near a property.
 * Corresponds to the structure of the nearby_pois_json field.
 */
export interface PlaceOfInterest {
  name: string;
  type: 'university' | 'hospital' | 'shopping_center' | 'workplace' | 'other';
  distance_km: number;
}

/**
 * Represents the main Property data structure, mirroring the 'properties' table in the database.
 */
export interface Property {
  id: number;
  listing_id: string | null;

  // Foreign Keys
  development_id: number | null;
  builder_contact_id: number | null;
  sourcing_contact_id: number | null;

  // Core Attributes
  property_name: string;
  description: string | null;
  property_type: 'house' | 'townhouse' | 'department' | 'lot';
  property_status: 'new' | 'pre_owned' | 'pre_sale';
  listing_status: 'available' | 'pending' | 'sold' | 'draft';

  // Location Attributes
  address: string | null;
  city: string;
  location_zone: string | null;
  location_lat: number | null;
  location_lon: number | null;
  is_in_gated_community: boolean;

  // Size & Structure Attributes
  lot_area_sq_meters: number | null;
  construction_area_sq_meters: number | null;
  stories: number | null;
  bedrooms: number | null;
  bathrooms: number | null;
  studio: boolean;
  parking_slots: number | null;

  // Feature Flags
  has_garage: boolean;
  has_patio: boolean;
  has_roof_garden: boolean;
  has_pool: boolean;

  // Financials
  price_mxn: number;
  maintenance_fee_mxn: number | null;

  // JSON Data Fields
  nearby_pois_json: PlaceOfInterest[] | null;
  property_amenities_json: Record<string, boolean | string> | null; // e.g., {"private_pool": true, "kitchen_finish": "granite"}

  // Media & URLs
  virtual_tour_url: string | null;
  floor_plan_urls: string[] | null;
  gcs_image_urls: string[] | null;
  gcs_video_urls: string[] | null;

  // Metadata
  build_date: string | null; // Using string for date to simplify data transfer (ISO 8601 format)
  created_at: string;
  updated_at: string;
}

/**
 * Represents a Development or Gated Community, mirroring the 'developments' table.
 */
export interface Development {
  id: number;
  name: string;
  city: string | null;
  location_zone: string | null;
  common_amenities_json: Record<string, boolean | string> | null;
  created_at: string;
}

/**
 * Represents a Contact, mirroring the 'contacts' table.
 */
export interface Contact {
  id: number;
  full_name: string;
  company_name: string | null;
  contact_type: 'builder' | 'sourcing_agent' | 'closing_partner';
  phone_number: string | null;
  email: string | null;
  created_at: string;
}