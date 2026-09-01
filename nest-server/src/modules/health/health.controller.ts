import { Controller, Get, Res } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import type { Response } from 'express';
import { register } from 'prom-client';

@ApiTags('Healthcheck')
@Controller()
export class HealthController {
  @Get('healthcheck')
  @ApiOperation({ summary: 'Responds if the app is up and running' })
  @ApiResponse({ status: 200, description: 'App is up and running' })
  healthcheck(@Res() res: Response) {
    return res.sendStatus(200);
  }

  @Get('metrics')
  @ApiOperation({ summary: 'Prometheus metrics endpoint' })
  async metrics(@Res() res: Response) {
    res.set('Content-Type', register.contentType);
    res.send(await register.metrics());
  }
}
