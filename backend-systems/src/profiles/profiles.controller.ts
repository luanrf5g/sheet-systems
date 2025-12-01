import { Body, Controller, Delete, Get, Param, Patch, Post } from "@nestjs/common";
import { ProfilesService } from "./profiles.service";
import { CreateProfileDto } from "./dto/create-profile.dto";
import { UpdateProfileDto } from "./dto/update-profile.dto";

@Controller('profiles')
export class ProfilesController {
  constructor(private readonly profilesService: ProfilesService) { }


  @Post()
  create(@Body() CreateProfileDto: CreateProfileDto) {
    return this.profilesService.create(CreateProfileDto);
  }

  @Get()
  findAll() {
    return this.profilesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.profilesService.findOne(+id);
  }

  @Get('search/:material')
  findMany(@Param('material') material: string) {
    return this.profilesService.findMany(material);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() UpdateProfileDto: UpdateProfileDto) {
    return this.profilesService.update(+id, UpdateProfileDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.profilesService.remove(+id);
  }
}