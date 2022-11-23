import { Module } from '@nestjs/common';
import { HistoryService } from './history.service';
import { HistoryRepository } from './repository/history.repository';

@Module({
  providers: [HistoryService, HistoryRepository],
  exports: [HistoryService, HistoryRepository],
})
export class HistoryModule {}
