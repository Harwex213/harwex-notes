import { Module } from '@nestjs/common';
import { CatsController } from './cats.controller';
import { CatsService } from './cats.service';

/*  Позволяет зарегистрировать модуль глобально - для инджекта его экспортов не понадобится везде импортить этот модуль.
    При использовании следует импортировать только 1 раз, в AppModule */
// @Global()
@Module({
  controllers: [CatsController],
  providers: [
    // То, что сможем индекжтить внутри скопа этого модуля
    CatsService,
    {
      provide: 'NON_CLASS_BASED_VALUE',
      useValue: 'Hello World!',
    },
  ],
  exports: [CatsService], // То, что смогут инджектить другие модули при импорте этого модуля
})
export class CatsModule {
  constructor(private catsService: CatsService) {} // Можно индежктить провадйеры (для конфигурации?)
}
