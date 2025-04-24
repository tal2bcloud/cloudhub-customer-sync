
import React from 'react';
import { Database, Users, ArrowRight } from 'lucide-react';
import { Sidebar as ShadcnSidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, onTabChange }) => {
  const menuItems = [
    {
      title: 'Customers',
      id: 'customers',
      icon: <Users className="h-5 w-5" />,
    },
    {
      title: 'System Mapping',
      id: 'mapping',
      icon: <ArrowRight className="h-5 w-5" />,
    },
    {
      title: 'Data Management',
      id: 'data',
      icon: <Database className="h-5 w-5" />,
    },
  ];

  return (
    <ShadcnSidebar>
      <SidebarContent>
        <div className="flex items-center p-4">
          <div className="text-sidebar-foreground font-bold text-xl">CloudHub</div>
        </div>
        
        <SidebarGroup>
          <SidebarGroupLabel>Integration</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton asChild>
                    <Button
                      variant={activeTab === item.id ? "secondary" : "ghost"}
                      className="w-full justify-start"
                      onClick={() => onTabChange(item.id)}
                    >
                      {item.icon}
                      <span className="ml-2">{item.title}</span>
                    </Button>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </ShadcnSidebar>
  );
};

export default Sidebar;
