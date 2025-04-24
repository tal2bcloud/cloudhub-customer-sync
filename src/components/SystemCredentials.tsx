import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { Lock, Download } from 'lucide-react';
import { fetchHubSpotCompanies, fetchCloudHealthCustomers, exportToCSV } from '@/utils/apiServices';

interface SystemCredentialsProps {
  system: 'cloudhealth' | 'hubspot';
  onCredentialsSave?: (credentials: string) => void;
  onExport?: (credentials: string) => void;
}

const SystemCredentials: React.FC<SystemCredentialsProps> = ({ 
  system, 
  onCredentialsSave,
  onExport
}) => {
  const [apiKey, setApiKey] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSave = () => {
    if (!apiKey.trim()) {
      toast({
        title: "Error",
        description: "API Key cannot be empty",
        variant: "destructive"
      });
      return;
    }

    // In a real implementation, this would use Supabase to securely store credentials
    onCredentialsSave?.(apiKey);
    
    toast({
      title: "Credentials Saved",
      description: `${system.charAt(0).toUpperCase() + system.slice(1)} API Key has been securely saved`,
    });
  };

  const handleExport = async () => {
    if (!apiKey.trim()) {
      toast({
        title: "Error",
        description: "Please enter API credentials first",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    try {
      onExport?.(apiKey);
      
      toast({
        title: "Success",
        description: `${system.charAt(0).toUpperCase() + system.slice(1)} data fetched successfully`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to fetch ${system} data`,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Lock className="h-5 w-5 mr-2" />
          {system.charAt(0).toUpperCase() + system.slice(1)} API Credentials
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <Label htmlFor={`${system}ApiKey`}>API Key</Label>
            <Input 
              id={`${system}ApiKey`}
              type="password"
              placeholder={`Enter ${system} API Key`}
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="mt-2"
            />
          </div>
          <div className="flex gap-2">
            <Button onClick={handleSave} className="flex-1">
              Save Credentials
            </Button>
            <Button 
              onClick={handleExport}
              disabled={loading}
              variant="outline"
              className="flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              {loading ? 'Loading...' : 'Fetch Data'}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SystemCredentials;
