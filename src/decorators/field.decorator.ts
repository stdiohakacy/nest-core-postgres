import { applyDecorators } from '@nestjs/common';
import type { ApiPropertyOptions } from '@nestjs/swagger';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsBoolean,
  IsEnum,
  IsString,
  MaxLength,
  MinLength,
  NotEquals,
  ValidateNested,
} from 'class-validator';

import { supportedLanguageCount } from '../constants';
import { ApiEnumProperty } from './property.decorator';
import {
  ToArray,
  ToBoolean,
  ToLowerCase,
  ToUpperCase,
} from './transform.decorators';
import { IsNullable, IsUndefinable } from './validator.decorator';

type RequireField<T, K extends keyof T> = T & Required<Pick<T, K>>;
interface IFieldOptions {
  each?: boolean;
  swagger?: boolean;
  nullable?: boolean;
  groups?: string[];
}

interface IStringFieldOptions extends IFieldOptions {
  minLength?: number;
  maxLength?: number;
  toLowerCase?: boolean;
  toUpperCase?: boolean;
}

// type IClassFieldOptions = IFieldOptions;
type IBooleanFieldOptions = IFieldOptions;
type IEnumFieldOptions = IFieldOptions;

export function BooleanField(
  options: Omit<ApiPropertyOptions, 'type'> & IBooleanFieldOptions = {},
): PropertyDecorator {
  const decorators = [ToBoolean(), IsBoolean()];

  if (options.nullable) {
    decorators.push(IsNullable());
  } else {
    decorators.push(NotEquals(null));
  }

  if (options.swagger !== false) {
    decorators.push(ApiProperty({ type: Boolean, ...options }));
  }

  return applyDecorators(...decorators);
}

export function BooleanFieldOptional(
  options: Omit<ApiPropertyOptions, 'type' | 'required'> &
    IBooleanFieldOptions = {},
): PropertyDecorator {
  return applyDecorators(
    IsUndefinable(),
    BooleanField({ required: false, ...options }),
  );
}

export function TranslationsField(
  options: RequireField<Omit<ApiPropertyOptions, 'isArray'>, 'type'> &
    IFieldOptions,
): PropertyDecorator {
  const decorators = [
    ArrayMinSize(supportedLanguageCount),
    ArrayMaxSize(supportedLanguageCount),
    ValidateNested({
      each: true,
    }),
    Type(() => options.type as FunctionConstructor),
  ];

  if (options.nullable) {
    decorators.push(IsNullable());
  } else {
    decorators.push(NotEquals(null));
  }

  if (options.swagger !== false) {
    decorators.push(ApiProperty({ isArray: true, ...options }));
  }

  return applyDecorators(...decorators);
}

// eslint-disable-next-line @typescript-eslint/ban-types
export function EnumField<TEnum extends object>(
  getEnum: () => TEnum,
  options: Omit<ApiPropertyOptions, 'type' | 'enum' | 'enumName' | 'isArray'> &
    IEnumFieldOptions = {},
): PropertyDecorator {
  const enumValue = getEnum();
  const decorators = [IsEnum(enumValue, { each: options.each })];

  if (options.nullable) {
    decorators.push(IsNullable());
  } else {
    decorators.push(NotEquals(null));
  }

  if (options.each) {
    decorators.push(ToArray());
  }

  if (options.swagger !== false) {
    decorators.push(
      ApiEnumProperty(getEnum, { ...options, isArray: options.each }),
    );
  }

  return applyDecorators(...decorators);
}

export function StringField(
  options: Omit<ApiPropertyOptions, 'type'> & IStringFieldOptions = {},
): PropertyDecorator {
  const decorators = [Type(() => String), IsString({ each: options.each })];

  if (options.nullable) {
    decorators.push(IsNullable({ each: options.each }));
  } else {
    decorators.push(NotEquals(null, { each: options.each }));
  }

  if (options.swagger !== false) {
    decorators.push(
      ApiProperty({ type: String, ...options, isArray: options.each }),
    );
  }

  const minLength = options.minLength || 1;

  decorators.push(MinLength(minLength, { each: options.each }));

  if (options.maxLength) {
    decorators.push(MaxLength(options.maxLength, { each: options.each }));
  }

  if (options.toLowerCase) {
    decorators.push(ToLowerCase());
  }

  if (options.toUpperCase) {
    decorators.push(ToUpperCase());
  }

  return applyDecorators(...decorators);
}
