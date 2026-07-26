import { GeneralSettings, ExamSettings, PaperGenerationRules, ApprovalWorkflow, SystemConfiguration, ThemeSettings, ProfileSettings, SecuritySettings } from './types';

export const mockGeneralSettings: GeneralSettings = {
  siteName: 'ExamForge',
  siteDescription: 'Comprehensive examination management platform',
  language: 'en',
  timezone: 'UTC',
  dateFormat: 'MM/DD/YYYY',
  timeFormat: '12h',
};

export const mockExamSettings: ExamSettings = {
  defaultExamDuration: 60,
  maxExamDuration: 180,
  minExamDuration: 15,
  allowLateStart: true,
  lateStartGracePeriod: 10,
  autoSubmitOnTimeout: true,
  showResultsImmediately: false,
};

export const mockPaperGenerationRules: PaperGenerationRules = {
  randomizeQuestions: true,
  randomizeOptions: true,
  balanceDifficulty: true,
  balanceChapters: true,
  minimumQuestionsPerChapter: 2,
  maximumQuestionsPerChapter: 10,
  allowQuestionReuse: false,
  reuseCooldownDays: 30,
};

export const mockApprovalWorkflow: ApprovalWorkflow = {
  requireApproval: true,
  approvalLevels: 2,
  autoApproveTrustedTeachers: true,
  notifyOnApproval: true,
  notifyOnRejection: true,
  rejectionReasonRequired: true,
};

export const mockSystemConfiguration: SystemConfiguration = {
  maintenanceMode: false,
  maintenanceMessage: 'System is under maintenance. Please try again later.',
  maxFileSize: 10,
  allowedFileTypes: ['.pdf', '.doc', '.docx', '.jpg', '.png'],
  sessionTimeout: 30,
  enableAuditLog: true,
  backupFrequency: 'daily',
};

export const mockThemeSettings: ThemeSettings = {
  mode: 'light',
  primaryColor: '#1976d2',
  secondaryColor: '#ff4081',
  fontSize: 'medium',
  denseMode: false,
};

export const mockProfileSettings: ProfileSettings = {
  firstName: 'John',
  lastName: 'Doe',
  email: 'john.doe@example.com',
  phone: '+1234567890',
  avatar: '',
  bio: 'Examination coordinator with 5 years of experience.',
  notifications: {
    email: true,
    push: true,
    sms: false,
  },
};

export const mockSecuritySettings: SecuritySettings = {
  twoFactorEnabled: false,
  passwordMinLength: 8,
  passwordRequireUppercase: true,
  passwordRequireLowercase: true,
  passwordRequireNumbers: true,
  passwordRequireSpecialChars: true,
  sessionTimeout: 30,
  loginAttemptsLimit: 5,
  lockoutDuration: 15,
};
