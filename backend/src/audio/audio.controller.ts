import { Controller, Post, UseInterceptors, UploadedFile, UseGuards, Req, ParseFilePipe, MaxFileSizeValidator, FileTypeValidator } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiConsumes, ApiBody, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { AudioService } from './audio.service';

@ApiTags('Audio')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt')) // Защищаем роут JWT токеном
@Controller('audio')
export class AudioController {
  constructor(private readonly audioService: AudioService) {}

  @Post('upload')
  @ApiOperation({ summary: 'Upload MP3 or WAV file for transcription' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @Req() req: any,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 20 * 1024 * 1024 }), // Максимум 20MB
          new FileTypeValidator({ fileType: /audio\/(mpeg|wav)/ }), // Только MP3 и WAV
        ],
      }),
    )
    file: Express.Multer.File,
  ) {
    // req.user добавляется гвардом AuthGuard('jwt')
    return this.audioService.uploadAudioFile(req.user.sub, file);
  }
}