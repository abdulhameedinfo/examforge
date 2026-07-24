import { EmptyState } from '../../../shared/components/EmptyState';
import { PageContainer } from '../../../shared/components/PageContainer';
import { SectionHeader } from '../../../shared/components/SectionHeader';

export function DifficultyLevelsPage() {
  return (
    <PageContainer>
      <SectionHeader title="Difficulty Levels" />
      <EmptyState title="Difficulty levels scaffolded" description="Add level definitions and API-backed management here." />
    </PageContainer>
  );
}

