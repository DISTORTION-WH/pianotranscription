import { Injectable, Logger, InternalServerErrorException, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { ClientProxy } from '@nestjs/microservices';
import { AudioTrack, TranscriptionStatus } from './entities/audio-track.entity';
import { v4 as uuidv4 } from 'uuid';

type UploadedAudioFile = {
  originalname: string;
  mimetype: string;
  buffer: Buffer;
};

@Injectable()
export class AudioService {
  private readonly s3Client: S3Client;
  private readonly logger = new Logger(AudioService.name);
  private readonly bucketName: string;

  constructor(
    @InjectRepository(AudioTrack)
    private audioTrackRepository: Repository<AudioTrack>,
    private configService: ConfigService,
    @Inject('ML_WORKER_SERVICE') private rabbitClient: ClientProxy, // <-- Инжектим клиент RabbitMQ
  ) {
    this.bucketName = this.configService.get<string>('AWS_S3_BUCKET_NAME', 'piano-audio-bucket');
    this.s3Client = new S3Client({
      region: this.configService.get<string>('AWS_REGION', 'us-east-1'),
      credentials: {
        accessKeyId: this.configService.get<string>('AWS_ACCESS_KEY_ID', 'mock-key'),
        secretAccessKey: this.configService.get<string>('AWS_SECRET_ACCESS_KEY', 'mock-secret'),
      },
    });
  }

  async uploadAudioFile(userId: string, file: UploadedAudioFile): Promise<AudioTrack> {
    const fileExtension = file.originalname.split('.').pop();
    const uniqueFilename = `${userId}/${uuidv4()}.${fileExtension}`;

    try {
      await this.s3Client.send(
        new PutObjectCommand({
          Bucket: this.bucketName,
          Key: uniqueFilename,
          Body: file.buffer,
          ContentType: file.mimetype,
        }),
      );

      const s3AudioUrl = `https://${this.bucketName}.s3.amazonaws.com/${uniqueFilename}`;

      const newTrack = this.audioTrackRepository.create({
        originalFilename: file.originalname,
        s3AudioUrl,
        userId,
        status: TranscriptionStatus.PENDING,
      });

      const savedTrack = await this.audioTrackRepository.save(newTrack);

      // Отправляем асинхронное сообщение в RabbitMQ для начала ML-обработки
      this.rabbitClient.emit('process_audio_transcription', {
        trackId: savedTrack.id,
        s3Url: savedTrack.s3AudioUrl,
        userId: userId,
      });
      
      this.logger.log(`Task dispatched to RabbitMQ for track: ${savedTrack.id}`);

      return savedTrack;
    } catch (error) {
      this.logger.error(`Failed to upload file to S3: ${error.message}`);
      throw new InternalServerErrorException('Error uploading audio file');
    }
  }
}
