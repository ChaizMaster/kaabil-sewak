import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LocationController } from './location.controller';
import { LocationService } from './location.service';
import { BackgroundCheckService } from './background-check.service';
import { UserLocation } from './entities/user-location.entity';
import { BackgroundCheck } from './entities/background-check.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserLocation, BackgroundCheck])
  ],
  controllers: [LocationController],
  providers: [LocationService, BackgroundCheckService],
  exports: [LocationService, BackgroundCheckService],
})
export class LocationModule {} 