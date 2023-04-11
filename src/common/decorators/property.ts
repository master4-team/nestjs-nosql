import { Prop, PropOptions } from '@nestjs/mongoose';
import { ApiProperty, ApiPropertyOptions } from '@nestjs/swagger';

type PropertyOptions = PropOptions & {
  apiProperty?: ApiPropertyOptions & { enable: boolean };
};

export function Property(options: PropertyOptions = {}) {
  return function (target, key) {
    const apiPropertyOptions = options?.apiProperty
      ? { ...options.apiProperty }
      : { enable: true };

    if (apiPropertyOptions.enable) {
      delete apiPropertyOptions.enable;
      ApiProperty(apiPropertyOptions)(target, key);
    }
    delete options.apiProperty;
    Prop(options)(target, key);
  };
}
