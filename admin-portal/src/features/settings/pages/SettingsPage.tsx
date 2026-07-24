import { EmptyState } from '../../../shared/components/EmptyState';
import { PageContainer } from '../../../shared/components/PageContainer';
import { SectionHeader } from '../../../shared/components/SectionHeader';

export function SettingsPage() {
  return (
    <PageContainer>
      <SectionHeader title="Settings" />
      <EmptyState title="Settings scaffolded" description="Add appearance and platform preferences here." />
    </PageContainer>
  );
}

