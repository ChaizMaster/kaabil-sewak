import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AudioInteraction } from './entities/audio-interaction.entity';
import { CreateAudioInteractionDto } from './dto/create-audio-interaction.dto';

@Injectable()
export class AnalyticsService {
  constructor(
    @InjectRepository(AudioInteraction)
    private audioInteractionRepository: Repository<AudioInteraction>,
  ) {}

  async trackAudioInteraction(createAudioInteractionDto: CreateAudioInteractionDto): Promise<AudioInteraction> {
    const audioInteraction = this.audioInteractionRepository.create(createAudioInteractionDto);
    return await this.audioInteractionRepository.save(audioInteraction);
  }

  async getAudioAnalytics(userId?: string): Promise<any> {
    const queryBuilder = this.audioInteractionRepository.createQueryBuilder('audio');
    
    if (userId) {
      queryBuilder.where('audio.userId = :userId', { userId });
    }

    const interactions = await queryBuilder.getMany();
    
    // Basic analytics
    const analytics = {
      totalInteractions: interactions.length,
      languageBreakdown: {},
      jobInteractions: {},
      dailyActivity: {},
    };

    interactions.forEach(interaction => {
      // Language breakdown
      if (!analytics.languageBreakdown[interaction.language]) {
        analytics.languageBreakdown[interaction.language] = 0;
      }
      analytics.languageBreakdown[interaction.language]++;

      // Job interactions
      if (!analytics.jobInteractions[interaction.jobId]) {
        analytics.jobInteractions[interaction.jobId] = {
          jobTitle: interaction.jobTitle,
          jobLocation: interaction.jobLocation,
          count: 0,
        };
      }
      analytics.jobInteractions[interaction.jobId].count++;

      // Daily activity
      const date = new Date(interaction.timestamp).toDateString();
      if (!analytics.dailyActivity[date]) {
        analytics.dailyActivity[date] = 0;
      }
      analytics.dailyActivity[date]++;
    });

    return analytics;
  }

  async getUserAudioHistory(userId: string): Promise<AudioInteraction[]> {
    return await this.audioInteractionRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
      take: 50, // Limit to recent 50 interactions
    });
  }
} 