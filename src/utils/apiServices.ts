
import { toast } from "@/components/ui/use-toast";
import { HubSpotCompany, CloudHealthCustomer } from "@/utils/types";

export const fetchHubSpotCompanies = async (apiKey: string) => {
  try {
    console.log("Fetching HubSpot companies with API key:", apiKey ? "API key provided" : "No API key");
    
    const response = await fetch('https://api.hubapi.com/crm/v3/objects/companies/search', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        filterGroups: [
          {
            filters: [
              {
                propertyName: 'azure_model',
                operator: 'EQ',
                value: 'CSP'
              },
              {
                propertyName: 'lifecyclestage',
                operator: 'EQ',
                value: 'customer'
              },
              {
                propertyName: 'management_account',
                operator: 'EQ',
                value: 'Yes'
              },
              {
                propertyName: 'company_owner',
                operator: 'IN',
                values: [
                  'Aaron McDaniel',
                  'Or Alperovitch',
                  'Romi Feidman',
                  'Nir Kluberg',
                  'Shaked Haim',
                  'Matt Edwards'
                ]
              }
            ]
          }
        ],
        properties: ['*'], // Fetch all properties
        limit: 100
      })
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('HubSpot API error:', response.status, errorData);
      throw new Error(`Failed to fetch HubSpot companies: ${response.status} ${errorData}`);
    }

    const data = await response.json();
    console.log('HubSpot data retrieved:', data.results ? `${data.results.length} companies` : 'No results');
    return data.results;
  } catch (error) {
    console.error('Error in fetchHubSpotCompanies:', error);
    toast({
      title: "Error",
      description: `Failed to fetch HubSpot companies: ${error instanceof Error ? error.message : 'Unknown error'}`,
      variant: "destructive"
    });
    return [];
  }
};

export const fetchCloudHealthCustomers = async (apiKey: string) => {
  try {
    console.log("Fetching CloudHealth customers with API key:", apiKey ? "API key provided" : "No API key");
    
    const response = await fetch('https://chapi.cloudhealthtech.com/v1/customers?per_page=1000', {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      }
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('CloudHealth API error:', response.status, errorData);
      throw new Error(`Failed to fetch CloudHealth customers: ${response.status} ${errorData}`);
    }

    const data = await response.json();
    console.log('CloudHealth data retrieved:', data.customers ? `${data.customers.length} customers` : 'No customers');
    return data.customers;
  } catch (error) {
    console.error('Error in fetchCloudHealthCustomers:', error);
    toast({
      title: "Error",
      description: `Failed to fetch CloudHealth customers: ${error instanceof Error ? error.message : 'Unknown error'}`,
      variant: "destructive"
    });
    return [];
  }
};

export const exportToCSV = (data: any[], filename: string) => {
  // Convert all object properties to CSV
  const headers = Array.from(new Set(
    data.flatMap(obj => Object.keys(obj.properties || obj))
  ));

  const csvContent = [
    headers.join(','), // CSV header row
    ...data.map(item => {
      return headers.map(header => {
        const value = (item.properties?.[header] || item[header] || '').toString();
        // Escape quotes and wrap in quotes if contains comma
        return value.includes(',') ? `"${value.replace(/"/g, '""')}"` : value;
      }).join(',');
    })
  ].join('\n');

  // Create and trigger download
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('link');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
