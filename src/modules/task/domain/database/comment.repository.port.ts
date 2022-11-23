import { Comment } from 'src/infrastructure/entity/comment.orm-entity';
import { IdTypes } from 'src/libs/type/id.type';
import { CommentModel } from '../model/comment.model';

export interface CommentRepositoryPort {
  getOneById(id: string, requesterId: string): Promise<CommentModel>;
  save(
    comment: CommentModel | CommentModel[],
    taskId: string,
  ): Promise<Comment | Comment[]>;
  delete(id: string): Promise<boolean>;
  deleteMany(by: IdTypes, data: string): Promise<boolean>;
  // deleteManyByBoardId(boardId: string): Promise<boolean>;
  // deleteManyByListId(listId: string): Promise<boolean>;
}
