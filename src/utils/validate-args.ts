const countries = require('../../data/countries.json') as Country[];

export type OptionalString = string | null;
export type OptionalBoolean = boolean | null;
export type OptionalNumber = number | null;
export type OptionalDate = Date | null;

export interface FieldError {
  fieldName: string;
  error: string;
}

type FieldValidationResult = OptionalString;

export type Validator = (value: any) => FieldValidationResult;

export interface ValidationSchema {
  [key: string]: Validator;
}

interface ValidationData {
  [key: string]: any;
}

export interface DateParts {
  day: number;
  month: number;
  year: number;
}

export type SchemaValidationResult = FieldError[];

export const NO_ERROR = null;
const DEFAULT_ERROR = 'Unknown error';
export const DATE_DELIMITER = '.';
const DATE_PATTERN = new RegExp(
  `^[0-9]{1,2}\\${DATE_DELIMITER}[0-9]{1,2}\\${DATE_DELIMITER}[0-9]{1,4}$`,
  'ig',
);
const ALLOWED_GENDERS = ['M', 'F'];
const PERSONAL_NUMBER_LENGTH = 14;
const PERSONAL_NUMBER_CONSTRAINS: NumericStringConstraints = {
  exactLength: PERSONAL_NUMBER_LENGTH,
};
const FILLER = '<';
export const DEFAULT_PERSONAL_NUMBER = FILLER.repeat(PERSONAL_NUMBER_LENGTH);

export const isArray = (value: any) => Array.isArray(value);
export const isString = (value: any) => typeof value === 'string';
export const isBoolean = (value: any) => typeof value === 'boolean';
export const isNumeric = (value: any) => {
  if (isString(value) && value.match(/[^0-9]/g) != null) {
    return false;
  }

  try {
    const parsed = parseFloat(value);
    return !isNaN(parsed);
  } catch (e) {
    return false;
  }
};

export const getStringOrDefault = (value: any, defaultValue: string = '') =>
  isString(value) && (value != null) ? value : defaultValue;

export const getBooleanOrDefault = (value: any, defaultValue: boolean = false) =>
  isBoolean(value) && (value != null) ? value : defaultValue;

const getNumberOrDefault = (value: any, defaultValue: number = 0) =>
  isNumeric(value) ? parseFloat(value) : defaultValue;

const isDateString = (value: any) => isString(value) && value.match(DATE_PATTERN);
const isDateInstance = (value: any) => value instanceof Date;

export const getDatePartsFromString = (value: string): DateParts => {
  const [d, m, y] = value.split(DATE_DELIMITER);

  const day = getNumberOrDefault(d, 0);
  const month = getNumberOrDefault(m, -1);
  const year = getNumberOrDefault(y, 0);

  return { day, month, year };
};

const getDateFromString = (value: string): OptionalDate => {
  const { day, month, year } = getDatePartsFromString(value);
  const date = new Date(Date.UTC(year, month - 1, day));

  if (
    date == null ||
    date.getDate() !== day ||
    date.getMonth() !== month - 1 ||
    date.getFullYear() !== year
  ) {
    return null;
  }

  return date;
};

const getDateOrDefault = (value: any, defaultValue: OptionalDate = null): OptionalDate => {
  if (isDateString(value)) {
    const date = getDateFromString(value);
    if (isDateInstance(date)) {
      return date;
    }
  }

  return defaultValue;
};

const isError = (error: FieldValidationResult): boolean => error !== NO_ERROR;

export const validateNonEmpty = (value: OptionalString): FieldValidationResult => {
  const str = getStringOrDefault(value);

  if (str.trim().length === 0) {
    return 'value should non be empty';
  }

  return NO_ERROR;
};

interface NumericStringConstraints {
  exactLength?: OptionalNumber;
  maxLength?: OptionalNumber;
  minLength?: OptionalNumber;
  maxValue?: OptionalNumber;
  minValue?: OptionalNumber;
}

export const validateNumeric = (constraints: NumericStringConstraints = {}) =>
  (value: OptionalString): FieldValidationResult => {
    const error = validateNonEmpty(value);

    if (error !== NO_ERROR) {
      return error;
    }

    const { exactLength, minLength, maxLength, minValue, maxValue } = constraints;

    if (!isNumeric(value)) {
      return 'value should be numeric';
    }

    const str = getStringOrDefault(value);
    if (exactLength != null && str.length !== exactLength) {
      return `value ${str} should have exactly ${exactLength} digits`;
    }

    if (minLength != null && str.length < minLength) {
      return `value ${str} should have more than ${minLength} digits`;
    }

    if (maxLength != null && str.length > maxLength) {
      return `value ${str} should have less than ${maxLength} digits`;
    }

    const number = getNumberOrDefault(str);
    if (minValue != null && number < minValue) {
      return `value ${str} should be bigger than ${minValue}`;
    }

    if (maxValue != null && number > maxValue) {
      return `value ${str} should be smaller than ${maxValue}`;
    }

    return NO_ERROR;
  };

export interface Country {
  code: string;
  name: string;
}

export const validateCountryCode = (value: OptionalString): FieldValidationResult => {
  const error = validateNonEmpty(value);

  if (error !== NO_ERROR) {
    return error;
  }

  const code = getStringOrDefault(value).toUpperCase();
  const country = countries.find(c => c.code === code);

  if (country == null) {
    const similarCountries = countries
      .filter(c => c.code.startsWith(code))
      .map(c => c.code);
    return `country ${code} not found.${
      similarCountries.length > 0 
        ? ` Did you mean ${similarCountries.join(', ')}?` 
        : ''
    }`;
  }

  return NO_ERROR;
};

export const validateDate = (value: OptionalString): FieldValidationResult => {
  const error = validateNonEmpty(value);

  if (error !== NO_ERROR) {
    return error;
  }

  const birthday = getDateOrDefault(value);
  if (birthday == null) {
    return `value ${value} should be an existing date in dd.mm.yyyy format`;
  }

  return NO_ERROR;
};

export const validateGender = (value: OptionalString): FieldValidationResult => {
  const error = validateNonEmpty(value);

  if (error !== NO_ERROR) {
    return error;
  }

  const gender = getStringOrDefault(value);
  if (!ALLOWED_GENDERS.includes(gender.toUpperCase())) {
    return `value ${value} should be a gender: M (male) or F (female)`;
  }

  return NO_ERROR;
};

export const validatePersonalNumber = (value: OptionalString): FieldValidationResult => {
  if (isNumeric(value)) {
    const error = validateNumeric(PERSONAL_NUMBER_CONSTRAINS)(value);

    if (error !== NO_ERROR) {
      return error;
    }

    return NO_ERROR;
  }

  if (getStringOrDefault(value, DEFAULT_PERSONAL_NUMBER) === DEFAULT_PERSONAL_NUMBER) {
    return NO_ERROR;
  }

  return `value ${value} should be a number, a filler (${
    DEFAULT_PERSONAL_NUMBER
  }) or an empty value`;
};

export const validateFields = (
  data: ValidationData,
  schema: ValidationSchema,
): SchemaValidationResult =>
  Object.keys(schema).reduce(
    (errors, fieldName) => {
      const validator = schema[fieldName];
      const error = validator(data[fieldName]);

      if (isError(error)) {
        errors.push({
          fieldName,
          error: getStringOrDefault(error, DEFAULT_ERROR),
        });
      }

      return errors;
    },
    [] as SchemaValidationResult);
