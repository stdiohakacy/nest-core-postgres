import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Query,
} from '@nestjs/common';
import { ApiCreatedResponse, ApiTags } from '@nestjs/swagger';

import type { PageDTO } from '../../common/dto/page.dto';
import { RoleType } from '../../constants';
import { Auth, AuthUser } from '../../decorators';
import { ApiPageOkResponse } from '../../decorators/api-page-ok-response.decorator';
import { UseLanguageInterceptor } from '../../interceptors/language.interceptor';
import { UserEntity } from '../user/user.entity';
import { CreatePostDTO, PostDTO } from './dto/post.dto';
import { PostPageOptionDTO } from './dto/post-page-option.dto';
import { PostService } from './post.service';

@Controller('posts')
@ApiTags('posts')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post()
  @Auth([RoleType.USER])
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({ type: PostDTO })
  async createPost(
    @Body() createPostDto: CreatePostDTO,
    @AuthUser() user: UserEntity,
  ) {
    const post = await this.postService.createPost(user.id, createPostDto);

    return post.toDTO();
  }

  @Get()
  @Auth([RoleType.USER])
  @UseLanguageInterceptor()
  @ApiPageOkResponse({ type: PostDTO })
  async getPosts(@Query() query: PostPageOptionDTO): Promise<PageDTO<PostDTO>> {
    return this.postService.getAllPost(query);
  }
}
