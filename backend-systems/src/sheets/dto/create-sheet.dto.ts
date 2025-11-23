import { IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString } from "class-validator";

export class CreateSheetDto {
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
