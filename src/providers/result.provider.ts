import { Provider } from '@nestjs/common';
import { Result } from 'src/entity/result.entity';
import { Connection } from 'typeorm';

export const resultProvider: Provider[] = [
  {
    provide: 'RESULTS_REPOSITORY',
    useFactory: (connection: Connection) => connection.getRepository(Result),
    inject: ['DATABASE_CONNECTION'],
  },
];
