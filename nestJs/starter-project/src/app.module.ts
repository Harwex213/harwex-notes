import { Module, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { APP_FILTER, APP_GUARD, APP_PIPE } from '@nestjs/core';

import { CatsModule } from './cats/cats.module';
import { LoggerMiddleware } from './middlewares/logger.middleware';
import { CatsController } from './cats/cats.controller';
import { HttpExceptionFilter } from './filters/http-exception.filter';
import { ValidationPipe } from './pipes/validation.pipe';
import { AuthGuard } from './guards/auth.guard';

/*  NestJs оперирует модулями, которые являются синглтонами и предоставляют определенную фичу. При запуске приложения
    строится граф зависимостей для функционирования IoC */
@Module({
  providers: [
    {
      provide: APP_FILTER, // Переопределяем глобальный фильтр. Таким образом получаем доступ к DI
      useClass: HttpExceptionFilter,
    },
    {
      provide: APP_PIPE, // Переопределяем глобальный валидирующий pipe. Таким образом получаем доступ к DI
      useClass: ValidationPipe,
    },
    {
      provide: APP_GUARD, // Переопределяем глобальный guard.
      useClass: AuthGuard,
    },
  ],
  imports: [CatsModule],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      /*  При использовании express-platform'ы urlencoded и json аплаются автоматически. 
          Чтобы отключить надо сетнуть bodyParser: false при создании приложения (NestFactory.create()) */
      .apply(LoggerMiddleware)
      .exclude(
        { path: 'cats', method: RequestMethod.GET },
        { path: 'cats', method: RequestMethod.POST },
        'cats/(.*)',
      )
      .forRoutes(CatsController);
    // .forRoutes({ path: 'cats', method: RequestMethod.GET });
  }
}
