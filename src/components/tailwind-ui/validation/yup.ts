import { object, date, string, number, ObjectShape } from 'yup';

const requiredMessage = 'This field is required.';

export function requiredString(message?: string) {
  return string()
    .typeError(message || requiredMessage)
    .required(message || requiredMessage);
}

export function requiredNumber(message?: string) {
  return number()
    .typeError(message || 'This field is required and must be a number.')
    .required(message || requiredMessage);
}

export function requiredObject<T extends ObjectShape>(
  spec?: T,
  message?: string,
) {
  return object(spec).required(message || requiredMessage);
}

export function requiredDate(message?: string) {
  return date().required(message || requiredMessage);
}

export function optionalString() {
  return string().nullable();
}

export function optionalNumber() {
  return number().nullable();
}

export function optionalObject<T extends ObjectShape>(spec: T) {
  return object(spec).nullable();
}

export function optionalDate() {
  return date().nullable();
}
