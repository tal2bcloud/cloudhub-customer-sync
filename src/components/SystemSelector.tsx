
import React from 'react';
import { Check, Filter } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CustomerIdentifier, SystemMapping, SystemType } from '@/utils/types';

interface SystemSelectorProps {
  mapping: SystemMapping;
  onMappingChange: (mapping: Partial<SystemMapping>) => void;
}

const SystemSelector: React.FC<SystemSelectorProps> = ({ mapping, onMappingChange }) => {
  const handleSystemChange = (system: SystemType, isSource: boolean) => {
    if (isSource) {
      onMappingChange({ sourceSystem: system });
    } else {
      onMappingChange({ targetSystem: system });
    }
  };

  const handleIdentifierChange = (identifier: CustomerIdentifier, isSource: boolean) => {
    if (isSource) {
      onMappingChange({ sourceIdentifier: identifier });
    } else {
      onMappingChange({ targetIdentifier: identifier });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Filter className="h-5 w-5 mr-2" />
          System Integration Configuration
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="sourceSystem">Source System</Label>
              <RadioGroup
                id="sourceSystem"
                value={mapping.sourceSystem}
                onValueChange={(value) => handleSystemChange(value as SystemType, true)}
                className="flex mt-2 space-x-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="cloudhealth" id="source-cloudhealth" />
                  <Label htmlFor="source-cloudhealth" className="font-normal">CloudHealth</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="hubspot" id="source-hubspot" />
                  <Label htmlFor="source-hubspot" className="font-normal">HubSpot</Label>
                </div>
              </RadioGroup>
            </div>
            
            <div>
              <Label htmlFor="sourceIdentifier">Source Identifier</Label>
              <Select
                value={mapping.sourceIdentifier}
                onValueChange={(value) => handleIdentifierChange(value as CustomerIdentifier, true)}
              >
                <SelectTrigger id="sourceIdentifier" className="mt-2">
                  <SelectValue placeholder="Select identifier" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="id">ID</SelectItem>
                  <SelectItem value="email">Email</SelectItem>
                  <SelectItem value="name">Company Name</SelectItem>
                  <SelectItem value="customId">Custom ID</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="targetSystem">Target System</Label>
              <RadioGroup
                id="targetSystem"
                value={mapping.targetSystem}
                onValueChange={(value) => handleSystemChange(value as SystemType, false)}
                className="flex mt-2 space-x-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="cloudhealth" id="target-cloudhealth" />
                  <Label htmlFor="target-cloudhealth" className="font-normal">CloudHealth</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="hubspot" id="target-hubspot" />
                  <Label htmlFor="target-hubspot" className="font-normal">HubSpot</Label>
                </div>
              </RadioGroup>
            </div>
            
            <div>
              <Label htmlFor="targetIdentifier">Target Identifier</Label>
              <Select
                value={mapping.targetIdentifier}
                onValueChange={(value) => handleIdentifierChange(value as CustomerIdentifier, false)}
              >
                <SelectTrigger id="targetIdentifier" className="mt-2">
                  <SelectValue placeholder="Select identifier" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="id">ID</SelectItem>
                  <SelectItem value="email">Email</SelectItem>
                  <SelectItem value="name">Company Name</SelectItem>
                  <SelectItem value="customId">Custom ID</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <div className="flex items-center mt-6 p-3 bg-muted rounded-md">
          <Check className="h-5 w-5 text-green-500 mr-2" />
          <span className="text-sm">
            Mapping: {mapping.sourceSystem} ({mapping.sourceIdentifier}) → {mapping.targetSystem} ({mapping.targetIdentifier})
          </span>
        </div>
      </CardContent>
    </Card>
  );
};

export default SystemSelector;
