import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class QueryTodoDto {
  @ApiPropertyOptional({ example: 'true', description: 'Filter by completed status' })
  @IsOptional()
  @Transform(({ value }) => {
    if (value === 'true') return true;
    if (value === 'false') return false;
    return value;
  })
  @IsBoolean()
  completed?: boolean;

  @ApiPropertyOptional({ example: 'groceries', description: 'Search term for title or description' })
  @IsOptional()
  @IsString()
  search?: string;
}
