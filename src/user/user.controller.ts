import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  ParseIntPipe,
  Req,
  UploadedFile,
  StreamableFile,
  UseInterceptors,
} from '@nestjs/common';
import { Request } from 'express';
import { diskStorage } from 'multer';
import { SingleFileDto } from './dto/single-file.dto';
import { FastifyFileInterceptor } from './interceptor/fastify-file.interceptor';
import { fileMapper } from './utils/file-mapper';
import { editFileName, imageFileFilter } from './utils/file-upload-util';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { map, Observable } from 'rxjs';
import { JwtAuthGuard } from 'src/auth/guards/jwt-guard';
import { UserIsUserGuard } from 'src/auth/guards/userIsUser.guard';
import { LoginUserDto } from './dto/login-user.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiNotFoundResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiTooManyRequestsResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { createReadStream } from 'fs';
import { join } from 'path';
import { SkipThrottle } from '@nestjs/throttler';

@ApiBearerAuth()
@SkipThrottle()
@ApiTags('User')
@Controller('user') //  /user
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({ summary: 'Create User' })
  @ApiResponse({
    status: 201,
    description: 'Created Successfully.',
    type: User,
  })
  @ApiBody({ type: CreateUserDto })
  @Post() // /user
  async create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @SkipThrottle(false)
  @ApiOperation({ summary: 'Login User' })
  @ApiResponse({ status: 203, description: 'Login Success', type: User })
  @ApiTooManyRequestsResponse({ description: 'Too many Request.'})
  @ApiBody({ type: LoginUserDto })
  @Post('login')
  login(@Body() user: LoginUserDto): Observable<Object> {
    console.log(user);
    return this.userService.login(user).pipe(
      map((jwt: string) => {
        return { access_token: jwt };
      }),
    );
  }

  @ApiOperation({ summary: 'Get All Users' })
  @ApiResponse({
    status: 200,
    description: 'The found records',
    type: [User],
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized.'})
  @ApiNotFoundResponse()
  @UseGuards(JwtAuthGuard)
  @Get() // /user
  async findAll(): Promise<User[]> {
    return this.userService.findAll();
  }

  @ApiOperation({ summary: 'Get a User' })
  @ApiResponse({
    status: 200,
    description: 'The found record',
    type: User,
  })
  @ApiNotFoundResponse()
  @ApiUnauthorizedResponse({ description: 'Unauthorized.'})
  @UseGuards(JwtAuthGuard, UserIsUserGuard)
  @Get(':id') // /user/:id
  async findOne(@Param('id', ParseIntPipe) id: string) {
    return this.userService.findOne(+id);
  }

  @ApiOperation({ summary: 'Update a User' })
  @ApiResponse({
    status: 200,
    description: 'The record is Updated',
    type: User,
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized.'})
  @ApiBody({ type: UpdateUserDto })
  @UseGuards(JwtAuthGuard, UserIsUserGuard)
  @Patch(':id') // /user/id
  async update(
    @Param('id', ParseIntPipe) id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.userService.update(+id, updateUserDto);
  }

  @ApiOperation({ summary: 'Delete a User' })
  @ApiResponse({
    status: 200,
    description: 'The record is Deleted',
    type: 'string',
  })
  @ApiUnauthorizedResponse({ description: 'Unauthorized.'})
  @UseGuards(JwtAuthGuard, UserIsUserGuard)
  @Delete(':id') // /user/id
  async remove(@Param('id', ParseIntPipe) id: string) {
    return this.userService.remove(+id);
  }

  @ApiConsumes('multipart/form-data')
  @Post('single-file')
  @UseInterceptors(
    FastifyFileInterceptor('photo_url', {
      storage: diskStorage({
        destination: './upload/single',
        filename: editFileName,
      }),
      fileFilter: imageFileFilter,
    }),
  )
  single(
    @Req() req: Request,
    @UploadedFile() file: Express.Multer.File,
    @Body() body: SingleFileDto,
  ) {
    return { ...body, photo_url: fileMapper({ file, req }) };
  }

  @Get('stream-file')
  getFile(): StreamableFile {
    const file = createReadStream(join(process.cwd(), 'package.json'));
    return new StreamableFile(file);
  }
}
