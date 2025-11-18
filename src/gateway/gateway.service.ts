import { Injectable } from '@nestjs/common';
import axios, { AxiosRequestConfig } from 'axios';
import { Request } from 'express';
import { ROUTE_CONFIG } from '../config/routes.config';

@Injectable()
export class GatewayService {
  async forwardRequest(req: Request) {
    const baseUrl = this.resolveBaseUrl(req.path);
    if (!baseUrl) throw new Error(`No route found for ${req.path}`);

    const url = `${baseUrl}${req.originalUrl}`;
    const config: AxiosRequestConfig = {
      method: req.method as any,
      url,
      headers: { ...req.headers, host: undefined }, // remove host header
      data: req.body,
      validateStatus: () => true, // return all responses
    };

    return await axios(config);
  }

  private resolveBaseUrl(path: string) {
    for (const prefix of Object.keys(ROUTE_CONFIG)) {
      if (path.startsWith(prefix)) return ROUTE_CONFIG[prefix];
    }
    return null;
  }
}
