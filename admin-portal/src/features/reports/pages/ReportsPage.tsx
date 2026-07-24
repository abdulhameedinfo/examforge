import { EmptyState } from '../../../shared/components/EmptyState';
import { PageContainer } from '../../../shared/components/PageContainer';
import { SectionHeader } from '../../../shared/components/SectionHeader';

export function ReportsPage() {
  return (
    <PageContainer>
      <SectionHeader title="Reports" />
      <EmptyState title="Reports scaffolded" description="Add usage, performance, and exportable reports here." />
    </PageContainer>
  );
}

