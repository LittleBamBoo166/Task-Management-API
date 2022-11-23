import { History } from 'src/infrastructure/entity/history.orm-entity';

export interface HistoryRepositoryPort {
  save(history: History | History[]): Promise<History | History[]>;
  getBoardHistory(boardId: string): Promise<History[]>;
  getTaskHistory(taskId: string): Promise<History[]>;
}
