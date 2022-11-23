import { Comment } from 'src/task/infrastructure/entity/comment.orm-entity';
import { IdTypes } from 'src/libs/id.type';
import { CommentModel } from '../model/comment.model';

export interface CommentRepositoryPort {
  getOneById(id: string, requesterId: string): Promise<CommentModel>;
  save(
    comment: CommentModel | CommentModel[],
    taskId: string,
  ): Promise<Comment | Comment[]>;
  delete(id: string): Promise<boolean>;
  deleteMany(by: IdTypes, data: string): Promise<boolean>;
}
