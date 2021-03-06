import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Connection } from 'typeorm';
import { User } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>, private connection: Connection
  ) {}

  create(createUserDto: CreateUserDto): Promise<User> {
      const user = new User();
      user.firstName = createUserDto.firstname;
      user.lastName = createUserDto.lastname;

      return this.usersRepository.save(user);
  }

  async findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  findOne(id: string): Promise<User> {
    return this.usersRepository.findOne(id);
  }

  async remove(id: string): Promise<void> {
    await this.usersRepository.delete(id);
  }

  async createMany(users: User[]) {
    //-----------------------------------------------------------
    //   const queryRunner = this.connection.createQueryRunner();

    //   await queryRunner.connect();
    //   await queryRunner.startTransaction();
    //   try {
    //       await queryRunner.manager.save(users[0]);
    //       await queryRunner.manager.save(users[1]);

    //       await queryRunner.commitTransaction();
    //   } catch (err) {
    //       await queryRunner.rollbackTransaction();
    //   } finally {
    //       await queryRunner.release();
    //   }
    //---------------------------OR ----------------------------
    await this.connection.transaction(async manager => {
        await manager.save(users[0]);
        await manager.save(users[1]);
    });
    //----------------------------------------------------------
  }
}