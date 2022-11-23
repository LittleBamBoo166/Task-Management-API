import { Attachment } from 'src/task/infrastructure/entity/attachment.orm-entity';
import { IdTypes } from 'src/libs/id.type';
import { AttachmentModel } from '../model/attachment.model';

export interface AttachmentRepositoryPort {
  exists(name: string, taskId: string): Promise<boolean>;
  getOneById(id: string): Promise<AttachmentModel>;
  save(
    attachment: AttachmentModel | AttachmentModel[],
    taskId: string,
  ): Promise<Attachment | Attachment[]>;
  delete(id: string): Promise<boolean>;
  deleteMany(by: IdTypes, data: string): Promise<boolean>;
}
