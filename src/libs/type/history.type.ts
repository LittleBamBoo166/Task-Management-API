export type HistoryJsonObject = Required<{
  readonly id: string;
  readonly userId: string;
  readonly createOn: Date;
  readonly message: string;
  readonly action: 'CREATE' | 'DELETE' | 'UPDATE' | 'ADD' | 'REMOVE' | 'ASSIGN';
}> &
  Partial<{
    readonly boardId: string;
    readonly taskId: string;
    readonly content: object;
  }>;

export type CreateHistoryProperties = Required<{
  readonly userId: string;
  readonly createOn: Date;
  readonly message: string;
  readonly action: 'CREATE' | 'DELETE' | 'UPDATE' | 'ADD' | 'REMOVE' | 'ASSIGN';
}> &
  Partial<{
    readonly boardId: string;
    readonly taskId: string;
    readonly content: object;
  }>;
