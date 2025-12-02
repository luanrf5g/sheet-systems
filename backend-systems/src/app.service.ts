import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { Sheet, Tube } from '@prisma/client';

function mergeSortedArrays(plates: Sheet[], profiles: Tube[]) {
  const combined = [...plates, ...profiles];
  combined.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  return combined;
}

@Injectable()
export class AppService {
  constructor(private prisma: PrismaService) { }

  async getAll() {
    const plates = await this.prisma.sheet.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    })

    const profiles = await this.prisma.tube.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    })

    return mergeSortedArrays(plates, profiles);
  }

  async findMany(search: string) {
    const plates = await this.prisma.sheet.findMany({
      where: {
        material: {
          contains: search,
          mode: 'insensitive'
        }
      }
    })

    const profiles = await this.prisma.tube.findMany({
      where: {
        material: {
          contains: search,
          mode: 'insensitive'
        }
      }
    })

    return mergeSortedArrays(plates, profiles);
  }

  async findOne(code: string) {
    const plate = await this.prisma.sheet.findUnique({
      where: { code }
    })

    if (plate) return plate;

    const profile = await this.prisma.tube.findUnique({
      where: { code }
    })

    return profile;
  }
}
