import { AnySchema } from './AnySchema';
import { Validator, ErrorDetails, Path } from './types';
import { ValidationError } from './ValidationError';
import { formatErrors } from './utils';
import { Convert } from './convert-types';

export const getValidateResult = (
  value: any,
  schema: AnySchema<any, any>,
  path: Path = []
) => {
  const validators: Validator[] = [...(schema as any).validators];
  validators.sort((a, b) => (a.priority || 0) - (b.priority || 0));
  const ret = {
    value: value,
    errors: [] as ErrorDetails[],
  };

  for (let i = 0; i < validators.length; i++) {
    const validator = validators[i];
    const fnRet = validator.validate(ret.value, path);
    if (!fnRet) {
      continue;
    }
    if (fnRet.error) {
      ret.errors.push(fnRet.error);
    }
    if (fnRet.errors) {
      ret.errors = ret.errors.concat(fnRet.errors);
    }
    if (fnRet.hasOwnProperty('value')) {
      ret.value = fnRet.value;
    }
    if (fnRet.stop) {
      break;
    }
  }
  return ret;
};

export const validate = <T extends AnySchema>(
  value: any,
  schema: T,
  rootName?: string
): Convert<T> => {
  const { value: newValue, errors } = getValidateResult(
    value,
    schema,
    rootName ? [rootName] : []
  );
  if (errors.length) {
    const error = new ValidationError(
      'Validation error: ' + formatErrors(errors),
      errors
    );
    throw error;
  }
  return newValue;
};
