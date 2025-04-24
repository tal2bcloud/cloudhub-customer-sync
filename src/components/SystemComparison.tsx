
import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, Filter } from 'lucide-react';
import { HubSpotCompany, CloudHealthCustomer, ComparisonTableRow } from '@/utils/types';

interface SystemComparisonProps {
  hubspotData: HubSpotCompany[];
  cloudHealthData: CloudHealthCustomer[];
}

const SystemComparison: React.FC<SystemComparisonProps> = ({ hubspotData, cloudHealthData }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterBy, setFilterBy] = useState<'all' | 'matched' | 'unmatched'>('all');

  const compareStrings = (str1: string, str2: string): number => {
    const s1 = str1.toLowerCase();
    const s2 = str2.toLowerCase();
    return s1.includes(s2) || s2.includes(s1) ? 1 : 0;
  };

  const comparisonData = useMemo(() => {
    const rows: ComparisonTableRow[] = [];
    const usedHubspotIds = new Set<string>();
    const usedCloudHealthIds = new Set<string>();

    // Find matches
    hubspotData.forEach(hs => {
      cloudHealthData.forEach(ch => {
        const similarity = compareStrings(hs.properties.name, ch.name);
        if (similarity > 0) {
          rows.push({
            hubspotId: hs.id,
            hubspotName: hs.properties.name,
            cloudHealthId: ch.id,
            cloudHealthName: ch.name,
            matchStatus: 'matched',
            similarity
          });
          usedHubspotIds.add(hs.id);
          usedCloudHealthIds.add(ch.id);
        }
      });
    });

    // Add unmatched HubSpot entries
    hubspotData.forEach(hs => {
      if (!usedHubspotIds.has(hs.id)) {
        rows.push({
          hubspotId: hs.id,
          hubspotName: hs.properties.name,
          matchStatus: 'hubspot_only'
        });
      }
    });

    // Add unmatched CloudHealth entries
    cloudHealthData.forEach(ch => {
      if (!usedCloudHealthIds.has(ch.id)) {
        rows.push({
          cloudHealthId: ch.id,
          cloudHealthName: ch.name,
          matchStatus: 'cloudhealth_only'
        });
      }
    });

    return rows;
  }, [hubspotData, cloudHealthData]);

  const filteredData = useMemo(() => {
    return comparisonData.filter(row => {
      const searchMatch = 
        (row.hubspotName?.toLowerCase().includes(searchTerm.toLowerCase()) || 
        row.cloudHealthName?.toLowerCase().includes(searchTerm.toLowerCase()));

      if (!searchMatch) return false;

      switch (filterBy) {
        case 'matched':
          return row.matchStatus === 'matched';
        case 'unmatched':
          return row.matchStatus !== 'matched';
        default:
          return true;
      }
    });
  }, [comparisonData, searchTerm, filterBy]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'matched':
        return <Badge className="bg-green-100 text-green-800">Matched</Badge>;
      case 'hubspot_only':
        return <Badge className="bg-orange-100 text-orange-800">HubSpot Only</Badge>;
      case 'cloudhealth_only':
        return <Badge className="bg-blue-100 text-blue-800">CloudHealth Only</Badge>;
      default:
        return null;
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center">
            <Filter className="h-5 w-5 mr-2" />
            System Data Comparison
          </div>
          <div className="flex items-center space-x-4">
            <select
              className="border rounded px-2 py-1"
              value={filterBy}
              onChange={(e) => setFilterBy(e.target.value as 'all' | 'matched' | 'unmatched')}
            >
              <option value="all">All Records</option>
              <option value="matched">Matched Only</option>
              <option value="unmatched">Unmatched Only</option>
            </select>
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search companies..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 w-64"
              />
            </div>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Status</TableHead>
                <TableHead>HubSpot ID</TableHead>
                <TableHead>HubSpot Name</TableHead>
                <TableHead>CloudHealth ID</TableHead>
                <TableHead>CloudHealth Name</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.length > 0 ? (
                filteredData.map((row, index) => (
                  <TableRow key={index}>
                    <TableCell>{getStatusBadge(row.matchStatus)}</TableCell>
                    <TableCell>{row.hubspotId || '-'}</TableCell>
                    <TableCell>{row.hubspotName || '-'}</TableCell>
                    <TableCell>{row.cloudHealthId || '-'}</TableCell>
                    <TableCell>{row.cloudHealthName || '-'}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-10 text-muted-foreground">
                    No matching records found
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

export default SystemComparison;

