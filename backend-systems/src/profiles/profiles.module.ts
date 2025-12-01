import { Module } from "@nestjs/common";
import { ProfilesController } from "./profiles.controller";
import { ProfilesService } from "./profiles.service";
import { ProfilesGateway } from "./profiles.gateway";
import { PrismaModule } from "src/prisma/prisma.module";

@Module({
  imports: [PrismaModule],
  controllers: [ProfilesController],
  providers: [ProfilesService, ProfilesGateway],
  exports: [ProfilesGateway]
})
export class ProfilesModule { }