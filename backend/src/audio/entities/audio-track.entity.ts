import { 
  Entity, 
  PrimaryGeneratedColumn, 
  Column, 
  CreateDateColumn, 
  ManyToOne, 
  JoinColumn 
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

export enum TranscriptionStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
}

@Entity('audio_tracks')
export class AudioTrack {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  originalFilename: string;

  @Column()
  s3AudioUrl: string;

  @Column({ nullable: true })
  s3MidiUrl: string;

  @Column({ nullable: true })
  s3MusicXmlUrl: string;

  @Column({
    type: 'enum',
    enum: TranscriptionStatus,
    default: TranscriptionStatus.PENDING,
  })
  status: TranscriptionStatus;

  // Связь: каждый трек принадлежит конкретному пользователю
  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  userId: string;

  @CreateDateColumn()
  createdAt: Date;
}