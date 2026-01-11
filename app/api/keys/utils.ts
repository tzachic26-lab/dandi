type ApiKeyRecord = {
  id: string;
  key: string;
  name: string;
  description: string | null;
  created_at: Date | string;
  updated_at: Date | string;
};

export const normalizeKey = (record: ApiKeyRecord) => ({
  id: record.id,
  key: record.key,
  name: record.name,
  description: record.description,
  createdAt: new Date(record.created_at).toISOString(),
  updatedAt: new Date(record.updated_at).toISOString(),
});

