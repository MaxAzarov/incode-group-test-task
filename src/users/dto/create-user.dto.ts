import { Transform } from 'class-transformer';
import { IsEnum, IsOptional } from 'class-validator';
import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';
import { UserRole } from '../types/user-roles';

export class CreateUserDto {
  @IsNotEmpty()
  @IsEnum(UserRole, { message: 'Invalid role' })
  role!: UserRole;

  @Transform(({ value }) => value?.toLowerCase().trim())
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsOptional()
  headId: number;

  @MinLength(6)
  password?: string;

  @IsNotEmpty()
  name?: string | null;
}
