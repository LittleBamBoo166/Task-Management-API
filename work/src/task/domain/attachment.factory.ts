import { Checking } from 'src/libs/checking';
import { v4 as uuidv4 } from 'uuid';
import {
  AttachmentModel,
  AttachmentProperties,
} from './model/attachment.model';

export class AttachmentFactory {
  create(fileName: string, storageUri): AttachmentModel {
    if (!Checking.isEmpty(fileName) && !Checking.isEmpty(storageUri)) {
      return new AttachmentModel({
        id: uuidv4(),
        fileName: fileName,
        storageUri: storageUri,
      });
    }
  }

  reconstitute(properties: AttachmentProperties): AttachmentModel {
    return new AttachmentModel(properties);
  }
}
