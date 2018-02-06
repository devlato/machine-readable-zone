import { CommandLineArgs, MRZCommandLineArgs, MRZGeneratorArgs } from 'mrz';
import parseArgs from './utils/parse-args';
import { default as generateMRZ } from './generate-mrz';
import {
  extractSupportedCommandLineArgs,
  validateGenerationData,
  SchemaValidationResult,
  Country,
  NEW_LINE,
} from './utils';

const countries = require('../data/countries.json') as Country[];
const packageJSON = require('../package.json');

const MAX_COUNTRY_CODE_LENGTH = 3;
const SPACES = '  ';
const NEW_LINE_SPACED = `${NEW_LINE}${SPACES}`;

enum ConsoleCommandType {
  SHOW_HELP,
  SHOW_VERSION,
  SHOW_COUNTRIES,
  GENERATE,
}

interface CommandParams {
  errors?: SchemaValidationResult;
  args?: MRZGeneratorArgs;
}

interface CommandType {
  commandType: ConsoleCommandType;
  params: CommandParams;
}

const getApplicationArgs = (args: CommandLineArgs): MRZCommandLineArgs =>
  extractSupportedCommandLineArgs(parseArgs(args));

const getMRZGeneratorArgsFromCommandLineArgs =
  (args: MRZCommandLineArgs): MRZGeneratorArgs => ({
    user: args.user,
  });

const getCommandTypeFromCommandLineArgs = (args: MRZCommandLineArgs): CommandType => {
  if (args.help) {
    return {
      commandType: ConsoleCommandType.SHOW_HELP,
      params: {},
    };
  }

  if (args.version) {
    return {
      commandType: ConsoleCommandType.SHOW_VERSION,
      params: {},
    };
  }

  if (args.countries) {
    return {
      commandType: ConsoleCommandType.SHOW_COUNTRIES,
      params: {},
    };
  }

  const generatorArgs = getMRZGeneratorArgsFromCommandLineArgs(args);
  const { isValid, errors } = validateGenerationData(generatorArgs);
  if (!isValid) {
    return {
      commandType: ConsoleCommandType.SHOW_HELP,
      params: { errors },
    };
  }

  return {
    commandType: ConsoleCommandType.GENERATE,
    params: {
      args: generatorArgs,
    },
  };
};

const errorsToString = (errors: SchemaValidationResult = []): string =>
  errors
    .map(({ error, fieldName }) => `Field "${fieldName}" has wrong format: ${error}`)
    .join(NEW_LINE_SPACED);

const helpToString = () => [
  `Syntax: ${packageJSON.name} [options]`,
  'Options:',
  '--first-name:          [*] First name',
  '--last-name:           [*] Last name',
  '--passport-number:     [*] Passport number (9 digits)',
  '--country-code:        [*] Country code (ISO 3166-1 alpha-3*)',
  '--nationality:         [*] Nationality (ISO 3166-1 alpha-3*)',
  '--gender:              [*] Sex/gender (M/F)',
  '--valid-until-date:    [*] Date of validity (dd.mm.yyyy)',
  '--personal-number:         Personal number (14 digits)',
  '',
  '--countries            Print all the supported countries with codes',
  '--version              Print package version',
  '--help                 Print this help message',
].join(NEW_LINE_SPACED);

const printHelp = (errors: SchemaValidationResult = []) => {
  const errorsPrinted = errorsToString(errors);

  if (errorsPrinted !== '') {
    console.log(`${NEW_LINE_SPACED}${errorsPrinted}`);
  }

  console.log(`${NEW_LINE_SPACED}${helpToString()}`);
};

const printVersion = () => console.log(
  `${SPACES}MRZ generator.${NEW_LINE_SPACED}Version: ${packageJSON.version}`);

const printCountries = () => console.log(
  countries.map(c => `${SPACES}${
    ' '.repeat(MAX_COUNTRY_CODE_LENGTH - c.code.length)
  }${c.code}    - ${c.name}`)
  .join(NEW_LINE));

const generateMRZFromCommandLineArgs = (args: CommandLineArgs) => {
  const parsedArgs = getApplicationArgs(args);
  const { commandType, params } = getCommandTypeFromCommandLineArgs(parsedArgs);

  switch (commandType) {
    case ConsoleCommandType.GENERATE:
      console.log(generateMRZ(params.args as MRZGeneratorArgs));
      return;

    case ConsoleCommandType.SHOW_VERSION:
      printVersion();
      return;

    case ConsoleCommandType.SHOW_COUNTRIES:
      printCountries();
      return;

    case ConsoleCommandType.SHOW_HELP:
    default:
      printHelp(params.errors);
      return;
  }
};

export default generateMRZFromCommandLineArgs;
