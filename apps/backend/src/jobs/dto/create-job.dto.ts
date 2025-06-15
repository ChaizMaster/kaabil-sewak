import { IsString, IsNumber, IsOptional } from 'class-validator';

export class CreateJobDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsString()
  location: string;

  @IsNumber()
  wage: number;

  @IsString()
  @IsOptional()
  status?: string = 'open';
} 