import { EmptyState } from '../../../shared/components/EmptyState';
import { PageContainer } from '../../../shared/components/PageContainer';
import { SectionHeader } from '../../../shared/components/SectionHeader';

export function TeachersPage() {
  return (
    <PageContainer>
      <SectionHeader title="Teachers" />
      <EmptyState title="Teachers module scaffolded" description="Add list, detail, create, and edit flows here." />
    </PageContainer>
  );
}

