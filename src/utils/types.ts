
export type SystemType = 'cloudhealth' | 'hubspot';

export type CustomerIdentifier = 'id' | 'email' | 'name' | 'customId';

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone?: string;
  customId?: string;
  address?: string;
  created: string;
  lastModified: string;
  status: 'active' | 'inactive' | 'pending';
  system: SystemType;
  annualRevenue?: number;
  employees?: number;
  industry?: string;
  tags?: string[];
  website?: string;
  notes?: string;
  integrationStatus?: 'synced' | 'needs_update' | 'error';
}

export interface SystemMapping {
  sourceSystem: SystemType;
  targetSystem: SystemType;
  sourceIdentifier: CustomerIdentifier;
  targetIdentifier: CustomerIdentifier;
}

export interface CustomerUpdate {
  customerId: string;
  system: SystemType;
  fields: Record<string, any>;
}
