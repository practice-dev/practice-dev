import { SchemaLike, SchemaMap, Path, ErrorDetails } from './types';
import { ObjectSchema } from './ObjectSchema';

export const isSchemaMap = (obj: SchemaLike): obj is SchemaMap => {
  return obj.constructor.name === 'Object';
};

export const schemaLikeToSchema = (obj: SchemaLike) => {
  if (isSchemaMap(obj)) {
    return new ObjectSchema().keys(obj);
  }
  return obj;
};

export const formatPath = (path: Path) => {
  let ret = path[0];
  for (let i = 1; i < path.length; i++) {
    if (typeof path[i] === 'string') {
      ret += '.' + path[i];
    } else {
      ret += `[${path[i]}]`;
    }
  }
  return ret;
};

export const formatErrors = (errors: ErrorDetails[]) => {
  return errors
    .map(error => {
      const path = formatPath(error.path);
      return `'${path}' ${error.message}.`;
    })
    .join(' ');
};
