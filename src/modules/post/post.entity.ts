import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';

import { AbstractEntity } from '../../common/abstract.entity';
import { UseDTO } from '../../decorators';
import { UserEntity } from '../user/user.entity';
import { PostDTO } from './dto/post.dto';
import { PostTranslationEntity } from './post-translation.entity';

@Entity({ name: 'posts' })
@UseDTO(PostDTO)
export class PostEntity extends AbstractEntity<PostDTO> {
  @Column({ type: 'uuid' })
  userId: Uuid;

  @ManyToOne(() => UserEntity, (userEntity) => userEntity.posts, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @OneToMany(
    () => PostTranslationEntity,
    (postTranslationEntity) => postTranslationEntity.post,
  )
  translations: PostTranslationEntity[];
}
