import { Transform } from 'class-transformer';
import { IsEnum } from 'class-validator';
import { IsEmail, IsNotEmpty, MinLength, Validate } from 'class-validator';
import { IsNotExist } from 'src/utils/validators/is-not-exists.validator';
import { UserRole } from '../types/user-roles';

export class CreateUserDto {
  @IsNotEmpty()
  @IsEnum(UserRole)
  type: UserRole;

  @Transform(({ value }) => value?.toLowerCase().trim())
  @IsNotEmpty()
  @Validate(IsNotExist, ['User'], {
    message: 'emailAlreadyExists',
  })
  @IsEmail()
  email: string;

  @MinLength(6)
  password?: string;

  @IsNotEmpty()
  name?: string | null;
}
