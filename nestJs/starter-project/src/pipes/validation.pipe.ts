import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';

/*  Основная задача pipe'ов - мэппинг (трансорфмация) и валидация данных. Например, позволяет валидировать принимаемую 
    DTO, либо преобразовывать string параметр из Query в int.
    
    Можно выделить два способа валидации в NestJS - schema-based и decorator-based. В первом случае используется 
    какая-либо библиотека (дока Nest рекомендует zod) для описания схемы и происходит инференция её типа. Во втором случае 
    используются декораторы для описания метаданных свойств класса. Вместе с ним дока Nest предлагает использовать либы
    class-validator и class-transformer.
*/
@Injectable()
export class ValidationPipe implements PipeTransform<any> {
  async transform(value: any, { metatype }: ArgumentMetadata) {
    if (!metatype || !this.toValidate(metatype)) {
      return value;
    }
    const object = plainToInstance(metatype, value);
    const errors = await validate(object);
    if (errors.length > 0) {
      throw new BadRequestException('Validation failed');
    }
    return value;
  }

  private toValidate(metatype): boolean {
    const types = [String, Boolean, Number, Array, Object];
    return !types.includes(metatype);
  }
}
