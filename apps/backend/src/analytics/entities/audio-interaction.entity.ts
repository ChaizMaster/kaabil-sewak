import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('audio_interactions')
export class AudioInteraction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @Column()
  jobId: string;

  @Column()
  jobTitle: string;

  @Column()
  jobLocation: string;

  @Column({
    type: 'varchar',
    enum: ['audio_start', 'audio_end'],
  })
  action: 'audio_start' | 'audio_end';

  @Column({
    type: 'varchar',
    enum: ['ENGLISH', 'HINDI', 'BENGALI'],
  })
  language: 'ENGLISH' | 'HINDI' | 'BENGALI';

  @Column()
  timestamp: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
} 