import { Inject } from '@nestjs/common';
import { IdTypes } from 'src/libs/type/id.type';
import { Checking } from 'src/libs/util/checking';
import { AttachmentFactory } from 'src/modules/task/domain/attachment.factory';
import { AttachmentRepositoryPort } from 'src/modules/task/domain/database/attachment.repository.port';
import { AttachmentModel } from 'src/modules/task/domain/model/attachment.model';
import { DeleteResult, getRepository } from 'typeorm';
import { Attachment } from '../entity/attachment.orm-entity';
import { Task } from '../entity/task.orm-entity';

export class AttachmentRepositoryAdapter implements AttachmentRepositoryPort {
  constructor(
    @Inject(AttachmentFactory)
    private readonly attachmentFactory: AttachmentFactory,
  ) {}

  private async deleteManyByListId(listId: string): Promise<boolean> {
    const attachmentRepository = getRepository(Attachment);
    const attachment = await attachmentRepository
      .createQueryBuilder('comment')
      .leftJoinAndSelect('comment.task', 'task')
      .leftJoinAndSelect('task.list', 'list')
      .where('list.id = :id', { id: listId })
      .getMany();
    const deleteResult = await attachmentRepository.remove(attachment);
    if (!deleteResult) {
      return false;
    }
    return true;
  }

  private async deleteManyByBoardId(boardId: string): Promise<boolean> {
    const attachmentRepository = getRepository(Attachment);
    const attachment = await attachmentRepository
      .createQueryBuilder('attachment')
      .leftJoinAndSelect('attachment.task', 'task')
      .leftJoinAndSelect('task.list', 'list')
      .leftJoinAndSelect('list.board', 'board')
      .where('board.id = :id', { id: boardId })
      .getMany();
    const deleteResult = await attachmentRepository.remove(attachment);
    if (!deleteResult) {
      return false;
    }
    return true;
  }

  private async deleteManyByTaskId(taskId: string): Promise<boolean> {
    const attachmentRepository = getRepository(Attachment);
    const attachment = await attachmentRepository
      .createQueryBuilder('comment')
      .leftJoinAndSelect('comment.task', 'task')
      .where('task.id = :id', { id: taskId })
      .getMany();
    const deleteResult = await attachmentRepository.remove(attachment);
    if (!deleteResult) {
      return false;
    }
    return true;
  }

  async exists(name: string, taskId: string): Promise<boolean> {
    const attachmentRepository = getRepository(Attachment);
    const attachment = await attachmentRepository
      .createQueryBuilder('attachment')
      .leftJoinAndSelect('attachment.task', 'task')
      .where('task.id = :tid', { tid: taskId })
      .andWhere('attachment.fileName = :name', { name: name })
      .getMany();
    if (!attachment || attachment.length === 0) {
      return false;
    }
    return true;
  }

  async getOneById(id: string): Promise<AttachmentModel> {
    const attachmentRepository = getRepository(Attachment);
    const attachment = await attachmentRepository.findOneBy({ id: id });
    if (Checking.isEmpty(attachment)) {
      return null;
    }
    return this.ormToModel(attachment);
  }

  async save(
    attachment: AttachmentModel | AttachmentModel[],
    taskId: string,
  ): Promise<Attachment | Attachment[]> {
    const attachmentRepository = getRepository(Attachment);
    const models = Array.isArray(attachment) ? attachment : [attachment];
    const ormEntities = models.map((model) => this.modelToOrm(model, taskId));
    const result = await attachmentRepository.save(ormEntities);
    return result;
  }

  async delete(id: string): Promise<boolean> {
    const attachmentRepository = getRepository(Attachment);
    const deleteResult: DeleteResult = await attachmentRepository
      .createQueryBuilder()
      .delete()
      .from(Attachment)
      .where('id = :id', { id: id })
      .execute();
    if (!deleteResult || deleteResult.affected === 0) {
      return false;
    }
    return true;
  }

  async deleteMany(by: IdTypes, data: string): Promise<boolean> {
    if (by === 'boardId') return this.deleteManyByBoardId(data);
    if (by === 'listId') return this.deleteManyByListId(data);
    if (by === 'taskId') return this.deleteManyByTaskId(data);
    return false;
  }

  private modelToOrm(model: AttachmentModel, taskId: string): Attachment {
    const properties = model.getProperties();
    const taskOrm = new Task(taskId);
    return {
      ...properties,
      task: taskOrm,
    };
  }

  private ormToModel(ormEntity: Attachment): AttachmentModel | null {
    if (!ormEntity) {
      return null;
    }
    return this.attachmentFactory.reconstitute({ ...ormEntity });
  }
}
