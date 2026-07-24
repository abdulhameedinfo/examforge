import { EmptyState } from '../../../shared/components/EmptyState';
import { PageContainer } from '../../../shared/components/PageContainer';
import { SectionHeader } from '../../../shared/components/SectionHeader';

export function DashboardPage() {
  return (
    <PageContainer>
      <SectionHeader title="Dashboard" />
      <EmptyState title="No dashboard data yet" description="Connect the API and wire the first metrics endpoint." />
    </PageContainer>
  );
}

