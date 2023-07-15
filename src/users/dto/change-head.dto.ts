import { IsNotEmpty } from 'class-validator';

export class ChangeHeadDto {
  @IsNotEmpty()
  headId: number;
}
