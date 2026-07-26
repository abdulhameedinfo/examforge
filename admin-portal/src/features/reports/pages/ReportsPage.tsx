import { Grid, Stack } from '@mui/material';
import { PageContainer } from '../../../shared/components/PageContainer';
import { SectionHeader } from '../../../shared/components/SectionHeader';
import { QuestionsPerTeacherChart } from '../components/QuestionsPerTeacherChart';
import { QuestionsPerSubjectChart } from '../components/QuestionsPerSubjectChart';
import { QuestionTypeDistributionChart } from '../components/QuestionTypeDistributionChart';
import { DifficultyDistributionChart } from '../components/DifficultyDistributionChart';
import { RecentQuestionsTable } from '../components/RecentQuestionsTable';
import { SyncStatusCard } from '../components/SyncStatusCard';
import { mockReportsData } from '../mockData';

export function ReportsPage() {
  return (
    <PageContainer>
      <SectionHeader
        title="Reports Dashboard"
        description="Overview of questions, teachers, subjects, and sync status."
      />

      <Stack spacing={3}>
        {/* Sync Status Card */}
        <SyncStatusCard data={mockReportsData.syncStatus} />

        {/* Charts Grid */}
        <Grid container spacing={3}>
          <Grid item xs={12} md={6} lg={4}>
            <QuestionsPerTeacherChart data={mockReportsData.questionsPerTeacher} />
          </Grid>

          <Grid item xs={12} md={6} lg={4}>
            <QuestionsPerSubjectChart data={mockReportsData.questionsPerSubject} />
          </Grid>

          <Grid item xs={12} md={6} lg={4}>
            <QuestionTypeDistributionChart data={mockReportsData.questionTypeDistribution} />
          </Grid>

          <Grid item xs={12} md={6}>
            <DifficultyDistributionChart data={mockReportsData.difficultyDistribution} />
          </Grid>
        </Grid>

        {/* Recent Questions Table */}
        <RecentQuestionsTable data={mockReportsData.recentQuestions} />
      </Stack>
    </PageContainer>
  );
}

