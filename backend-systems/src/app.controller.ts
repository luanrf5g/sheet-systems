import { Controller, Get, Param } from '@nestjs/common';
import { AppService } from './app.service';

@Controller('/')
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get()
  getAll() {
    return this.appService.getAll();
  }

  @Get('/search/:material')
  findMany(@Param('material') material: string) {
    return this.appService.findMany(material);
  }

  @Get('/item/:code')
  findone(@Param('code') code: string) {
    return this.appService.findOne(code);
  }
}
