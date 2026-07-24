import { EmptyState } from '../../../shared/components/EmptyState';
import { PageContainer } from '../../../shared/components/PageContainer';
import { SectionHeader } from '../../../shared/components/SectionHeader';

export function ChaptersPage() {
  return (
    <PageContainer>
      <SectionHeader title="Chapters" />
      <EmptyState title="Chapters module scaffolded" description="Bind chapters to subjects and classes here." />
    </PageContainer>
  );
}

