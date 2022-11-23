import { v4 as uuidv4 } from 'uuid';
import { CommentModel, CommentProperties } from './model/comment.model';

export class CommentFactory {
  create(content: string, memberId: string): CommentModel {
    return new CommentModel({
      id: uuidv4(),
      content: content,
      memberId: memberId,
    });
  }

  reconstitute(properties: CommentProperties): CommentModel {
    return new CommentModel(properties);
  }
}
