import { useState } from 'react';
import { PageContainer } from '../../../shared/components/PageContainer';
import { SectionHeader } from '../../../shared/components/SectionHeader';
import { SettingsLayout } from '../components/SettingsLayout';
import { GeneralSettingsSection } from '../components/sections/GeneralSettings';
import { ExamSettingsSection } from '../components/sections/ExamSettings';
import { PaperGenerationRulesSection } from '../components/sections/PaperGenerationRules';
import { ApprovalWorkflowSection } from '../components/sections/ApprovalWorkflow';
import { SystemConfigurationSection } from '../components/sections/SystemConfiguration';
import { ThemeSettingsSection } from '../components/sections/ThemeSettings';
import { ProfileSettingsSection } from '../components/sections/ProfileSettings';
import { SecuritySettingsSection } from '../components/sections/SecuritySettings';
import { SettingsSection, SettingsSectionConfig } from '../types';
import {
  mockGeneralSettings,
  mockExamSettings,
  mockPaperGenerationRules,
  mockApprovalWorkflow,
  mockSystemConfiguration,
  mockThemeSettings,
  mockProfileSettings,
  mockSecuritySettings,
} from '../mockData';

const settingsSections: SettingsSectionConfig[] = [
  { id: 'general', label: 'General', icon: 'general', description: 'Basic site settings' },
  { id: 'exam', label: 'Exam Settings', icon: 'exam', description: 'Exam behavior and timing' },
  { id: 'paperGeneration', label: 'Paper Generation', icon: 'paper', description: 'Question paper rules' },
  { id: 'approvalWorkflow', label: 'Approval Workflow', icon: 'approval', description: 'Question approval process' },
  { id: 'system', label: 'System Configuration', icon: 'system', description: 'System-wide settings' },
  { id: 'theme', label: 'Theme', icon: 'theme', description: 'Appearance customization' },
  { id: 'profile', label: 'Profile', icon: 'profile', description: 'Personal information' },
  { id: 'security', label: 'Security', icon: 'security', description: 'Security policies' },
];

export function SettingsPage() {
  const [activeSection, setActiveSection] = useState<SettingsSection>('general');

  const [generalSettings, setGeneralSettings] = useState(mockGeneralSettings);
  const [examSettings, setExamSettings] = useState(mockExamSettings);
  const [paperGenerationRules, setPaperGenerationRules] = useState(mockPaperGenerationRules);
  const [approvalWorkflow, setApprovalWorkflow] = useState(mockApprovalWorkflow);
  const [systemConfiguration, setSystemConfiguration] = useState(mockSystemConfiguration);
  const [themeSettings, setThemeSettings] = useState(mockThemeSettings);
  const [profileSettings, setProfileSettings] = useState(mockProfileSettings);
  const [securitySettings, setSecuritySettings] = useState(mockSecuritySettings);

  const renderSection = () => {
    switch (activeSection) {
      case 'general':
        return <GeneralSettingsSection settings={generalSettings} onChange={setGeneralSettings} />;
      case 'exam':
        return <ExamSettingsSection settings={examSettings} onChange={setExamSettings} />;
      case 'paperGeneration':
        return <PaperGenerationRulesSection settings={paperGenerationRules} onChange={setPaperGenerationRules} />;
      case 'approvalWorkflow':
        return <ApprovalWorkflowSection settings={approvalWorkflow} onChange={setApprovalWorkflow} />;
      case 'system':
        return <SystemConfigurationSection settings={systemConfiguration} onChange={setSystemConfiguration} />;
      case 'theme':
        return <ThemeSettingsSection settings={themeSettings} onChange={setThemeSettings} />;
      case 'profile':
        return <ProfileSettingsSection settings={profileSettings} onChange={setProfileSettings} />;
      case 'security':
        return <SecuritySettingsSection settings={securitySettings} onChange={setSecuritySettings} />;
      default:
        return null;
    }
  };

  return (
    <PageContainer>
      <SectionHeader
        title="Settings"
        description="Manage your application settings and preferences."
      />

      <SettingsLayout
        sections={settingsSections}
        activeSection={activeSection}
        onSectionChange={setActiveSection}
      >
        {renderSection()}
      </SettingsLayout>
    </PageContainer>
  );
}

