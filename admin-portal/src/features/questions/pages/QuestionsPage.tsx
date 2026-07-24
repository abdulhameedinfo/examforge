import { EmptyState } from '../../../shared/components/EmptyState';
import { PageContainer } from '../../../shared/components/PageContainer';
import { SectionHeader } from '../../../shared/components/SectionHeader';

export function QuestionsPage() {
  return (
    <PageContainer>
      <SectionHeader title="Question Bank" />
      <EmptyState title="Question bank scaffolded" description="Add search, filters, and table views here." />
    </PageContainer>
  );
}

