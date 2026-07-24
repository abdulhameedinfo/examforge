import { EmptyState } from '../../../shared/components/EmptyState';
import { PageContainer } from '../../../shared/components/PageContainer';
import { SectionHeader } from '../../../shared/components/SectionHeader';

export function PapersPage() {
  return (
    <PageContainer>
      <SectionHeader title="Exam Papers" />
      <EmptyState title="Paper generation scaffolded" description="Add generation rules and PDF export here." />
    </PageContainer>
  );
}

