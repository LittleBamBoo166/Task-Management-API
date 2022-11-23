import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { Connection, createConnection, DataSourceOptions } from 'typeorm';

@Injectable()
export class AppService implements OnModuleInit, OnModuleDestroy {
  private databaseConnection?: Connection | void;

  async onModuleInit() {
    const ormConfig: DataSourceOptions = {
      type: 'postgres',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT),
      username: process.env.DB_USER_NAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [__dirname + '/../**/*.orm-entity.js'],
      // entities: [],
      synchronize: true,
      ssl: true,
    };
    this.databaseConnection = await createConnection(ormConfig).catch(
      (error: Error) => {
        console.log(error);
        process.exit(1);
      },
    );
  }

  async onModuleDestroy() {
    if (this.databaseConnection) await this.databaseConnection.close();
  }

  getHello(): string {
    return 'Hello World!';
  }
}
