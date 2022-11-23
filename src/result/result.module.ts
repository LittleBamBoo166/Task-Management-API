import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database/database.module';
import { resultProvider } from 'src/providers/result.provider';
import { ResultController } from './result.controller';
import { ResultService } from './result.service';

@Module({
  imports: [DatabaseModule],
  controllers: [ResultController],
  providers: [...resultProvider, ResultService],
})
export class ResultModule {}
