  import { Injectable, NestMiddleware, UnauthorizedException } from '@nestjs/common';
  import { RevokedTokenRepository } from './revoked-token.repository';
  import { Request, Response, NextFunction } from 'express';

  @Injectable()
  export class TokenRevocationMiddleware implements NestMiddleware {
    constructor(private readonly revokedTokenRepository: RevokedTokenRepository) {}

    async use(req: Request, res: Response, next: NextFunction) {
      const headers = req.headers as { authorization?: string };
      const token = headers.authorization?.split(' ')[1];

      if (token) {
        console.log('Token provided:', token);

        // Check if the token is revoked
        const isTokenRevoked = await this.revokedTokenRepository.isTokenRevoked(token);

        if (isTokenRevoked) {
          console.log('Token has been revoked');
          throw new UnauthorizedException('Token has been revoked');
        }
      }

      next();
    }
  }
