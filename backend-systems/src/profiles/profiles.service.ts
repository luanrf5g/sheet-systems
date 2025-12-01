import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { CreateProfileDto } from "./dto/create-profile.dto";
import { randomUUID } from "node:crypto";
import { ProfilesGateway } from "./profiles.gateway";
import { UpdateProfileDto } from "./dto/update-profile.dto";
import { TubeType } from "@prisma/client";

interface updateData {
  type?: TubeType;
  material?: string;
  thickness?: number;
  width?: number;
  height?: number;
  length?: number;
  location?: string;
}

@Injectable()
export class ProfilesService {
  constructor(
    private prisma: PrismaService,
    private profileGateway: ProfilesGateway
  ) { }

  async create(createProfileDto: CreateProfileDto) {
    const codeGenerated = `PR-${randomUUID()}`;

    const newProfile = await this.prisma.tube.create({
      data: {
        ...createProfileDto,
        code: codeGenerated
      }
    })

    this.profileGateway.notifyAddedProfile(newProfile)

    return newProfile;
  }

  async findAll() {
    return await this.prisma.tube.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    });
  }

  async findMany(search: string) {
    return await this.prisma.tube.findMany({
      where: {
        material: {
          contains: search,
          mode: 'insensitive'
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })
  }

  async findOne(id: number) {
    const profile = await this.prisma.tube.findUnique({
      where: { id },
      include: {
        tubeHistories: {
          orderBy: {
            updateDate: 'desc'
          }
        }
      }
    })

    if (!profile) {
      throw new Error("Profile not found.")
    }

    return profile;
  }

  async update(id: number, updateProfileDto: UpdateProfileDto) {
    const oldProfile = await this.prisma.tube.findUnique({
      where: { id }
    })

    if (!oldProfile) {
      throw new Error("Profile not found.")
    }

    const updatesToRecord = [];

    const monitoredFields: Array<keyof updateData> = [
      'type',
      'material',
      'thickness',
      'width',
      'height',
      'length',
      'location'
    ]

    for (const field of monitoredFields) {
      const oldValue = oldProfile[field];
      const newValue = updateProfileDto[field];

      const isValueDifferent = newValue !== undefined && String(newValue) !== String(oldValue);

      if (isValueDifferent) {
        const oldValueLog = oldValue === null || oldValue === undefined ? "null" : String(oldValue);
        const newValueLog = newValue === null || newValue === undefined ? "null" : String(newValue);

        updatesToRecord.push({
          tubeId: id,
          alteredField: field,
          oldValue: oldValueLog,
          newValue: newValueLog,
        })
      }
    }

    const result = await this.prisma.$transaction(async (tx) => {
      const updatedProfile = await tx.tube.update({
        where: { id },
        data: updateProfileDto
      })

      if (updatesToRecord.length > 0) {
        await tx.tubeHistory.createMany({
          data: updatesToRecord,
        })
      }

      return updatedProfile;
    })

    this.profileGateway.notifyUpdatedProfile(result)

    return result;
  }

  async remove(id: number) {
    return await this.prisma.tube.delete({
      where: { id }
    });
  }
}