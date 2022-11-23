import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { BoardModule } from './modules/board/board.module';
import { UserModule } from './modules/user/user.module';
import { TaskModule } from './modules/task/task.module';

@Module({
  imports: [BoardModule, UserModule, TaskModule],
  controllers: [],
  providers: [AppService],
})
export class AppModule {}
