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

export interface HubSpotCompany {
  id: string;
  properties: {
    name: string;
    azure_model: string;
    lifecyclestage: string;
    company_owner: string;
    management_account: string;
    [key: string]: string;
  };
}

export interface CloudHealthCustomer {
  id: string;
  name: string;
  [key: string]: any;
}

export interface ComparisonTableRow {
  hubspotId?: string;
  hubspotName?: string;
  cloudHealthId?: string;
  cloudHealthName?: string;
  matchStatus: 'matched' | 'hubspot_only' | 'cloudhealth_only';
  similarity?: number;
}
