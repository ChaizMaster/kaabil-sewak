import { IsEnum, IsNotEmpty, IsString, IsDateString } from 'class-validator';

export class CreateAudioInteractionDto {
  @IsNotEmpty()
  @IsString()
  userId: string;

  @IsNotEmpty()
  @IsString()
  jobId: string;

  @IsNotEmpty()
  @IsString()
  jobTitle: string;

  @IsNotEmpty()
  @IsString()
  jobLocation: string;

  @IsEnum(['audio_start', 'audio_end'])
  action: 'audio_start' | 'audio_end';

  @IsEnum(['ENGLISH', 'HINDI', 'BENGALI'])
  language: 'ENGLISH' | 'HINDI' | 'BENGALI';

  @IsDateString()
  timestamp: string;
} 