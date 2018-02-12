#!/usr/bin/env node

import { CommandLineArgs } from 'machine-readable-zone';
import { default as generateMRZFromCommandLineArgs } from './run-command-line';

export { default as generateMRZFromCommandLineArgs } from './run-command-line';
export { default as generateMRZ } from './generate-mrz';
export {
  SCHEMA as ParamsValidationSchema,
  validateGenerationData as validateData,
} from './utils';

const main = (args: CommandLineArgs) => generateMRZFromCommandLineArgs(args);

if (typeof require !== 'undefined' && require.main === module) {
  main(process.argv.slice(2));
}
