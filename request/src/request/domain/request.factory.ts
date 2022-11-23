import { v4 as uuidv4 } from 'uuid';
import {
  CreateRequestProperties,
  RequestEssentialProperties,
  RequestModel,
} from './model/request.model';

export class RequestFactory {
  create(properties: CreateRequestProperties): RequestModel {
    return new RequestModel({
      id: uuidv4(),
      ...properties,
    });
  }

  reconstitute(properties: RequestEssentialProperties): RequestModel {
    return new RequestModel(properties);
  }
}
