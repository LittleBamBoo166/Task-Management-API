import { ListModel, ListProperties } from './model/list.model';
import { v4 as uuidv4 } from 'uuid';
import { Checking } from 'src/libs/util/checking';

export class ListFactory {
  create(name: string, color?: string, order?: number): ListModel {
    if (!Checking.isHexColor(color)) {
      color = undefined;
    }
    return new ListModel({
      id: uuidv4(),
      name: name,
      order: order,
      color: color,
    });
  }

  reconstitute(properties: ListProperties): ListModel {
    return new ListModel(properties);
  }
}
