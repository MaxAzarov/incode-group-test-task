import { Injectable } from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(private readonly entityManger: EntityManager) {}

  create(createUserDto: CreateUserDto) {
    const usersRepository = this.entityManger.getRepository(User);

    return usersRepository.save(usersRepository.create(createUserDto));
  }

  findAll() {
    return `This action returns all users`;
  }

  findOne(fields: Partial<Pick<User, 'id' | 'email'>>) {
    const userRepository = this.entityManger.getRepository(User);

    return userRepository.findOne({ where: fields });
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }
}
