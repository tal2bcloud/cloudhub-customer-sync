
import { Customer, SystemType } from './types';

export const generateMockCustomers = (count: number, system: SystemType): Customer[] => {
  const customers: Customer[] = [];
  
  const industries = ['Technology', 'Healthcare', 'Finance', 'Education', 'Manufacturing', 'Retail'];
  const statuses: ('active' | 'inactive' | 'pending')[] = ['active', 'inactive', 'pending'];
  
  for (let i = 0; i < count; i++) {
    const id = `${system}-${i + 1000}`;
    const name = `${system === 'cloudhealth' ? 'CH' : 'HS'} Company ${i + 1}`;
    const email = `contact@${name.toLowerCase().replace(' ', '')}.com`;
    const industry = industries[Math.floor(Math.random() * industries.length)];
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const created = new Date(Date.now() - Math.random() * 10000000000).toISOString();
    const lastModified = new Date(Date.now() - Math.random() * 1000000000).toISOString();
    const annualRevenue = Math.floor(Math.random() * 1000000) + 100000;
    const employees = Math.floor(Math.random() * 1000) + 10;
    
    customers.push({
      id,
      name,
      email,
      phone: `+1${Math.floor(Math.random() * 9000000000) + 1000000000}`,
      customId: `${system[0].toUpperCase()}${Math.floor(Math.random() * 100000)}`,
      address: `${Math.floor(Math.random() * 1000) + 1} Main St, City, State`,
      created,
      lastModified,
      status,
      system,
      industry,
      annualRevenue,
      employees,
      website: `https://www.${name.toLowerCase().replace(' ', '')}.com`,
      tags: [industry, status, system],
      integrationStatus: Math.random() > 0.7 ? 'needs_update' : 'synced'
    });
  }
  
  return customers;
};

export const cloudHealthCustomers = generateMockCustomers(15, 'cloudhealth');
export const hubspotCustomers = generateMockCustomers(15, 'hubspot');

export const getAllCustomers = () => [...cloudHealthCustomers, ...hubspotCustomers];

export const getCustomerById = (id: string) => {
  return getAllCustomers().find(customer => customer.id === id);
};

export const getCustomersBySystem = (system: SystemType) => {
  return getAllCustomers().filter(customer => customer.system === system);
};

export const updateCustomer = (id: string, updates: Partial<Customer>): Customer => {
  const allCustomers = getAllCustomers();
  const customerIndex = allCustomers.findIndex(c => c.id === id);
  
  if (customerIndex === -1) {
    throw new Error(`Customer with id ${id} not found`);
  }
  
  const updatedCustomer = {
    ...allCustomers[customerIndex],
    ...updates,
    lastModified: new Date().toISOString()
  };
  
  if (allCustomers[customerIndex].system === 'cloudhealth') {
    const index = cloudHealthCustomers.findIndex(c => c.id === id);
    if (index !== -1) cloudHealthCustomers[index] = updatedCustomer;
  } else {
    const index = hubspotCustomers.findIndex(c => c.id === id);
    if (index !== -1) hubspotCustomers[index] = updatedCustomer;
  }
  
  return updatedCustomer;
};
