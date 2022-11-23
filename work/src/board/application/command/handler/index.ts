import { AddBoardMemberHandler } from './member/add-board-member.handler';
import { CreateBoardHandler } from './board/create-board.handler';
import { CreateLabelHandler } from './label/create-label.handler';
import { CreateListHandler } from './list/create-list.handler';
import { DeleteBoardByIdHandler } from './board/delete-board-by-id.handler';
import { DeleteLabelHandler } from './label/delete-label.handler';
import { RemoveBoardMemberHandler } from './member/remove-board-member.handler';
import { UpdateBoardHandler } from './board/update-board.handler';
import { UpdateLabelHandler } from './label/update-label.handler';
import { UpdateListHandler } from './list/update-list.handler';
import { DeleteListHandler } from './list/delete-list.handler';

export const commandHandler = [
  CreateBoardHandler,
  UpdateBoardHandler,
  DeleteBoardByIdHandler,
  CreateListHandler,
  UpdateListHandler,
  DeleteListHandler,
  AddBoardMemberHandler,
  RemoveBoardMemberHandler,
  CreateLabelHandler,
  UpdateLabelHandler,
  DeleteLabelHandler,
];
