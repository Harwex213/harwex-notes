import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

/*  В fastify/express мидлвари себя ведут по разному!
    https://docs.nestjs.com/techniques/performance#middleware */
@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  // Сюда можно внедрять зависимости

  use(req: Request, res: Response, next: NextFunction) {
    console.log('Request...');
    next();
  }
}

// Можно писать функциональные мидлвари, которые не имеют зависимостей
export function logger(req: Request, res: Response, next: NextFunction) {
  console.log(`Request...`);
  next();
}
