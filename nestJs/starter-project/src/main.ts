import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { logger } from './middlewares/logger.middleware';

// Полезные ссылки, связанные с NestJS - https://github.com/nestjs/awesome-nestjs

async function bootstrap() {
  /*  NestFactory предоставляет интерфейс для создания инстанса INestApplication и конфигурации Dependecy Injection.
      NestFactory.create() является дженерик методом и подставленный тип будет получен при возврате (по умолчанию INestApplication). 
      Также можно пихнуть HTTP адаптер (по умолчанию express). Что это конкретно меняет, пока не ясно. */
  const app = await NestFactory.create(AppModule);
  // const app = await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter());

  app.use(logger); // Подключение глобальной мидлвари

  // app.useGlobalFilters(new HttpExceptionFilter()); // Иной метод определения глобального фильтра, но тогда у него не будет доступа к DI

  await app.listen(3000);

  console.log('Run on: ' + (await app.getUrl()));
}
bootstrap();
