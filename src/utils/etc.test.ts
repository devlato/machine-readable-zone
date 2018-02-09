import 'jest';
import { MRZGeneratorArgs } from 'machine-readable-zone';
import {
  validateGenerationData,
  SCHEMA,
} from './etc';
import { Validator } from './validate-args';

interface ValidationSchema {
  [key: string]: Validator;
}

describe('src/utils/etc', () => {
  describe('validateGenerationData', () => {
    it('Should validate valid data', () => {
      expect.assertions(1);

      const args: MRZGeneratorArgs = {
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
      };

      const result = validateGenerationData(args);
      expect(result).toEqual({
        errors: [],
        isValid: true,
      });
    });
  });

  it('Should validate invalid data', () => {
    expect.assertions(1);

    const args: MRZGeneratorArgs = {
      user: {
        firstName: '',
        lastName: 'Petrov',
        passportNumber: '123',
        countryCode: 'RUS',
        nationality: 'RU',
        birthday: '01/02/1983',
        gender: 'M',
        validUntilDay: '02.03.2028',
        personalNumber: '<<<',
      },
    };

    const result = validateGenerationData(args);
    expect(result).toEqual({
      errors: [{
        error: 'value should non be empty',
        fieldName: 'firstName',
      }, {
        error: 'value 123 should have exactly 9 digits',
        fieldName: 'passportNumber',
      }, {
        error: 'country RU not found. Did you mean RUS?',
        fieldName: 'nationality',
      }, {
        error: 'value 01/02/1983 should be an existing date in dd.mm.yyyy format',
        fieldName: 'birthday',
      }, {
        error: 'value <<< should be a number, a filler (<<<<<<<<<<<<<<) or an empty value',
        fieldName: 'personalNumber',
      }],
      isValid: false,
    });
  });

  describe('SCHEMA', () => {
    it('Should be an object', () => {
      expect.assertions(1);

      expect(typeof SCHEMA).toEqual('object');
    });

    it('Should be an Object<string, function>', () => {
      const keys = Object.keys(SCHEMA);

      expect.assertions(2 + keys.length);

      expect(SCHEMA).toBeInstanceOf(Object);
      expect(SCHEMA).toEqual(SCHEMA);

      keys.forEach(key =>
        expect(typeof (SCHEMA as ValidationSchema)[key])
          .toEqual('function'),
      );
    });
  });
});
