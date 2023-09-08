// auth.service.ts

import {
  Injectable,
  UnauthorizedException,
  ConflictException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { secret } from 'src/constants/user.constants';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { UserEntity } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';
import { RevokedTokenRepository } from './tokenrevoke/revoked-token.repository';

@Injectable()
export class AuthService {
  // private revokedTokens: string[] = [];

  constructor(
    private userService: UserService,
    private readonly jwtService: JwtService,
    private readonly revokedTokenRepository: RevokedTokenRepository
  ) {console.log('AuthService constructor called');}

  async signIn(username: string, pass: string): Promise<any> {
    const user = await this.userService.findOne(username);
    console.log('User Data:', user);
    if (!user || !(await bcrypt.compare(pass, user.password))) {
      throw new UnauthorizedException('saasa');
    }

    // Include user roles in the JWT payload
    console.log(user.roles)
    const payload = { id: user.id, username: user.username, roles: user.roles };

    const accessToken = await this.jwtService.signAsync(payload, {
      secret,
      expiresIn: '2h',
    });

    return { accessToken };
  }

  async register(createUserDto: CreateUserDto): Promise<Partial<UserEntity>> {
    const { username, password,  ...userData } = createUserDto;

    // Check if the username already exists
    const existingUser = await this.userService.findOne(username);
    if (existingUser) {
      throw new ConflictException('Username already exists');
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    const roles = createUserDto.roles || [];

    // Create the user with the hashed password
    const user = await this.userService.createUser({
      username,
      password: hashedPassword,
      roles: roles || [],
      ...userData,
    });

    const { password: _, ...result } = user;
    console.log(result.roles);

    return result;
  }

  async signOut(token: string): Promise<string> {
    console.log('Token to revoke:', token);
  const isTokenRevoked = await this.revokedTokenRepository.isTokenRevoked(token);
    if (!isTokenRevoked) {
      // Token is not revoked, so revoke it now
      const expiration = new Date(); // Set the expiration date to the current time
      await this.revokedTokenRepository.revokeToken(token, expiration);
              
    }

    return 'Logout successful';
  }
}
