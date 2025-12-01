import { Injectable } from '@nestjs/common';
import { CreateSheetDto } from './dto/create-sheet.dto';
import { UpdateSheetDto } from './dto/update-sheet.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { randomUUID } from 'node:crypto';
import { SheetsGateway } from './sheets.gateway';

interface UpdateData {
  material?: string;
  location?: string;
  width?: number;
  length?: number;
}

@Injectable()
export class SheetsService {
  constructor(
    private prisma: PrismaService,
    private sheetsGateway: SheetsGateway
  ) { }

  async create(createSheetDto: CreateSheetDto) {
    const codeGenerated = `CH-${randomUUID()}`;

    const newSheet = await this.prisma.sheet.create({
      data: {
        ...createSheetDto,
        code: codeGenerated
      }
    })

    this.sheetsGateway.notifyAddedPlate(newSheet)

    return newSheet;
  }

  async findAll() {
    return await this.prisma.sheet.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    });
  }

  async findMany(value: string) {
    const plates = await this.prisma.sheet.findMany({
      where: {
        material: {
          contains: value,
          mode: 'insensitive'
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return plates;
  }

  async findOne(id: number) {
    const sheet = await this.prisma.sheet.findUnique({
      where: { id },
      include: {
        sheetHistories: {
          orderBy: { updateDate: 'desc' }
        }
      }
    })

    if (!sheet) {
      throw new Error('Sheet not found.');
    }

    return sheet;
  }

  async update(id: number, updateSheetDto: UpdateSheetDto) {
    const oldSheet = await this.prisma.sheet.findUnique({
      where: { id }
    })

    if (!oldSheet) {
      throw new Error('Sheet not found.');
    }

    const updatesToRecord = [];

    const monitoredFields: Array<keyof UpdateData> = [
      'material',
      'location',
      'width',
      'length'
    ]

    for (const field of monitoredFields) {
      const newValue = updateSheetDto[field];
      const oldValue = oldSheet[field];

      const isValueDifferent = newValue !== undefined && String(newValue) !== String(oldValue);

      if (isValueDifferent) {

        const oldValueLog = oldValue === null || oldValue === undefined ? "null" : String(oldValue);
        const newValueLog = newValue === null || newValue === undefined ? "null" : String(newValue);

        updatesToRecord.push({
          sheetId: id,
          alteredField: field,
          oldValue: oldValueLog,
          newValue: newValueLog,
        })
      }
    }

    const result = await this.prisma.$transaction(async (tx) => {
      const updatedSheet = await tx.sheet.update({
        where: { id },
        data: updateSheetDto
      });

      if (updatesToRecord.length > 0) {
        await tx.sheetHistory.createMany({
          data: updatesToRecord,
        })
      }

      return updatedSheet;
    })

    this.sheetsGateway.notifyUpdatedPlate(result)

    return result;
  }

  async remove(id: number) {
    return await this.prisma.sheet.delete({
      where: { id }
    })
  }
}
