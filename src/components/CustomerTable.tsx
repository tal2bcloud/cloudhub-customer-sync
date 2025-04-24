
import React, { useState } from 'react';
import { Check, Search, User } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Customer, SystemType } from '@/utils/types';

interface CustomerTableProps {
  customers: Customer[];
  onCustomerSelect: (customerId: string) => void;
  selectedCustomerId?: string;
  title?: string;
}

const CustomerTable: React.FC<CustomerTableProps> = ({ 
  customers, 
  onCustomerSelect, 
  selectedCustomerId,
  title = "Customers"
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  
  const filteredCustomers = customers.filter(customer => 
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (customer.customId && customer.customId.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'synced': return 'bg-green-100 text-green-800';
      case 'needs_update': return 'bg-yellow-100 text-yellow-800';
      case 'error': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getSystemBadge = (system: SystemType) => {
    return system === 'cloudhealth' 
      ? <Badge variant="outline" className="bg-blue-50 text-blue-800 border-blue-200">CloudHealth</Badge>
      : <Badge variant="outline" className="bg-orange-50 text-orange-800 border-orange-200">HubSpot</Badge>;
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center text-xl">
          <User className="h-5 w-5 mr-2" />
          {title}
        </CardTitle>
        <CardDescription>
          {filteredCustomers.length} customers found
        </CardDescription>
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search customers..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="max-h-[600px] overflow-auto">
          <Table>
            <TableHeader className="sticky top-0 bg-card z-10">
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>System</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCustomers.length > 0 ? (
                filteredCustomers.map((customer) => (
                  <TableRow 
                    key={customer.id}
                    className={customer.id === selectedCustomerId ? 'bg-secondary' : undefined}
                  >
                    <TableCell className="font-medium">
                      {customer.name}
                      {customer.integrationStatus === 'needs_update' && (
                        <Badge variant="outline" className="ml-2 bg-yellow-50 text-yellow-800 border-yellow-200">Needs Update</Badge>
                      )}
                    </TableCell>
                    <TableCell>{customer.email}</TableCell>
                    <TableCell>{getSystemBadge(customer.system)}</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(customer.status)}>{customer.status}</Badge>
                    </TableCell>
                    <TableCell>
                      <Button 
                        variant={customer.id === selectedCustomerId ? "default" : "outline"} 
                        size="sm"
                        onClick={() => onCustomerSelect(customer.id)}
                        className="flex items-center"
                      >
                        {customer.id === selectedCustomerId && (
                          <Check className="h-4 w-4 mr-1" />
                        )}
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-10 text-muted-foreground">
                    No customers found. Try a different search term.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default CustomerTable;
