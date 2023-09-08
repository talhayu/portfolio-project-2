import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  BadRequestException,
  NotFoundException,
  UseGuards,
  Headers,
  ForbiddenException,
} from '@nestjs/common';
import { NoteService } from './note.service';
import { CreateNoteDto } from './dto/create-note.dto';
import { UpdateNoteDto } from './dto/update-note.dto';
import { ApiResponse } from 'src/shared/response/api-respose';
import { NoteAuthGuard } from './noteguard/note.guard';
import { JwtAuthGuard } from 'src/auth/Jwt.guards';
import { TokenRevocationMiddleware } from 'src/auth/tokenrevoke/token-revocation.middleware';
import { RevokedTokenRepository } from 'src/auth/tokenrevoke/revoked-token.repository'; // Import the repository
import { User } from 'src/user/user.decorator';

@Controller('note')
export class NoteController {
  constructor(
    private readonly noteService: NoteService,
    private readonly revokedTokenRepository: RevokedTokenRepository, // Inject the repository
  ) {}

  @Get()
  @UseGuards(TokenRevocationMiddleware, JwtAuthGuard, NoteAuthGuard)
  async findAll(
    @Headers('authorization') token: string,
    @User() user: any,
  ): Promise<ApiResponse> {
    try {
      const authToken = token.replace('Bearer ', '');
      const isTokenRevoked = await this.revokedTokenRepository.isTokenRevoked(
        authToken,
      );
      if (isTokenRevoked) {
        throw new BadRequestException(
          'Token has been revoked, Please login again',
        );
      }
      const userId = user.id; // Retrieve user ID from the JWT payload
      const notes = await this.noteService.findNotesByUserId(userId);
      return new ApiResponse(true, notes);
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw new BadRequestException(
          'Token expired login again',
          error.getResponse(),
        );
      }
      throw error;
    }
  }

  @Get(':id')
  @UseGuards(TokenRevocationMiddleware, JwtAuthGuard, NoteAuthGuard)
  async findOne(
    @Param('id') id: number,
    @User() user: any,
    @Headers('authorization') token: string,
  ): Promise<ApiResponse> {
    try {
      const authToken = token.replace('Bearer ', '');
      const isTokenRevoked = await this.revokedTokenRepository.isTokenRevoked(
        authToken,
      );

      if (isTokenRevoked) {
        throw new BadRequestException(
          'Token has been revoked, Please login again',
        );
      }

      const userId = user.id; // Retrieve user ID from the JWT payload
      console.log('ID:', id);
      console.log('userid', userId);

      const note = await this.noteService.findOne(id);
      console.log('Retrieved Note:', note);
      console.log('note user id', note.user.id);

      if (note.user.id !== userId) {
        return new ApiResponse(
          false,
          'Access denied. This note does not belong to you.',
        );
      }
      const res = {
        userId: note.user.id,
        noteID: note.id,
        title: note.title,
        content: note.content,
        // createdAt: note.createdAt,
        // updatedAt: note.updatedAt,
      };
      return new ApiResponse(true, res);
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw new BadRequestException(
          'Token expired, login again',
          error.getResponse(),
        );
      }
      throw error;
    }
  }

  @Post()
  @UseGuards(TokenRevocationMiddleware, JwtAuthGuard, NoteAuthGuard)
  async create(
    @Body() createNoteDto: CreateNoteDto,
    @Headers('authorization') token: string,
    @User() user: any, // Get the user object from the JWT payload
  ): Promise<ApiResponse> {
    try {
      // Extract the token from the Authorization header
      const authToken = token.replace('Bearer ', ''); // Remove 'Bearer ' from the token

      // Check if the token is revoked
      const isTokenRevoked = await this.revokedTokenRepository.isTokenRevoked(
        authToken,
      );

      if (isTokenRevoked) {
        throw new BadRequestException(
          'Token has been revoked, Please login again',
        );
      }
      // Assign the user ID to the note before creating it
      createNoteDto.userId = user.id;
      console.log(user.id);
      const createNote = await this.noteService.create(createNoteDto);
      console.log(createNote);
      return new ApiResponse(true, createNote);
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw new BadRequestException(
          'Token expired login again',
          error.getResponse(),
        );
      }
      throw error;
    }
  }

  @Patch(':id')
  @UseGuards(TokenRevocationMiddleware, JwtAuthGuard, NoteAuthGuard)
  async update(
    @Param('id') id: number,
    @Body() updateNoteDto: UpdateNoteDto,
    @Headers('authorization') token: string,
    @User() user: any, // Assuming you can access user information this way
  ): Promise<ApiResponse> {
    try {
      const authToken = token.replace('Bearer ', ''); // Remove 'Bearer ' from the token

      // Check if the token is revoked
      const isTokenRevoked = await this.revokedTokenRepository.isTokenRevoked(
        authToken,
      );

      if (isTokenRevoked) {
        throw new BadRequestException(
          'Token has been revoked, Please login again',
        );
      }
      const userId = user.id;

      if (!(await this.noteService.doesNoteBelongToUser(id, userId))) {
        throw new ForbiddenException(
          'Access denied. This note does not belong to you.',
        );
      }
      const updated = await this.noteService.update(id, updateNoteDto);
      return new ApiResponse(true, updated);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(`Note with ID ${id} not found.`);
      } else if (error instanceof BadRequestException) {
        throw new BadRequestException(error.getResponse());
      }
      throw error;
    }
  }

  // note.controller.ts

  @Delete(':id')
  @UseGuards(TokenRevocationMiddleware, JwtAuthGuard, NoteAuthGuard)
  async delete(
    @Param('id') id: number,
    @User() user: any,
    @Headers('authorization') token: string,
  ): Promise<ApiResponse> {
    try {
      // Assuming you can access user information this way
      const authToken = token.replace('Bearer ', ''); // Remove 'Bearer ' from the token

      // Check if the token is revoked
      const isTokenRevoked = await this.revokedTokenRepository.isTokenRevoked(
        authToken,
      );

      if (isTokenRevoked) {
        throw new BadRequestException(
          'Token has been revoked, Please login again',
        );
      }
      const userId = user.id;

      // Check if the user owns the note they want to delete
      if (!(await this.noteService.doesNoteBelongToUser(id, userId))) {
        throw new ForbiddenException(
          'Access denied. This note does not belong to you.',
        );
      }

      // Proceed with deletion since the user owns the note
      await this.noteService.delete(id, userId);

      return new ApiResponse(true, 'Note deleted successfully');
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(`Note with ID ${id} not found.`);
      } else if (error instanceof ForbiddenException) {
        throw new ForbiddenException(
          'Access denied. This note does not belong to you.',
        );
      } else if (error instanceof BadRequestException) {
        throw new BadRequestException( error.getResponse());
      }
      throw error;
    }
  }
}
