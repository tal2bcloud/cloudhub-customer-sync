import React, { useState, useEffect } from 'react';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { useToast } from '@/components/ui/use-toast';
import Sidebar from '@/components/Sidebar';
import CustomerTable from '@/components/CustomerTable';
import CustomerDetail from '@/components/CustomerDetail';
import SystemSelector from '@/components/SystemSelector';
import SystemCredentials from '@/components/SystemCredentials';
import SystemComparison from '@/components/SystemComparison';
import { 
  Customer, 
  CustomerIdentifier, 
  SystemMapping, 
  SystemType, 
  HubSpotCompany, 
  CloudHealthCustomer 
} from '@/utils/types';
import { getAllCustomers, getCustomerById, getCustomersBySystem, updateCustomer } from '@/utils/mockData';
import { fetchHubSpotCompanies, fetchCloudHealthCustomers } from '@/utils/apiServices';

const Index = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('customers');
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | undefined>();
  const [selectedSystem, setSelectedSystem] = useState<SystemType | 'all'>('all');
  const [systemMapping, setSystemMapping] = useState<SystemMapping>({
    sourceSystem: 'cloudhealth',
    targetSystem: 'hubspot',
    sourceIdentifier: 'email',
    targetIdentifier: 'email',
  });
  const [systemCredentials, setSystemCredentials] = useState<{
    cloudhealth?: string;
    hubspot?: string;
  }>({});
  const [hubspotCompanies, setHubspotCompanies] = useState<HubSpotCompany[]>([]);
  const [cloudHealthCustomers, setCloudHealthCustomers] = useState<CloudHealthCustomer[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const cloudHealthKey = sessionStorage.getItem('cloudhealth-api-key');
    const hubspotKey = sessionStorage.getItem('hubspot-api-key');
    
    if (cloudHealthKey || hubspotKey) {
      setSystemCredentials({
        cloudhealth: cloudHealthKey || undefined,
        hubspot: hubspotKey || undefined
      });
      console.log("Loaded saved credentials from session storage");
    }
  }, []);

  const customers = selectedSystem === 'all' 
    ? getAllCustomers() 
    : getCustomersBySystem(selectedSystem);

  const selectedCustomer = selectedCustomerId 
    ? getCustomerById(selectedCustomerId)
    : undefined;

  const handleCustomerSelect = (customerId: string) => {
    setSelectedCustomerId(customerId);
  };

  const handleUpdateCustomer = (updates: Partial<Customer>) => {
    if (!selectedCustomerId) return;
    
    try {
      const updatedCustomer = updateCustomer(selectedCustomerId, updates);
      setSelectedCustomerId(updatedCustomer.id); // Refresh selection with updated customer
    } catch (error) {
      toast({
        title: "Update failed",
        description: (error as Error).message,
        variant: "destructive",
      });
    }
  };

  const handleSystemMappingChange = (updates: Partial<SystemMapping>) => {
    setSystemMapping(prev => ({ ...prev, ...updates }));
    
    if (updates.sourceSystem) {
      setSelectedSystem(updates.sourceSystem);
    }
  };

  const handleCredentialsSave = (system: 'cloudhealth' | 'hubspot', credentials: string) => {
    console.log(`Saving ${system} credentials`);
    setSystemCredentials(prev => ({
      ...prev,
      [system]: credentials
    }));
  };

  const handleExportData = async (system: 'cloudhealth' | 'hubspot', apiKey: string) => {
    setIsLoading(true);
    console.log(`Starting export for ${system}`);
    
    try {
      if (system === 'hubspot') {
        const data = await fetchHubSpotCompanies(apiKey);
        console.log(`Fetched ${data?.length || 0} HubSpot companies`);
        setHubspotCompanies(data || []);
      } else {
        const data = await fetchCloudHealthCustomers(apiKey);
        console.log(`Fetched ${data?.length || 0} CloudHealth customers`);
        setCloudHealthCustomers(data || []);
      }
    } catch (error) {
      console.error(`Error in handleExportData for ${system}:`, error);
      toast({
        title: "Error",
        description: `Failed to fetch ${system} data: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'customers':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-full">
            <CustomerTable 
              customers={customers} 
              onCustomerSelect={handleCustomerSelect}
              selectedCustomerId={selectedCustomerId}
              title={`${selectedSystem === 'all' ? 'All' : selectedSystem === 'cloudhealth' ? 'CloudHealth' : 'HubSpot'} Customers`}
            />
            <CustomerDetail 
              customer={selectedCustomer}
              onUpdateCustomer={handleUpdateCustomer}
            />
          </div>
        );
      case 'mapping':
        return (
          <div className="space-y-6">
            <SystemSelector 
              mapping={systemMapping}
              onMappingChange={handleSystemMappingChange}
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <SystemCredentials 
                system="cloudhealth" 
                onCredentialsSave={(cred) => handleCredentialsSave('cloudhealth', cred)}
                onExport={(cred) => handleExportData('cloudhealth', cred)}
              />
              <SystemCredentials 
                system="hubspot" 
                onCredentialsSave={(cred) => handleCredentialsSave('hubspot', cred)}
                onExport={(cred) => handleExportData('hubspot', cred)}
              />
            </div>

            {(hubspotCompanies.length > 0 || cloudHealthCustomers.length > 0) && (
              <SystemComparison
                hubspotData={hubspotCompanies}
                cloudHealthData={cloudHealthCustomers}
              />
            )}
          </div>
        );
      case 'data':
        return (
          <div className="flex flex-col h-full justify-center items-center text-center p-12">
            <h2 className="text-2xl font-bold mb-4">Data Management</h2>
            <p className="text-muted-foreground mb-6 max-w-lg">
              This section allows for bulk data operations between CloudHealth and HubSpot systems. 
              Upload, download, and synchronize customer data across platforms.
            </p>
            <div className="p-8 border border-dashed rounded-lg text-center text-muted-foreground">
              Data management functionality would be implemented here based on your Python integration scripts.
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
        <div className="flex-1 flex flex-col">
          <header className="border-b p-4 bg-background flex items-center justify-between">
            <div className="flex items-center">
              <SidebarTrigger />
              <h1 className="text-lg font-medium ml-4">
                CloudHub Customer Sync {isLoading && '(Loading...)'}
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              {activeTab === 'customers' && (
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-muted-foreground">Filter by system:</span>
                  <select
                    className="text-sm border rounded px-2 py-1"
                    value={selectedSystem}
                    onChange={(e) => setSelectedSystem(e.target.value as SystemType | 'all')}
                  >
                    <option value="all">All Systems</option>
                    <option value="cloudhealth">CloudHealth</option>
                    <option value="hubspot">HubSpot</option>
                  </select>
                </div>
              )}
            </div>
          </header>
          <main className="flex-1 p-6">
            {renderContent()}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Index;
