import { ApiProperty } from '@nestjs/swagger';

import { PageMetaDTO } from './page-meta.dto';

export class PageDTO<T> {
  @ApiProperty({ isArray: true })
  readonly data: T[];

  @ApiProperty()
  readonly meta: PageMetaDTO;

  constructor(data: T[], meta: PageMetaDTO) {
    this.data = data;
    this.meta = meta;
  }
}
