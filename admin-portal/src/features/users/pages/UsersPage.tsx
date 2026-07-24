import { EmptyState } from '../../../shared/components/EmptyState';
import { PageContainer } from '../../../shared/components/PageContainer';
import { SectionHeader } from '../../../shared/components/SectionHeader';

export function UsersPage() {
  return (
    <PageContainer>
      <SectionHeader title="Users & Permissions" />
      <EmptyState title="User administration scaffolded" description="Add roles, permissions, and access control here." />
    </PageContainer>
  );
}

