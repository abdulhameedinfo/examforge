import { EmptyState } from '../../../shared/components/EmptyState';
import { PageContainer } from '../../../shared/components/PageContainer';
import { SectionHeader } from '../../../shared/components/SectionHeader';

export function SyncPage() {
  return (
    <PageContainer>
      <SectionHeader title="Synchronization" />
      <EmptyState title="Sync status scaffolded" description="Add queue, conflict, and device sync views here." />
    </PageContainer>
  );
}

