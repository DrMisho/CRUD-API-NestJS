import { IsBoolean, IsInt, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProductDto {
  @ApiProperty()
  @IsString()
  readonly product_name: string;

  @ApiProperty()
  @IsInt()
  readonly price: string;

  @ApiProperty()
  @IsBoolean()
  readonly available: boolean;
}
