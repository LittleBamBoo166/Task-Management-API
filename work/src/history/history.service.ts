import { Injectable, Inject } from '@nestjs/common';
import { CreateHistoryObject, HistoryObject } from './history.type';
import { HistoryRepository } from './repository/history.repository';
import { v4 as uuidv4 } from 'uuid';
import { History } from './entity/history.orm-entity';

@Injectable()
export class HistoryService {
  constructor(
    @Inject(HistoryRepository)
    private readonly historyRepository: HistoryRepository,
  ) {}

  async getBoardHistory(data: string): Promise<History[]> {
    const boardHistory = await this.historyRepository.getBoardHistory(data);
    return boardHistory;
  }

  async getTaskHistory(data: string): Promise<History[]> {
    const taskHistories = await this.historyRepository.getTaskHistory(data);
    return taskHistories;
  }

  private generateObjectJson(data: CreateHistoryObject): HistoryObject {
    const historyObj: HistoryObject = {
      userId: data.userId,
      createOn: new Date(),
      message: data.message,
      action: data.action,
      boardId: data.boardId,
      taskId: data.taskId,
      changedContent: data.changedContent,
    };
    return historyObj;
  }

  public create(data: CreateHistoryObject): History {
    const id = uuidv4();
    const json: HistoryObject = this.generateObjectJson(data);
    const historyEntity: History = {
      id: id,
      ...json,
      changedContent: json,
    };
    return historyEntity;
  }

  public save(entity: History | History[]) {
    return this.historyRepository.save(entity);
  }
}
