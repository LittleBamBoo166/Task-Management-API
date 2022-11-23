import { HistoryRepositoryPort } from 'src/libs/port/history.repository.port';
import { getRepository } from 'typeorm';
import { History } from '../entity/history.orm-entity';

export class HistoryRepositoryAdapter implements HistoryRepositoryPort {
  async save(history: History | History[]): Promise<History | History[]> {
    const historyRepository = getRepository(History);
    const historyArr = Array.isArray(history) ? history : [history];
    return historyRepository.save(historyArr);
  }

  async getBoardHistory(boardId: string): Promise<History[]> {
    const historyRepository = getRepository(History);
    const histories = historyRepository
      .createQueryBuilder('history')
      .where('history.boardId = :bid', { bid: boardId })
      .getMany();
    return histories;
  }

  async getTaskHistory(taskId: string): Promise<History[]> {
    const historyRepository = getRepository(History);
    const histories = historyRepository
      .createQueryBuilder('history')
      .where('history.taskId = :tid', { tid: taskId })
      .getMany();
    return histories;
  }
}
