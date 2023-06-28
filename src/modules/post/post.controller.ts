import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiCreatedResponse, ApiTags } from '@nestjs/swagger';

import { RoleType } from '../../constants';
import { Auth, AuthUser } from '../../decorators';
import { UserEntity } from '../user/user.entity';
import { CreatePostDTO, PostDTO } from './dto/post.dto';
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
}
