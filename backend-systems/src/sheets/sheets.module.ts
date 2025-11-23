import { Module } from '@nestjs/common';
import { SheetsService } from './sheets.service';
import { SheetsController } from './sheets.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { SheetsGateway } from './sheets.gateway';

@Module({
  imports: [PrismaModule],
  controllers: [SheetsController],
  providers: [SheetsService, SheetsGateway],
  exports: [SheetsGateway]
})
export class SheetsModule { }
