import { Box, Container, Tab, Tabs, Typography } from '@mui/material';
import { ReactNode } from 'react';
import { SettingsSection, SettingsSectionConfig } from '../types';

interface SettingsLayoutProps {
  sections: SettingsSectionConfig[];
  activeSection: SettingsSection;
  onSectionChange: (section: SettingsSection) => void;
  children: ReactNode;
}

export function SettingsLayout({ sections, activeSection, onSectionChange, children }: SettingsLayoutProps) {
  return (
    <Box>
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs
          value={activeSection}
          onChange={(_, newValue) => onSectionChange(newValue)}
          variant="scrollable"
          scrollButtons="auto"
          sx={{ minHeight: 48 }}
        >
          {sections.map((section) => (
            <Tab
              key={section.id}
              label={section.label}
              value={section.id}
              sx={{ minHeight: 48, textTransform: 'none', fontWeight: 500 }}
            />
          ))}
        </Tabs>
      </Box>

      <Box>
        {children}
      </Box>
    </Box>
  );
}
