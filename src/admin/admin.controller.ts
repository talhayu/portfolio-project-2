// admin-note.controller.ts
import {
  Controller,
  Get,
  Delete,
  UseGuards,
  Param,
  Headers,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { AdminNoteService } from './admin.service';
import { JwtAuthGuard } from 'src/auth/Jwt.guards';
import { ApiResponse } from 'src/shared/response/api-respose';
import { TokenRevocationMiddleware } from 'src/auth/tokenrevoke/token-revocation.middleware';
import { AdminAuthGuard } from './admin.guard';
import { User } from 'src/user/user.decorator';
import { RevokedTokenRepository } from 'src/auth/tokenrevoke/revoked-token.repository';

@Controller('admin')
export class AdminNoteController {
  constructor(
    private readonly adminNoteService: AdminNoteService,
    private readonly revokedTokenRepository: RevokedTokenRepository,
  ) {}

  @Get('note')
  @UseGuards(TokenRevocationMiddleware, JwtAuthGuard, AdminAuthGuard)
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
      const notes = await this.adminNoteService.getAllNotes();
      return new ApiResponse(true, notes);
    } catch (err) {
      // Handle the error here, log it, or return an appropriate response
      // For example, you can return a response like this:
      return new ApiResponse(false, err.getResponse());
    }
  }
  @Get('note/:id')
  @UseGuards(TokenRevocationMiddleware, JwtAuthGuard, AdminAuthGuard)
  async findbyid(
    @Param('id') id: number,
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
      const notes = await this.adminNoteService.getbyid(id);
      return new ApiResponse(true, notes);
    } catch (err) {
      // Handle the error here, log it, or return an appropriate response
      // For example, you can return a response like this:
      return new ApiResponse(false, err.getResponse());
    }
  }

  @Delete('note/:id')
  @UseGuards(TokenRevocationMiddleware, JwtAuthGuard, AdminAuthGuard)
  async deleteNoteById(
    @Param('id') id: number,
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
      const note = await this.adminNoteService.getbyid(id);

      if (!note) {
        throw new NotFoundException('Note not found');
      }
      await this.adminNoteService.deleteNoteById(id);
      return new ApiResponse(true, 'Note deleted successfully');
    } catch (err) {
      return new ApiResponse(false, err.getResponse());
    }
  }

  @Get('user')
  @UseGuards(TokenRevocationMiddleware, JwtAuthGuard, AdminAuthGuard)
  async getAllUser(
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
      const user = await this.adminNoteService.getAllUser();
      return new ApiResponse(true, user);
    } catch (err) {
      return new ApiResponse(false, err.getResponse());
    }
  }

  @Get('user/:id')
  @UseGuards(TokenRevocationMiddleware, JwtAuthGuard, AdminAuthGuard)
  async getUserById(
    @Headers('authorization') token: string,
    @Param('id') id: number,
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
      const user = await this.adminNoteService.getUserById(id);
      return new ApiResponse(true, user);
    } catch (err) {
      return new ApiResponse(false, err.getResponse());
    }
  }

  @Delete('user/:id')
  @UseGuards(TokenRevocationMiddleware, JwtAuthGuard, AdminAuthGuard)
  async deleteUser(
    @Headers('authorization') token: string,
    @Param('id') id: number,
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
      await this.adminNoteService.deleteUser(id);
      return new ApiResponse(true, 'User deleted');
    } catch (err) {
      return new ApiResponse(false, err.getResponse());
    }
  }

  // Add routes and handlers for user management if needed
}
