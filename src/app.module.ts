import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { databaseConfig } from './config/database.config';
import { Entity } from 'typeorm';

import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { AuthController } from './auth/auth.controller';
import { AuthService } from './auth/auth.service';
import { JwtService } from '@nestjs/jwt';
import { NoteModule } from './note/note.module';


@Module({
  imports: [
    TypeOrmModule.forRoot(databaseConfig),
    UserModule,
    AuthModule,
    NoteModule,
    NoteModule
 
  ],
  controllers: [AppController, AuthController],
  providers: [ JwtService, AppService, AuthService],
})
export class AppModule {}
