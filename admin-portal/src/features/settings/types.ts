export type SettingsSection = 'general' | 'exam' | 'paperGeneration' | 'approvalWorkflow' | 'system' | 'theme' | 'profile' | 'security';

export interface SettingsSectionConfig {
  id: SettingsSection;
  label: string;
  icon: string;
  description: string;
}

export interface GeneralSettings {
  siteName: string;
  siteDescription: string;
  language: string;
  timezone: string;
  dateFormat: string;
  timeFormat: '12h' | '24h';
}

export interface ExamSettings {
  defaultExamDuration: number;
  maxExamDuration: number;
  minExamDuration: number;
  allowLateStart: boolean;
  lateStartGracePeriod: number;
  autoSubmitOnTimeout: boolean;
  showResultsImmediately: boolean;
}

export interface PaperGenerationRules {
  randomizeQuestions: boolean;
  randomizeOptions: boolean;
  balanceDifficulty: boolean;
  balanceChapters: boolean;
  minimumQuestionsPerChapter: number;
  maximumQuestionsPerChapter: number;
  allowQuestionReuse: boolean;
  reuseCooldownDays: number;
}

export interface ApprovalWorkflow {
  requireApproval: boolean;
  approvalLevels: number;
  autoApproveTrustedTeachers: boolean;
  notifyOnApproval: boolean;
  notifyOnRejection: boolean;
  rejectionReasonRequired: boolean;
}

export interface SystemConfiguration {
  maintenanceMode: boolean;
  maintenanceMessage: string;
  maxFileSize: number;
  allowedFileTypes: string[];
  sessionTimeout: number;
  enableAuditLog: boolean;
  backupFrequency: 'daily' | 'weekly' | 'monthly';
}

export interface ThemeSettings {
  mode: 'light' | 'dark' | 'system';
  primaryColor: string;
  secondaryColor: string;
  fontSize: 'small' | 'medium' | 'large';
  denseMode: boolean;
}

export interface ProfileSettings {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  avatar: string;
  bio: string;
  notifications: {
    email: boolean;
    push: boolean;
    sms: boolean;
  };
}

export interface SecuritySettings {
  twoFactorEnabled: boolean;
  passwordMinLength: number;
  passwordRequireUppercase: boolean;
  passwordRequireLowercase: boolean;
  passwordRequireNumbers: boolean;
  passwordRequireSpecialChars: boolean;
  sessionTimeout: number;
  loginAttemptsLimit: number;
  lockoutDuration: number;
}
