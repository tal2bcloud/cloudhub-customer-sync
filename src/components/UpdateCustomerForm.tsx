
import React, { useState } from 'react';
import { Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { Customer } from '@/utils/types';

interface UpdateCustomerFormProps {
  customer: Customer;
  onUpdateCustomer: (updates: Partial<Customer>) => void;
}

const UpdateCustomerForm: React.FC<UpdateCustomerFormProps> = ({ customer, onUpdateCustomer }) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState<Partial<Customer>>({
    name: customer.name,
    email: customer.email,
    phone: customer.phone || '',
    website: customer.website || '',
    address: customer.address || '',
    industry: customer.industry || '',
    status: customer.status,
    employees: customer.employees || 0,
    annualRevenue: customer.annualRevenue || 0,
    notes: customer.notes || '',
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  
  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value ? Number(value) : undefined }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate an API call
    setTimeout(() => {
      onUpdateCustomer({
        ...formData,
        integrationStatus: 'needs_update'
      });
      
      toast({
        title: "Customer updated",
        description: "Customer data has been updated successfully.",
      });
      
      setIsSubmitting(false);
    }, 1000);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <Label htmlFor="name">Company Name</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="mt-1"
              required
            />
          </div>
          
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              className="mt-1"
              required
            />
          </div>
          
          <div>
            <Label htmlFor="phone">Phone</Label>
            <Input
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              className="mt-1"
            />
          </div>
          
          <div>
            <Label htmlFor="website">Website</Label>
            <Input
              id="website"
              name="website"
              value={formData.website}
              onChange={handleInputChange}
              className="mt-1"
            />
          </div>
          
          <div>
            <Label htmlFor="address">Address</Label>
            <Input
              id="address"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              className="mt-1"
            />
          </div>
        </div>
        
        <div className="space-y-4">
          <div>
            <Label htmlFor="industry">Industry</Label>
            <Input
              id="industry"
              name="industry"
              value={formData.industry}
              onChange={handleInputChange}
              className="mt-1"
            />
          </div>
          
          <div>
            <Label htmlFor="status">Status</Label>
            <Select 
              value={formData.status} 
              onValueChange={(value) => handleSelectChange('status', value)}
            >
              <SelectTrigger id="status" className="mt-1">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="employees">Employees</Label>
            <Input
              id="employees"
              name="employees"
              type="number"
              min="0"
              value={formData.employees?.toString() || ''}
              onChange={handleNumberChange}
              className="mt-1"
            />
          </div>
          
          <div>
            <Label htmlFor="annualRevenue">Annual Revenue ($)</Label>
            <Input
              id="annualRevenue"
              name="annualRevenue"
              type="number"
              min="0"
              value={formData.annualRevenue?.toString() || ''}
              onChange={handleNumberChange}
              className="mt-1"
            />
          </div>
          
          <div>
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleInputChange}
              className="mt-1"
              rows={3}
            />
          </div>
        </div>
      </div>
      
      <div className="mt-6 flex justify-end">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Updating...' : (
            <span className="flex items-center">
              <Check className="h-4 w-4 mr-2" />
              Update Customer
            </span>
          )}
        </Button>
      </div>
    </form>
  );
};

export default UpdateCustomerForm;
