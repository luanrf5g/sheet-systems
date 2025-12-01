import { TubeType } from "@prisma/client";
import { IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString, IS_ENUM, IsEnum } from "class-validator";

export class CreateProfileDto {
  @IsString({ message: "Type must be a string." })
  @IsNotEmpty({ message: "Type is required." })
  @IsEnum(TubeType, {
    message: "Type must be one of the following values: CIRCULAR, RECTANGULAR, SQUARE."
  })
  type: TubeType;

  @IsString({ message: "Material must be a string." })
  @IsNotEmpty({ message: "Material is required." })
  material: string;

  @IsNumber()
  @IsPositive({ message: "Thickness must be a positive number." })
  thickness: number;

  @IsNumber()
  @IsPositive({ message: "Width must be a positive number." })
  width: number;

  @IsNumber()
  @IsPositive({ message: "Height must be a positive number." })
  height: number;

  @IsNumber()
  @IsPositive({ message: "Length must be a positive number." })
  length: number;

  @IsNumber()
  @IsPositive({ message: "Weight must be a positive number." })
  @IsOptional()
  weight?: number;

  @IsString({ message: "Location must be a string." })
  @IsOptional()
  location?: string;
}