export type ActionType =
  | 'CREATE'
  | 'DELETE'
  | 'UPDATE'
  | 'ADD'
  | 'REMOVE'
  | 'ASSIGN';

export type HistoryObject = Required<{
  readonly userId: string;
  readonly createOn: Date;
  readonly message: string;
  readonly action: ActionType;
}> &
  Partial<{
    readonly boardId: string;
    readonly taskId: string;
    readonly changedContent: object;
  }>;

export type CreateHistoryObject = Required<{
  readonly userId: string;
  readonly message: string;
  readonly action: ActionType;
}> &
  Partial<{
    readonly boardId: string;
    readonly taskId: string;
    readonly changedContent: object;
  }>;
