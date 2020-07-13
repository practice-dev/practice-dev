import { ErrorDetails } from './types';

export class ValidationError extends Error {
  constructor(message: string, public errors: ErrorDetails[]) {
    super(message);
  }
}
