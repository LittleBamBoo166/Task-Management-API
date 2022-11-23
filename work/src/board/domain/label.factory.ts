import { Checking } from 'src/libs/checking';
import { v4 as uuidv4 } from 'uuid';
import { LabelModel, LabelPropertiees } from './model/label.model';

export class LabelFactory {
  create(name: string, color?: string): LabelModel {
    if (!Checking.isHexColor(color)) {
      color = undefined;
    }
    return new LabelModel({
      id: uuidv4(),
      name: name,
      color: color,
    });
  }

  reconstitute(properties: LabelPropertiees): LabelModel {
    return new LabelModel(properties);
  }
}
