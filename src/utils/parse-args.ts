import { CommandLineArgs } from 'mrz';
import {
  getStringOrDefault,
  OptionalString,
  OptionalBoolean,
} from './validate-args';

export interface IntermediateCommandLineArgs {
  [key: string]: OptionalString | OptionalBoolean;
}

const FULL_CMD_ARG_PREFIX = '--';
const SHORT_CMD_ARG_PREFIX = '-';
const KEY_VALUE_DELIMITER = '=';
const KEBAB_CASE_DELIMITER = '-';
const PREFIX_REPLACE_PATTERN = new RegExp(`^(${FULL_CMD_ARG_PREFIX}|${SHORT_CMD_ARG_PREFIX})`);
const EMPTY_PARAM: OptionalString = null;

const isNotALastArrayItem = (i: number, args: string[]) => i < args.length - 1;

const isFullParamName = (value: OptionalString) =>
  getStringOrDefault(value).startsWith(FULL_CMD_ARG_PREFIX);
const isShortParamName = (value: OptionalString) =>
  getStringOrDefault(value).startsWith(SHORT_CMD_ARG_PREFIX);

const isParamName = (value: string) => isFullParamName(value) || isShortParamName(value);

const isKeyValueParam = (value: string) => value.includes(KEY_VALUE_DELIMITER);

const extractKeyAndValueFromParam = (str: string) => {
  const parts = str.split(KEY_VALUE_DELIMITER);
  const key = parts[0];
  const value = parts[1] != null ? parts[1] : EMPTY_PARAM;
  return { key, value };
};

const removePrefixesFromParam = (value: string) => value.replace(PREFIX_REPLACE_PATTERN,'');

const convertKebabCaseToCamelCase = (value: string): string => {
  const result: string[] = [];

  for (let i = 0; i < value.length; i += 1) {
    const char = value[i];

    if (char === KEBAB_CASE_DELIMITER) {
      let j = i;
      while (value[j] === KEBAB_CASE_DELIMITER && j < value.length) {
        j += 1;
      }
      if (j < value.length) {
        const nextChar = value[j];
        if (nextChar != null) {
          result.push(nextChar.toUpperCase());
          i = j;
        }
      }
    } else {
      result.push(char);
    }
  }

  return result.join('');
};

const parseCommandLineArgs = (args: CommandLineArgs): IntermediateCommandLineArgs => {
  const results = {} as IntermediateCommandLineArgs;

  for (let i = 0; i < args.length; i += 1) {
    let arg = args[i];

    if (isParamName(arg)) {
      let nextArg: OptionalString = isNotALastArrayItem(i, args) ? args[i + 1] : EMPTY_PARAM;

      if (isKeyValueParam(arg)) {
        const parts = extractKeyAndValueFromParam(arg);
        arg = parts.key;
        nextArg = parts.value;
      }

      arg = convertKebabCaseToCamelCase(removePrefixesFromParam(arg));

      if (
        nextArg !== EMPTY_PARAM &&
        !isFullParamName(nextArg) &&
        !isShortParamName(nextArg)
      ) {
        results[arg] = nextArg;
      } else {
        results[arg] = true;
      }
    }
  }

  return results;
};

export default parseCommandLineArgs;
