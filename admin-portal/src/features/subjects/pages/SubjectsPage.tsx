import { EmptyState } from '../../../shared/components/EmptyState';
import { PageContainer } from '../../../shared/components/PageContainer';
import { SectionHeader } from '../../../shared/components/SectionHeader';

export function SubjectsPage() {
  return (
    <PageContainer>
      <SectionHeader title="Subjects" />
      <EmptyState title="Subjects module scaffolded" description="Add subject management and API integration here." />
    </PageContainer>
  );
}

