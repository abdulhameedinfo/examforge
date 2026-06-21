export interface Subject {
  localId: string;
  serverId: string | null;
  name: string;
  code: string;
  description: string | null;
  version: number;
  updatedAt: string;
  isSynced: number;
  isDeleted: number;
}

