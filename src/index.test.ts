import 'jest';
import {
  generateMRZ,
  generateMRZFromCommandLineArgs,
  validateData,
  ParamsValidationSchema,
} from './index';
import generateMrz from './generate-mrz';
import runCommandLine from './run-command-line';
import { validateGenerationData, SCHEMA } from './utils/etc';
import { Validator } from './utils/validate-args';

jest.mock('./run-command-line', () => ({
  default: jest.fn(),
}));

interface ValidationSchema {
  [key: string]: Validator;
}

describe('Public interface', () => {
  describe('ParamsValidationSchema', () => {
    it('Should be an Object<string, function>', () => {
      const keys = Object.keys(ParamsValidationSchema);

      expect.assertions(2 + keys.length);

      expect(ParamsValidationSchema).toBeInstanceOf(Object);
      expect(ParamsValidationSchema).toEqual(SCHEMA);

      keys.forEach(key =>
        expect(typeof (ParamsValidationSchema as ValidationSchema)[key])
          .toEqual('function'),
      );
    });
  });

  describe('generateMRZ()', () => {
    it('Should be a function', () => {
      expect.assertions(2);

      expect(typeof generateMRZ).toEqual('function');
      expect(generateMRZ).toEqual(generateMrz);
    });
  });

  describe('generateMRZFromCommandLineArgs()', () => {
    it('Should be a function', () => {
      expect.assertions(2);

      expect(typeof generateMRZFromCommandLineArgs).toEqual('function');
      expect(generateMRZFromCommandLineArgs).toEqual(runCommandLine);
    });
  });

  describe('validateData()', () => {
    it('Should be a function', () => {
      expect.assertions(2);

      expect(typeof validateData).toEqual('function');
      expect(validateData).toEqual(validateGenerationData);
    });
  });
});
