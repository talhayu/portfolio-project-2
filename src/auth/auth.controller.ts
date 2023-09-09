import { Body, Controller, Post, HttpCode, HttpStatus, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard, Public } from 'src/authguard/auth.guard';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { UserEntity } from 'src/user/entities/user.entity';
import { ApiResponse } from 'src/shared/response/api-respose';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('login')
  signIn(@Body() signInDto: Record<string, any>) {
    return this.authService.signIn(signInDto.username, signInDto.password);
  }

  @Public()
  @HttpCode(HttpStatus.CREATED)
  @Post('register')
  async register(@Body() createUserDto: CreateUserDto): Promise<ApiResponse> {
    // Modify the newUser object to include roles
 
    const newUser: CreateUserDto = {
      ...createUserDto,
       // Assign roles here
    };
  
    const userRegister = await this.authService.register(newUser);
    return new ApiResponse(true, userRegister);
  }
  

  @Public()
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  @Post('logout')
  async signOut(@Request() req): Promise<string> {
    const token = req.headers.authorization?.split(' ')[1];
    const message = await this.authService.signOut(token);
    return message;
  }
}
