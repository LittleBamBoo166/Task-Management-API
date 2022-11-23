import { HistoryJsonObject } from '../type/history.type';

export class HistoryResponse {
  readonly data: HistoryJsonObject;

  constructor(data: HistoryJsonObject) {
    this.data = data;
  }
}
