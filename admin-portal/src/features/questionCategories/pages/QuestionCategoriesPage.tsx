import { EmptyState } from '../../../shared/components/EmptyState';
import { PageContainer } from '../../../shared/components/PageContainer';
import { SectionHeader } from '../../../shared/components/SectionHeader';

export function QuestionCategoriesPage() {
  return (
    <PageContainer>
      <SectionHeader title="Question Categories" />
      <EmptyState title="Categories module scaffolded" description="Add taxonomy and tagging flows here." />
    </PageContainer>
  );
}

