import { Controller, All, Req, Res, HttpStatus } from '@nestjs/common';
import { GatewayService } from './gateway.service';
import { Request, Response } from 'express';

@Controller()
export class GatewayController {
  constructor(private readonly gatewayService: GatewayService) {}

  @All('*')
  async proxy(@Req() req: Request, @Res() res: Response) {
    try {
      const result = await this.gatewayService.forwardRequest(req);
      res.status(result.status).send(result.data);
    } catch (err) {
      console.error('Proxy error:', err.message);
      res.status(HttpStatus.BAD_GATEWAY).json({ error: 'Gateway error' });
    }
  }
}
