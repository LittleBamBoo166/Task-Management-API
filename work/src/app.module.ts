import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config/dist';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BoardModule } from './board/board.module';
import { TaskModule } from './task/task.module';
import { HistoryModule } from './history/history.module';

@Module({
  imports: [
    BoardModule,
    TaskModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    HistoryModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
