import {
    ConflictException,
    Injectable,
    UnauthorizedException,
  } from '@nestjs/common';
  import { JwtService } from '@nestjs/jwt';
  import * as bcrypt from 'bcrypt';
  import { secret } from 'src/constants/user.constants';
  import { CreateUserDto } from 'src/user/dto/create-user.dto';
  import { UserEntity } from 'src/user/entities/user.entity';
  import { UserService } from 'src/user/user.service';
  
  @Injectable() 
  export class AuthService {
    private revokedTokens: string[] = [];
  
    constructor(
      private userService: UserService,
      private readonly jwtService: JwtService,
    ) {}
  
    async signIn(username: string, pass: string): Promise<any> {
      const user = await this.userService.findOne(username);
      if (!user || !(await bcrypt.compare(pass, user.password))) {
        throw new UnauthorizedException();
      }
      const payload = { id: user.id, username };
      const accessToken = await this.jwtService.signAsync(payload, {
        secret,
        expiresIn: '2m',
      });
  
      return { accessToken };
    }
    async register(createUserDto: CreateUserDto): Promise<Partial<UserEntity>> {
      const { username, password, ...userData } = createUserDto;
  
      // Check if the username already exists
      const existingUser = await this.userService.findOne(username);
      if (existingUser) {
        throw new ConflictException('Username already exists');
      }
  
      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);
  
      // Create the user with the hashed password
      const user = await this.userService.createUser({
        username,
        password: hashedPassword,
        ...userData,
      });
  
      const { password: _, ...result } = user;
      return result;
    }
  
    async signOut(token: string): Promise<string> {
      this.revokeToken(token);
  
      return 'Logout successful'; // Return the success message
    }
  
    private revokeToken(token: string): void {
      this.revokedTokens.push(token); // Add the token to the revoked tokens list
    }
  
    isTokenRevoked(token: string): boolean {
      return this.revokedTokens.includes(token); // Check if the token is revoked
    }
  }
  