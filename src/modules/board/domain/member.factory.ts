import { v4 as uuidv4 } from 'uuid';
import { MemberModel, MemberProperties } from './model/member.model';

export class MemberFactory {
  create(userId: string): MemberModel {
    return new MemberModel({
      id: uuidv4(),
      userId: userId,
    });
  }

  reconstitute(properties: MemberProperties): MemberModel {
    return new MemberModel(properties);
  }
}
