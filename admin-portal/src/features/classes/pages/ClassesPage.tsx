import { EmptyState } from '../../../shared/components/EmptyState';
import { PageContainer } from '../../../shared/components/PageContainer';
import { SectionHeader } from '../../../shared/components/SectionHeader';

export function ClassesPage() {
  return (
    <PageContainer>
      <SectionHeader title="Classes" />
      <EmptyState title="Classes module scaffolded" description="Add class setup and relationships here." />
    </PageContainer>
  );
}

