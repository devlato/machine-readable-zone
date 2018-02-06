import { MRZGeneratorArgs } from 'mrz';
import { NEW_LINE, getDatePartsFromString, DateParts } from './utils';

const DOCUMENT_TYPE = 'P';
const NUMERIC_REGEXP = /[0-9]/g;
const NUMERIC_VALUE_BASE = 10;
const ALPHABET_REGEXP = /[a-z]/g;
const ALPHABET_START = 'a'.charCodeAt(0);
const ALPHABET_VALUE_START = 10;
const FILLER = '<';
const WEIGHTS = [7, 3, 1];

const MAX_LINE_LENGTH = 44;

const YEAR_LENGTH = 2;
const MONTH_LENGTH = 2;
const DAY_LENGTH = 2;

const calculateCheckDigit = (str: string) =>
  str
    .split('')
    .map((character: string, index: number) => {
      const char = character.toLowerCase();

      const weight = WEIGHTS[index % 3];
      let value = 0;

      if (char.match(ALPHABET_REGEXP) != null) {
        value = char.charCodeAt(0) - ALPHABET_START + ALPHABET_VALUE_START;
      }

      if (char.match(NUMERIC_REGEXP) != null) {
        value = parseInt(char, NUMERIC_VALUE_BASE);
      }

      if (char === FILLER) {
        value = 0;
      }

      return value * weight;
    })
    .reduce((acc, value) => acc + value, 0) % NUMERIC_VALUE_BASE;

const formatValue = (value: string, length: number, filler: string) =>
  `${filler.repeat(length - value.length)}${value}`;

const formatValueEnd = (value: string, length: number, filler: string) =>
  `${value}${filler.repeat(length - value.length)}`;

const formatNumber = (value: number, length: number) =>
  formatValue(value.toString(), length, '0');

const formatLineParts = (value: (string | number)[]) => value.join('');

const formatDate = (date: DateParts) => [
  formatNumber(date.year % 100, YEAR_LENGTH),
  formatNumber(date.month, MONTH_LENGTH),
  formatNumber(date.day, DAY_LENGTH),
].join('');

const getUserName = (name: string) =>
  name
    .toUpperCase()
    .replace(/\`/ig, '')
    .replace(/[^a-z]/ig, FILLER);

const getCountryCode = (code: String) => code.toUpperCase();
const getDocumentNumber = (passportNumber: String) =>
  passportNumber
    .replace(/(\s|\t)+/ig, '')
    .toUpperCase();

const getDate = (birthday: string) => formatDate(getDatePartsFromString(birthday));

const getGender = (gender: string) => gender.toUpperCase();

const generateMRZ = (args: MRZGeneratorArgs) => {
  const { user } = args;

  const firstName = getUserName(user.firstName);
  const lastName = getUserName(user.lastName);
  const country = getCountryCode(user.countryCode);
  const passportNumber = getDocumentNumber(user.passportNumber);

  const firstLineWithoutExtraFillers = formatLineParts([
    DOCUMENT_TYPE,
    FILLER,
    country,
    lastName,
    FILLER,
    FILLER,
    firstName,
  ]);
  const firstLine = formatValueEnd(firstLineWithoutExtraFillers, MAX_LINE_LENGTH, FILLER);

  const passportCheckNumber = calculateCheckDigit(passportNumber);
  const nationality = getCountryCode(user.nationality);
  const birthday = getDate(user.birthday);
  const birthdayCheckNumber = calculateCheckDigit(birthday);
  const gender = getGender(user.gender);
  const validUntilDay = getDate(user.validUntilDay);
  const validUntilDateCheckNumber = calculateCheckDigit(validUntilDay);
  const personalNumber = getDocumentNumber(user.personalNumber);
  const personalNumberCheckNumber = calculateCheckDigit(personalNumber);

  const controlCheckNumber = calculateCheckDigit(formatLineParts([
    passportNumber,
    passportCheckNumber,
    birthday,
    birthdayCheckNumber,
    validUntilDay,
    validUntilDateCheckNumber,
    personalNumber,
    personalNumberCheckNumber,
  ]));

  const secondLine = formatLineParts([
    passportNumber,
    passportCheckNumber,
    nationality,
    birthday,
    birthdayCheckNumber,
    gender,
    validUntilDay,
    validUntilDateCheckNumber,
    personalNumber,
    personalNumberCheckNumber,
    controlCheckNumber,
  ]);

  return formatLineParts([
    firstLine,
    NEW_LINE,
    secondLine,
  ]);
};

export default generateMRZ;
