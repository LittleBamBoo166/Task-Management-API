import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ResultModule } from './result/result.module';
import { Result } from './entity/result.entity';

@Module({
  imports: [
    ResultModule,
    // RouterModule.register([
    //   {
    //     path: 'api/results',
    //     module: ResultModule,
    //   },
    // ]),
  ],
  controllers: [AppController],
  providers: [AppService, Result],
})
export class AppModule {}
