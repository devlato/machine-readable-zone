declare module 'machine-readable-zone' {
  /* tslint:disable variable-name */

  export interface UserInfo {
    firstName: string;
    lastName: string;
    passportNumber: string;
    countryCode: string;
    nationality: string;
    birthday: string;
    gender: string;
    validUntilDay: string;
    personalNumber: string;
  }

  export type CommandLineArgs = string[];

  export interface MRZGeneratorArgs {
    user: UserInfo;
  }

  export interface MRZCommandLineArgs extends MRZGeneratorArgs {
    version: boolean;
    help: boolean;
    countries: boolean;
  }

  export type MRZGenerationResult = string;

  type CommandLineArgsMRZGenerator = (args: CommandLineArgs) => void;
  type MRZGenerator = (args: MRZGeneratorArgs) => MRZGenerationResult;

  interface FieldError {
    fieldName: string;
    error: string;
  }

  interface ArgsValidationResult {
    isValid: boolean;
    errors: FieldError[];
  }

  type SchemaValidator = (args: MRZGeneratorArgs) => ArgsValidationResult;

  type OptionalString = string | null;

  type FieldValidationResult = OptionalString;

  type Validator = (value: any) => FieldValidationResult;

  interface ValidationSchema {
    firstName: Validator;
    lastName: Validator;
    passportNumber: Validator;
    countryCode: Validator;
    nationality: Validator;
    birthday: Validator;
    gender: Validator;
    validUntilDay: Validator;
    personalNumber: Validator;
  }

  export const generateMRZFromCommandLineArgs: CommandLineArgsMRZGenerator;
  export const generateMRZ: MRZGenerator;
  export const validateData: SchemaValidator;
  export const ParamsValidationSchema: ValidationSchema;
}
