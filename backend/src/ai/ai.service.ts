import { Injectable, Logger, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';

@Injectable()
export class AiService {
  private readonly openai: OpenAI;
  private readonly logger = new Logger(AiService.name);

  constructor(private configService: ConfigService) {
    this.openai = new OpenAI({
      apiKey: this.configService.get<string>('OPENAI_API_KEY'),
    });
  }

  async analyzeMusicalStructure(transcribedNotes: any[]): Promise<any> {
    try {
      const prompt = `
        As an expert music theorist, analyze the following transcribed piano notes.
        Identify the underlying chord progressions and determine the song structure tags (e.g., Intro, Verse, Chorus, Bridge).
        Return the result strictly as a JSON object with two keys: "chords" (array of strings) and "tags" (array of strings).
        
        Notes data: ${JSON.stringify(transcribedNotes.slice(0, 100))} // Sending a sample to save tokens
      `;

      const response = await this.openai.chat.completions.create({
        model: 'gpt-4-turbo',
        messages: [{ role: 'user', content: prompt }],
        response_format: { type: 'json_object' },
        temperature: 0.2,
      });

      const analysisResult = JSON.parse(response.choices[0].message.content);
      this.logger.log('Successfully analyzed musical structure via OpenAI');
      
      return analysisResult;
    } catch (error) {
      this.logger.error(`OpenAI API Error: ${error.message}`);
      throw new InternalServerErrorException('Failed to analyze musical structure');
    }
  }
}