
import React from 'react';
import { Edit, User } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Customer } from '@/utils/types';
import { Badge } from '@/components/ui/badge';
import UpdateCustomerForm from './UpdateCustomerForm';

interface CustomerDetailProps {
  customer?: Customer;
  onUpdateCustomer: (updates: Partial<Customer>) => void;
}

const CustomerDetail: React.FC<CustomerDetailProps> = ({ customer, onUpdateCustomer }) => {
  if (!customer) {
    return (
      <Card className="h-full">
        <CardContent className="flex items-center justify-center h-full">
          <div className="text-center text-muted-foreground">
            <User className="h-12 w-12 mx-auto mb-4 opacity-30" />
            <p>Select a customer to view details</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getSystemBadge = (system: 'cloudhealth' | 'hubspot') => {
    return system === 'cloudhealth' 
      ? <Badge variant="outline" className="bg-blue-50 text-blue-800 border-blue-200">CloudHealth</Badge>
      : <Badge variant="outline" className="bg-orange-50 text-orange-800 border-orange-200">HubSpot</Badge>;
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-xl flex items-center">
              <User className="h-5 w-5 mr-2" /> {customer.name}
            </CardTitle>
            <CardDescription className="flex items-center mt-1">
              {getSystemBadge(customer.system)}
              <span className="mx-2">•</span>
              ID: {customer.id}
              {customer.customId && (
                <>
                  <span className="mx-2">•</span>
                  Custom ID: {customer.customId}
                </>
              )}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="details">
          <TabsList className="grid grid-cols-2">
            <TabsTrigger value="details">Customer Details</TabsTrigger>
            <TabsTrigger value="update">Update Customer</TabsTrigger>
          </TabsList>
          
          <TabsContent value="details" className="pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-sm">Contact Information</h4>
                  <div className="mt-2 space-y-2">
                    <div className="flex">
                      <span className="text-muted-foreground w-24">Email:</span>
                      <span>{customer.email}</span>
                    </div>
                    {customer.phone && (
                      <div className="flex">
                        <span className="text-muted-foreground w-24">Phone:</span>
                        <span>{customer.phone}</span>
                      </div>
                    )}
                    {customer.website && (
                      <div className="flex">
                        <span className="text-muted-foreground w-24">Website:</span>
                        <span>
                          <a href={customer.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                            {customer.website}
                          </a>
                        </span>
                      </div>
                    )}
                    {customer.address && (
                      <div className="flex">
                        <span className="text-muted-foreground w-24">Address:</span>
                        <span>{customer.address}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-sm">Company Information</h4>
                  <div className="mt-2 space-y-2">
                    {customer.industry && (
                      <div className="flex">
                        <span className="text-muted-foreground w-24">Industry:</span>
                        <span>{customer.industry}</span>
                      </div>
                    )}
                    {customer.employees !== undefined && (
                      <div className="flex">
                        <span className="text-muted-foreground w-24">Employees:</span>
                        <span>{customer.employees.toLocaleString()}</span>
                      </div>
                    )}
                    {customer.annualRevenue !== undefined && (
                      <div className="flex">
                        <span className="text-muted-foreground w-24">Revenue:</span>
                        <span>${customer.annualRevenue.toLocaleString()}</span>
                      </div>
                    )}
                    <div className="flex">
                      <span className="text-muted-foreground w-24">Status:</span>
                      <span>
                        <Badge variant="outline" className={
                          customer.status === 'active' ? 'bg-green-100 text-green-800' : 
                          customer.status === 'inactive' ? 'bg-gray-100 text-gray-800' : 
                          'bg-yellow-100 text-yellow-800'
                        }>
                          {customer.status.charAt(0).toUpperCase() + customer.status.slice(1)}
                        </Badge>
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="font-medium text-sm">System Information</h4>
                  <div className="mt-2 space-y-2">
                    <div className="flex">
                      <span className="text-muted-foreground w-24">Created:</span>
                      <span>{formatDate(customer.created)}</span>
                    </div>
                    <div className="flex">
                      <span className="text-muted-foreground w-24">Modified:</span>
                      <span>{formatDate(customer.lastModified)}</span>
                    </div>
                    {customer.integrationStatus && (
                      <div className="flex">
                        <span className="text-muted-foreground w-24">Integration:</span>
                        <span>
                          <Badge variant="outline" className={
                            customer.integrationStatus === 'synced' ? 'bg-green-100 text-green-800' : 
                            customer.integrationStatus === 'needs_update' ? 'bg-yellow-100 text-yellow-800' : 
                            'bg-red-100 text-red-800'
                          }>
                            {customer.integrationStatus === 'synced' ? 'Synced' : 
                             customer.integrationStatus === 'needs_update' ? 'Needs Update' : 'Error'}
                          </Badge>
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {customer.tags && customer.tags.length > 0 && (
                  <div>
                    <h4 className="font-medium text-sm">Tags</h4>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {customer.tags.map((tag, index) => (
                        <Badge key={index} variant="secondary">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {customer.notes && (
                  <div>
                    <h4 className="font-medium text-sm">Notes</h4>
                    <p className="text-sm mt-2">{customer.notes}</p>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="update" className="pt-4">
            <UpdateCustomerForm 
              customer={customer}
              onUpdateCustomer={onUpdateCustomer}
            />
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter>
        <div className="text-xs text-muted-foreground flex items-center">
          <Edit className="h-3 w-3 mr-1" />
          Last modified: {formatDate(customer.lastModified)}
        </div>
      </CardFooter>
    </Card>
  );
};

export default CustomerDetail;
