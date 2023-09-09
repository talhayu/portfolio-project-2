import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { databaseConfig } from './config/database.config';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { NoteModule } from './note/note.module';
import { AdminNoteModule } from './admin/admin.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(databaseConfig),
    UserModule,
    AuthModule,
    NoteModule,
    AdminNoteModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
