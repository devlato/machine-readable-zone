# MRZ Generator

This library helps to generate [MRZ codes](https://en.wikipedia.org/wiki/Machine-readable_passport). 
It's implemented with Node.js and TypeScript. It provides both CLI tool and programmatic API.


## Dependencies:

The project depends on the following technologies and libraries:
* `Node.js`;
* `TypeScript`;
* `jest` and `ts-jest`;
* `ts-node-dev`;
* `tslint` and `tslint-config-airbnb`.

As you see, there no dependencies but various dev tools.


## Installation

(These installation instructions would be valid after publishing, so the package name could change).

Let's consider you use [Yarn](https://yarnpkg.com/) as your package manager. If you use [npm](https://www.npmjs.com/), 
it would pretty easy for you to translate the commands using 
this [cheatsheet](https://github.com/areai51/yarn-cheatsheet).

To install it as a global binary, use the following command:

```sh
$ yarn global add mrz
```

To install it as your project dependency, run:

```sh
$ yarn add mrz
```


## Usage

If you have the package installed globally, you can use `mrz` as binary name. Otherwise keep in mind that 
you can use `./node_modules/mrz/dist/index.js` or `yarn start` (in development mode) instead of `mrz`.

```sh
$ mrz --help

  Syntax: mrz [options]
  Options:
  --first-name:          [*] First name
  --last-name:           [*] Last name
  --passport-number:     [*] Passport number (9 digits)
  --country-code:        [*] Country code (ISO 3166-1 alpha-3*)
  --nationality:         [*] Nationality (ISO 3166-1 alpha-3*)
  --gender:              [*] Sex/gender (M/F)
  --valid-until-date:    [*] Date of validity (dd.mm.yyyy)
  --personal-number:         Personal number (14 digits)
  
  --countries            Print all the supported countries with codes
  --version              Print package version
  --help                 Print this help message
```

Software needs your personal data to generate the code, so please provide it according to the expected formats.


## API

The library exports some methods:
* `generateMRZ` – the function that actually generates the code. It needs a valid data;
* `generateMRZFromCommandLineArgs` – the function that runs in a command line mode. 
  It parses and validates the data and generates the code;
* `validateData` – validates the given data according to the `schema` (`ValidationSchema` type). 
  If you want to use it, you need to pass a validation schema;
* `ParamsValidationSchema` – the schema that `generateMRZFromCommandLineArgs` uses internally. 
  It's a default one and you can pass it to `validateData`.

### Public interface

The library exposes the following typings:

```typescript
declare module 'mrz' {
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
```


## Building the project

It is recommend to manage Node versions with [NVM](https://github.com/creationix/nvm).

After cloning the project, run

```sh
$ yarn
``` 

to install the project dependencies. Project has only development dependencies: TypeScript, tslint, jest, etc.
As the command succeeded, type

```sh
$ yarn build
```

to build the project locally.
 

## Copyright

Author: Denis Tokarev ([@devlato](https://github.com/devlato))

License: MIT
