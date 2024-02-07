import {
  Controller,
  Get,
  Query,
  Post,
  Body,
  Put,
  Param,
  Delete,
  HttpException,
  HttpStatus,
  BadRequestException,
  UseFilters,
  DefaultValuePipe,
  UseGuards,
} from '@nestjs/common';

import { CreateCatDto, UpdateCatDto, ListAllEntities } from './cats.dtos';
import { CatsService } from './cats.service';
import { Cat } from './interfaces/cat.interface';
import { HttpExceptionFilter } from 'src/filters/http-exception.filter';
import { ParseIntPipe } from '../pipes/parse-int.pipe';
import { RolesGuard } from 'src/guards/roles.guard';

@UseGuards(RolesGuard) // Включение guard'ов
@Controller('cats') // Обязательный декоратор, позволяет задать префикс пути для всех обработчиков
export class CatsController {
  constructor(
    private catsService: CatsService, // Внедряем зависимость, использование здесь private сразу объявляет и инициализирует переменную
  ) {}

  @Post() // Декораторы HTTP метода - Get, Post, Put, Delete и т.д. На имя метода NestJS плевать
  // @HttpCode(204) // Меняем HttpCode. По умолчанию у Post 201, у остальных 200
  // @Header('Cache-Control', 'none') // Устанавливаем Http заголовок
  // @Redirect('https://nestjs.com', 301) // Устанавливаем Http заголовок для редиректа. Статический, для динамического нужно юзать объект Request
  // @UseFilters(new HttpExceptionFilter()) // Сетаем фильтр.
  // @UseFilters(HttpExceptionFilter) // Сетаем фильтр. Только тут IoC за нас создаст инстанс
  create(@Body() createCatDto: CreateCatDto) {
    // Декоратор получения инфы из объекта Request. В данном случае Body
    this.catsService.create(createCatDto);

    return {
      id: Math.floor((Math.random() * 1000) % 100),
      name: 'Naomi',
      optional: 'Этот объект будет автоматически сериализован в JSON',
    };
  }

  @Get('data')
  async findAllData(): Promise<Cat[]> {
    return this.catsService.findAll();
  }

  @Get()
  findAll(@Query() query: ListAllEntities) {
    return `This action returns all cats (limit: ${query.limit} items)`;
  }

  @Get(':id')
  findOne(
    // Pipe'ы в Nest сетаются в декоратах @Body, @Query, @Param и кастомных декоратах
    @Query('id', new DefaultValuePipe(0), ParseIntPipe) id: number, // Использование pipe'а для парсинга и установки значения по умолчанию
  ) {
    return `This action returns a #${id} cat`;
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateCatDto: UpdateCatDto) {
    return `This action updates a #${id} cat`;
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    /*  Send to client:
        {
          "statusCode": 403,
          "message": "Forbidden"
        }
    */
  }

  @Get('customError')
  getCustomError() {
    throw new HttpException(
      {
        status: HttpStatus.FORBIDDEN,
        error: 'This is a custom message',
      },
      HttpStatus.FORBIDDEN,
      { cause: 'Oi oi oi...' },
    );
    /*  Send to client:
        {
          "statusCode": 403,
          "message": "This is a custom message"
        }
    */
  }

  @Get('badRequest')
  getBadRequest() {
    throw new BadRequestException('Something bad happened', {
      cause: new Error(),
      description: 'Some error description',
    });
    /*  Send to client:
        {
          "message": "Something bad happened",
          "error": "Some error description",
          "statusCode": 400,
        }
    */
  }
}
