import { IsIn, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';
import type { AssistantCategory } from '../assistant.prompts';

export class AskAssistantDto {
  @IsString({ message: 'Prompt must be a string' })
  @IsNotEmpty({ message: 'Промпт не может быть пустым' })
  @MaxLength(10000, { message: 'Длина промпта не должна превышать 10000 символов' })
  prompt: string;

  @IsOptional()
  @IsIn(['general', 'code_review', 'decomposition', 'release_notes', 'standup'], {
    message: 'Недопустимая категория ассистента',
  })
  category?: AssistantCategory = 'general';

  @IsOptional()
  @IsString()
  @MaxLength(10000)
  context?: string;
}
