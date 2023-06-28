import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';

import { AbstractTranslationEntity } from '../../common/abstract.entity';
import { UseDTO } from '../../decorators';
import { PostTranslationDTO } from './dto/post-translation.dto';
import { PostEntity } from './post.entity';

@Entity({ name: 'post_translations' })
@UseDTO(PostTranslationDTO)
export class PostTranslationEntity extends AbstractTranslationEntity<PostTranslationDTO> {
  @Column()
  title: string;

  @Column()
  description: string;

  @Column({ type: 'uuid' })
  postId: Uuid;

  @ManyToOne(() => PostEntity, (postEntity) => postEntity.translations, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'post_id' })
  post: PostEntity;
}
