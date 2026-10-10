import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AssistantService } from './assistant.service';
import { AskAssistantDto } from './dto/ask-assistant.dto';

@Controller('assistant')
export class AssistantController {
  constructor(private readonly assistantService: AssistantService) {}

  @Post('ask')
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ValidationPipe({ transform: true, whitelist: true }))
  async ask(@Body() dto: AskAssistantDto) {
    return this.assistantService.ask(dto);
  }

  @Get('history')
  async getHistory() {
    return this.assistantService.getHistory();
  }

  @Delete('history')
  async clearHistory() {
    return this.assistantService.clearHistory();
  }

  @Get('health')
  async getHealth() {
    return this.assistantService.getHealth();
  }
}
