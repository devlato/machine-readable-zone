# Machine-readable zone code generator

This library helps to generate [Machine-readable zone codes](https://en.wikipedia.org/wiki/Machine-readable_passport). 
It's implemented with Node.js and TypeScript. It provides both CLI tool and programmatic API.

[![Build Status](https://travis-ci.org/devlato/machine-readable-zone.svg?branch=master)](https://travis-ci.org/devlato/machine-readable-zone)
[![Coverage Status](https://coveralls.io/repos/github/devlato/machine-readable-zone/badge.svg?branch=master)](https://coveralls.io/github/devlato/machine-readable-zone?branch=master)
[![Code Climate](https://codeclimate.com/github/devlato/machine-readable-zone/badges/gpa.svg)](https://codeclimate.com/github/devlato/machine-readable-zone)
[![Issue Count](https://codeclimate.com/github/devlato/machine-readable-zone/badges/issue_count.svg)](https://codeclimate.com/github/devlato/machine-readable-zone)
[![npm version](https://badge.fury.io/js/machine-readable-zone.svg)](https://badge.fury.io/js/machine-readable-zone)


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
$ yarn global add machine-readable-zone
```

To install it as your project dependency, run:

```sh
$ yarn add machine-readable-zone
```


## Usage

If you have the package installed globally, you can use `machine-readable-zone` as binary name. Otherwise keep 
in mind that you can use `./node_modules/machine-readable-zone/dist/index.js` or `yarn start` (in development mode) 
instead of `machine-readable-zone`.

```sh
$ machine-readable-zone --help

  Syntax: machine-readable-zone [options]
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
  
### Basic programmatic example

You could use `generateMRZ` function to generate a machine-readable zone code. 
Please note that this function takes args that have to be already validated.

```typescript
import { generateMRZ } from 'machine-readable-zone';

const code = generateMRZ({
  user: {
    firstName: 'Ivan',
    lastName: 'Petrov',
    passportNumber: '123456789',
    countryCode: 'RUS',
    nationality: 'RUS',
    birthday: '01.02.1983',
    gender: 'M',
    validUntilDay: '02.03.2028',
    personalNumber: '12345678901234',
  },
});

// Prints P<RUSPETROV<<IVAN<<<<<<<<<<<<<<<<<<<<<<<<<<<\n1234567897RUS8302010M28030211234567890123454
console.log(code);
```

### Using validation shipped with library

A basic validation function is included in library as well. If you're feeling lazy ot just satisfied with
library validation results, feel free to use it.

```typescript
import { validateData } from 'machine-readable-zone';

const validationResult = validateData({
  user: {
    firstName: '',
    lastName: '',
    passportNumber: '123456789',
    countryCode: 'RUS',
    nationality: 'RU',
    birthday: '01/02/1983',
    gender: 'M',
    validUntilDay: '02.03.2028',
    personalNumber: '12345678901234',
  },
});

/* 
 * Prints: 
 * { 
 *   isValid: false,
 *   errors: [
 *     { fieldName: 'firstName', error: 'value should non be empty' },
 *     { fieldName: 'lastName', error: 'value should non be empty' },
 *     { fieldName: 'nationality', error: 'country RU not found. Did you mean RUS?' },
 *     { fieldName: 'birthday', error: 'value 01/02/1983 should be an existing date in dd.mm.yyyy format' },
 *   ],
 * }
 */
console.log(validationResult);
```

### Public interface

The library exposes the following typings:

```typescript
declare module 'machine-readable-zone' {
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
