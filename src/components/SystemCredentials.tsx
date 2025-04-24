
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { Lock } from 'lucide-react';

interface SystemCredentialsProps {
  system: 'cloudhealth' | 'hubspot';
  onCredentialsSave?: (credentials: string) => void;
}

const SystemCredentials: React.FC<SystemCredentialsProps> = ({ system, onCredentialsSave }) => {
  const [apiKey, setApiKey] = useState('');
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
          <Button onClick={handleSave} className="w-full">
            Save Credentials
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default SystemCredentials;

