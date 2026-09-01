import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { CreateSessionDto } from './dto/create-session.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { GetUser } from '../../common/decorators/get-user.decorator';

@ApiTags('Session')
@Controller('api/sessions')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post()
  @ApiOperation({ summary: 'Create a session' })
  @ApiResponse({ status: 200, description: 'Session created' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async createSession(
    @Body() createSessionDto: CreateSessionDto,
    @Headers('user-agent') userAgent: string = '',
  ) {
    return this.authService.createSession(createSessionDto, userAgent);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all sessions' })
  @ApiResponse({ status: 200, description: 'Get all sessions for current user' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async getUserSessions(@GetUser('_id') userId: string) {
    return this.authService.findUserSessions(userId);
  }

  @Delete()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete a session' })
  @ApiResponse({ status: 200, description: 'Session deleted' })
  @ApiResponse({ status: 403, description: 'Forbidden' })
  async deleteSession(@GetUser('session') sessionId: string) {
    return this.authService.deleteSession(sessionId);
  }
}
