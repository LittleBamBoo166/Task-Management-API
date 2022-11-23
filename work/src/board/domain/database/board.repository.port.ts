import { Board } from 'src/board/infrastructure/entity/board.orm-entity';
import { BoardModel } from '../model/board.model';

export interface BoardRepositoryPort {
  exists(name: string, requesterId: string): Promise<boolean>;
  getOneById(id: string, requesterId: string): Promise<BoardModel | null>;
  getDetailById(id: string): Promise<BoardModel | null>;
  save(board: BoardModel): Promise<Board>;
  delete(id: string, requesterId: string): Promise<boolean>;
  getByMember(requesterId: string): Promise<BoardModel[] | null>;
  hasMember(id: string, requesterId: string): Promise<boolean>;
  isBoardOwner(id: string, requesterId: string): Promise<boolean>;
}
