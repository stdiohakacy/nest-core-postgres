import type { AbstractDTO } from 'common/dto/abstract.dto';

import type { AbstractEntity } from '../common/abstract.entity';
import type { Constructor } from '../types';

export function UseDTO(
  dtoClass: Constructor<AbstractDTO, [AbstractEntity, unknown]>,
): ClassDecorator {
  return (ctor) => {
    ctor.prototype.dtoClass = dtoClass;
  };
}
