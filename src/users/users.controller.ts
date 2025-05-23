import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  Post,
  Put,
  Query,
  Request,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiConsumes,
  ApiOperation,
  ApiQuery,
  ApiResponse,
} from '@nestjs/swagger';
import { Public } from '../auth/decorators/public.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PaginationDto } from '../common/dto/pagination.dto';
import { PaginatedResponse } from '../common/interfaces/pagination.interface';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';
import { FilesInterceptor } from '@nestjs/platform-express';

@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  private readonly logger = new Logger(UsersController.name);

  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiBearerAuth('accessToken')
  @ApiOperation({ summary: '새로운 사용자 생성' })
  @ApiResponse({
    status: 201,
    description: '사용자 생성 성공',
    type: User,
  })
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  @ApiBearerAuth('accessToken')
  @ApiOperation({ summary: '모든 사용자 목록 조회' })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: '페이지 번호',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: '페이지당 항목 수',
  })
  @ApiResponse({
    status: 200,
    description: '사용자 목록 조회 성공',
    type: [User],
  })
  findAll() {
    return this.usersService.findAll();
  }

  @Get('similar')
  @ApiBearerAuth('accessToken')
  @ApiOperation({
    summary: '유사한 암에 관심있는 사용자 목록 조회',
    description:
      '현재 로그인한 사용자와 같은 암을 가진 다른 사용자들의 목록을 조회합니다.',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: '페이지 번호',
    example: 1,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: '페이지당 항목 수',
    example: 10,
  })
  @ApiResponse({
    status: 200,
    description: '사용자 목록 조회 성공',
    type: [User],
  })
  async findSimilarUsers(
    @Request() req,
    @Query() paginationDto: PaginationDto,
  ): Promise<PaginatedResponse<User>> {
    return await this.usersService.findSimilarUsers(req.user.id, paginationDto);
  }

  @Get('check-username')
  @Public()
  @ApiOperation({ summary: '닉네임(유저네임) 중복 검사' })
  @ApiQuery({
    name: 'username',
    required: true,
    type: String,
    description: '중복 확인할 닉네임',
  })
  @ApiResponse({
    status: 200,
    description: '닉네임 사용 가능 여부',
    schema: { example: { available: true } },
  })
  async checkUsername(@Query('username') username: string) {
    const exists = await this.usersService.existsByUsername(username);
    return { available: !exists };
  }

  @Get(':id')
  @ApiBearerAuth('accessToken')
  @ApiOperation({ summary: '특정 사용자 조회' })
  @ApiResponse({
    status: 200,
    description: '사용자 조회 성공',
    type: User,
  })
  @ApiResponse({
    status: 404,
    description: '사용자를 찾을 수 없음',
  })
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  @Put(':id')
  @ApiBearerAuth('accessToken')
  @ApiOperation({ summary: '사용자 정보 수정' })
  @ApiResponse({
    status: 200,
    description: '사용자 정보 수정 성공',
    type: User,
  })
  @ApiResponse({
    status: 404,
    description: '사용자를 찾을 수 없음',
  })
  @UseInterceptors(FilesInterceptor('images'))
  @ApiConsumes('multipart/form-data')
  update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @UploadedFiles() images?: Express.Multer.File[],
  ) {
    return this.usersService.update(+id, updateUserDto, images);
  }

  @Delete(':id')
  @ApiOperation({ summary: '사용자 삭제' })
  @ApiResponse({
    status: 200,
    description: '사용자 삭제 성공',
  })
  @ApiResponse({
    status: 404,
    description: '사용자를 찾을 수 없음',
  })
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }

  @Get('cancer/:cancerId')
  @ApiBearerAuth('accessToken')
  @ApiOperation({ summary: '특정 암에 관심있는 사용자 목록 조회' })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: '페이지 번호',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: '페이지당 항목 수',
  })
  @ApiResponse({
    status: 200,
    description: '사용자 목록 조회 성공',
    type: [User],
  })
  findUsersByCancer(
    @Param('cancerId') cancerId: string,
    @Query() paginationDto: PaginationDto,
  ) {
    return this.usersService.findUsersByCancer(+cancerId, paginationDto);
  }
}
