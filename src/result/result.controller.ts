import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { Result } from 'src/entity/result.entity';
import { DeleteResult } from 'typeorm';
import { ResultService } from './result.service';

@Controller('results')
export class ResultController {
  constructor(private resultService: ResultService) {}

  @Get()
  getAllResults(): Promise<Result[]> {
    return this.resultService.getResults();
  }

  @Get('amount=:amount')
  getAmountResults(@Param('amount') amount: string): Promise<Result[]> {
    console.log(amount);
    return this.resultService.getAmountOfResults(Number(amount));
  }

  @Post()
  create(@Body() result: Result) {
    console.log(result);
    return this.resultService.addResult(result);
  }

  @Get('id=:id')
  getOneResult(@Param('id') id: string): Promise<Result> {
    return this.resultService.findOne(Number(id));
  }

  //   take me to another path
  @Patch(':id')
  updateResult(
    @Param('id') id: string,
    @Body() result: Result,
  ): Promise<Result> {
    return this.resultService.update(Number(id), result);
  }

  @Delete(':id')
  deleteResult(@Param('id') id: string): Promise<DeleteResult> {
    return this.resultService.delete(Number(id));
  }
}
