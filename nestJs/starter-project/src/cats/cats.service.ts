import { Injectable, Optional, Inject } from '@nestjs/common';
import { Cat } from './interfaces/cat.interface';

@Injectable() // Сообщает NestJs, что этот сервис будет провайдером и его можно будет кудысь инжектить
export class CatsService {
  private readonly cats: Cat[] = [];

  constructor(
    @Optional() // Если не найдет зависимость, не вызывет ошибки
    @Inject('NON_CLASS_BASED_VALUE')
    private example: any, // Внедрение зависимости по токену, а не типу
  ) {}

  create(cat: Cat) {
    this.cats.push(cat);
  }

  findAll(): Cat[] {
    return this.cats;
  }
}
