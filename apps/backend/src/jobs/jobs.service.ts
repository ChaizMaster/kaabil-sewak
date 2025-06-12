import { Injectable } from '@nestjs/common';
import { CreateJobDto } from './dto/create-job.dto';

@Injectable()
export class JobsService {
  create(createJobDto: CreateJobDto) {
    console.log(createJobDto);
    return 'This action adds a new job';
  }

  findAll() {
    return `This action returns all jobs`;
  }

  findOne(id: string) {
    return `This action returns a #${id} job`;
  }

  update(id: string, updateJobDto: any) {
    console.log(updateJobDto);
    return `This action updates a #${id} job`;
  }

  remove(id: string) {
    return `This action removes a #${id} job`;
  }
}
