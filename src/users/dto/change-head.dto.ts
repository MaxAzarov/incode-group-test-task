import { IsNotEmpty, Validate } from 'class-validator';
import { IsExist } from 'src/utils/validators/is-exist.validator';

export class ChangeHeadDto {
  @IsNotEmpty()
  @Validate(IsExist, ['User', 'headId'], {
    message: 'emailAlreadyExists',
  })
  headId: number;
}
