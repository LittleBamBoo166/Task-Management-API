import { Result } from 'src/entity/result.entity';
import { createConnection } from 'typeorm';

export const databaseProvider = [
  {
    provide: 'DATABASE_CONNECTION',
    useFactory: async () =>
      await createConnection({
        type: 'postgres',
        host: 'heffalump.db.elephantsql.com',
        port: 5432,
        username: 'vsbudszl',
        password: 'MaaE7f0_J-mGRQyORFjFbyNE3E-gSdb7',
        database: 'vsbudszl',
        entities: [Result],
        synchronize: true,
        ssl: true,
      }),
  },
];
