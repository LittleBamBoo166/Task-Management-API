import { History } from 'src/infrastructure/entity/history.orm-entity';
import { v4 as uuidv4 } from 'uuid';
import {
  CreateHistoryProperties,
  HistoryJsonObject,
} from '../type/history.type';

export class HistoryFactory {
  create(data: CreateHistoryProperties): History {
    const id = uuidv4();
    const contentJson: HistoryJsonObject = {
      id: id,
      ...data,
    };
    return {
      id: id,
      ...data,
      contentJson: contentJson,
    };
  }
}
