import {
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';

import { EntityRepository, Repository } from 'typeorm';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { User } from './user.entity';

@EntityRepository(User)
export class UsersRepository extends Repository<User> {
  // creating user
  async creatUser(authCredentials: AuthCredentialsDto): Promise<void> {
    const { username, password } = authCredentials;
    // gen a salt
    const salt = await bcrypt.genSalt();
    // hash the password
    const hashPassword = await bcrypt.hash(password, salt);

    // create a new user with the username and password hashed
    const user = this.create({ username, password: hashPassword });
    try {
      // if no error -> save to db
      await this.save(user);
    } catch (error) {
      // error.code -> 23505 = duplicate username
      if (error.code === '23505') {
        throw new ConflictException('Username already exists');
      } else {
        throw new InternalServerErrorException('dfdf');
      }
    }
  }
}
