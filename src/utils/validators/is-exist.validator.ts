import { DataSource } from 'typeorm';
import { Injectable } from '@nestjs/common';
import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { ValidationArguments } from 'class-validator/types/validation/ValidationArguments';

@ValidatorConstraint({ name: 'IsExist', async: true })
@Injectable()
export class IsExist implements ValidatorConstraintInterface {
  constructor(private dataSource: DataSource) {}

  async validate(value: string, validationArguments: ValidationArguments) {
    const repository = validationArguments.constraints[0] as string;
    const pathToProperty = validationArguments.constraints[1];

    const dbRepository = await this.dataSource.getRepository(repository);

    const entity: unknown = await dbRepository.findOne({
      where: {
        [pathToProperty ? pathToProperty : validationArguments.property]:
          pathToProperty ? value?.[pathToProperty] ?? value : value,
      },
    });

    return Boolean(entity);
  }
}
