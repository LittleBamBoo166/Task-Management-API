import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { Result } from 'src/entity/result.entity';
import { DeleteResult, InsertResult, Repository } from 'typeorm';

@Injectable()
export class ResultService {
  constructor(
    @Inject('RESULTS_REPOSITORY') private resultsRepository: Repository<Result>,
  ) {}

  async getResults(): Promise<Result[]> {
    return this.resultsRepository.find();
  }

  async getAmountOfResults(amount: number): Promise<Result[]> {
    const q = this.resultsRepository.createQueryBuilder().take(amount);
    return q.printSql().getRawMany();
  }

  //   what is Promise<InsertResult>
  async addResult(result: Result): Promise<InsertResult> {
    return this.resultsRepository.insert(result);
  }

  async findOne(id: number): Promise<Result> {
    // findOne(number) => throw error, but the code below findOne(number) does not throw an error
    return this.resultsRepository.findOne({
      where: { id: id },
    });
  }

  async update(id: number, result: Result): Promise<Result> {
    const resultToUpdate = await this.findOne(id);
    if (resultToUpdate === undefined) {
      throw new NotFoundException();
    }
    await this.resultsRepository.update(id, result);
    return this.findOne(id);
  }

  async delete(id: number): Promise<DeleteResult> {
    const resultToUpdate = await this.findOne(id);
    if (resultToUpdate === undefined) {
      throw new NotFoundException();
    }
    return this.resultsRepository.delete(id);
  }
}
