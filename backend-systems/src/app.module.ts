import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { SheetsModule } from './sheets/sheets.module';
import { ProfilesModule } from './profiles/profiles.module';

@Module({
  imports: [PrismaModule, SheetsModule, ProfilesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
