import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { EntityManager } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { ChangeHeadDto } from './dto/change-head.dto';
import { UserRole } from './types/user-roles';

@Injectable()
export class UsersService {
  constructor(private readonly entityManger: EntityManager) {}

  async create(createUserDto: CreateUserDto) {
    const usersRepository = this.entityManger.getRepository(User);

    if (createUserDto.role === UserRole.Admin && createUserDto.headId) {
      throw new BadRequestException({ error: 'Can not assign boss to admin' });
    }

    if (createUserDto.role === UserRole.User && !createUserDto.headId) {
      throw new BadRequestException({
        error: 'Can not create user without boss',
      });
    }

    if (createUserDto.headId) {
      const user = await usersRepository.findOne({
        where: { id: createUserDto.headId },
      });

      if (user.role !== UserRole.Boss) {
        throw new BadRequestException({
          error: `Can not assign ${user.role} as boss`,
        });
      }
    }

    return usersRepository.save(usersRepository.create(createUserDto));
  }

  async findAll(userId: number) {
    const userRepository = this.entityManger.getRepository(User);

    const user = await userRepository.findOne({ where: { id: userId } });

    if (!user) {
      throw new BadRequestException({ error: 'User does not exist' });
    }

    if (user.role === UserRole.Admin) {
      return userRepository
        .createQueryBuilder('users')
        .leftJoinAndSelect('users.head', 'head')
        .getMany();
    } else if (user.role === UserRole.Boss) {
      const users = await userRepository
        .createQueryBuilder('user')
        .where('user.headId = :bossId', { bossId: user.id })
        .getMany();

      return { ...user, subordinates: users };
    } else if (user.role === UserRole.User) {
      return userRepository
        .createQueryBuilder('users')
        .leftJoinAndSelect('users.head', 'head')
        .where('users.id = :id', { id: userId })
        .getOne();
    }
  }

  findOne(fields: Partial<Pick<User, 'id' | 'email'>>) {
    const userRepository = this.entityManger.getRepository(User);

    return userRepository.findOne({ where: fields });
  }

  async updateUserHead(id: number, changeHeadDto: ChangeHeadDto) {
    const userRepository = this.entityManger.getRepository(User);

    const user = await userRepository.findOne({ where: { id } });

    if (!user) {
      throw new BadRequestException({ error: 'User does not exist' });
    }

    if (user.role === UserRole.Admin) {
      throw new ForbiddenException({ error: 'Can not set boss of admin' });
    }

    const head = await userRepository.findOne({
      where: { id: changeHeadDto.headId },
    });

    if (head.role !== UserRole.Boss) {
      throw new ForbiddenException({ error: 'Can not set boss' });
    }

    return userRepository.save(
      userRepository.create({
        id,
        ...changeHeadDto,
      }),
    );
  }
}
