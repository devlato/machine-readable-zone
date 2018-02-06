import 'jest';
import {
  validateCountryCode,
  validateDate,
  validateGender,
  validateNonEmpty,
  validateNumeric,
  validatePersonalNumber,
  NO_ERROR,
} from './validate-args';

describe('src/utils/validate-args', () => {
  describe('validateNonEmpty', () => {
    it('Should work with correct data', () => {
      expect.assertions(1);

      const value = 'Not empty';

      const result = validateNonEmpty(value);
      expect(result).toEqual(NO_ERROR);
    });

    it('Should work with incorrect data', () => {
      expect.assertions(1);

      const value = '';

      const result = validateNonEmpty(value);
      expect(result).toEqual('value should non be empty');
    });
  });

  describe('validateCountryCode', () => {
    it('Should work with correct data', () => {
      expect.assertions(1);

      const value = 'RUS';

      const result = validateCountryCode(value);
      expect(result).toEqual(NO_ERROR);
    });

    it('Should work with incorrect data', () => {
      expect.assertions(1);

      const value = 'RU';

      const result = validateCountryCode(value);
      expect(result).toEqual('country RU not found. Did you mean RUS?');
    });
  });

  describe('validateGender', () => {
    it('Should work with correct data', () => {
      expect.assertions(1);

      const value = 'M';

      const result = validateGender(value);
      expect(result).toEqual(NO_ERROR);
    });

    it('Should work with incorrect data', () => {
      expect.assertions(1);

      // https://randomoverload.org/wp-content/uploads/2013/05/726cfunny-computer-options-gender.jpg
      const value = 'Female, But Curious What Being a Male is Like';

      const result = validateGender(value);
      expect(result).toEqual(
        'value Female, But Curious What Being a Male is Like should be a gender:' +
        ' M (male) or F (female)',
      );
    });
  });

  describe('validateDate', () => {
    it('Should work with correct data', () => {
      expect.assertions(1);

      const value = '01.06.1992';

      const result = validateDate(value);
      expect(result).toEqual(NO_ERROR);
    });

    it('Should work with incorrect data', () => {
      expect.assertions(1);

      // https://randomoverload.org/wp-content/uploads/2013/05/726cfunny-computer-options-gender.jpg
      const value = '44.14.05';

      const result = validateDate(value);
      expect(result).toEqual('value 44.14.05 should be an existing date in dd.mm.yyyy format');
    });
  });

  describe('validateNumeric', () => {
    it('Should work with correct data', () => {
      expect.assertions(1);

      const value = '10';

      const result = validateNumeric()(value);
      expect(result).toEqual(NO_ERROR);
    });

    it('Should work with constraints', () => {
      expect.assertions(1);

      const value = '10';

      const result = validateNumeric({
        minLength: 1,
        maxLength: 3,
        minValue: 5,
        maxValue: 12,
      })(value);
      expect(result).toEqual(NO_ERROR);
    });

    it('Should work with exactLength constraint', () => {
      expect.assertions(1);

      const value = '10';

      const result = validateNumeric({
        exactLength: 2,
        minValue: 5,
        maxValue: 12,
      })(value);
      expect(result).toEqual(NO_ERROR);
    });

    it('Should work with incorrect data', () => {
      expect.assertions(1);

      // https://randomoverload.org/wp-content/uploads/2013/05/726cfunny-computer-options-gender.jpg
      const value = 'Crap';

      const result = validateNumeric()(value);
      expect(result).toEqual('value should be numeric');
    });

    it('Should handle minLength violation', () => {
      expect.assertions(1);

      // https://randomoverload.org/wp-content/uploads/2013/05/726cfunny-computer-options-gender.jpg
      const value = '1';

      const result = validateNumeric({
        minLength: 2,
      })(value);
      expect(result).toEqual('value 1 should have more than 2 digits');
    });

    it('Should handle maxLength violation', () => {
      expect.assertions(1);

      // https://randomoverload.org/wp-content/uploads/2013/05/726cfunny-computer-options-gender.jpg
      const value = '300';

      const result = validateNumeric({
        maxLength: 2,
      })(value);
      expect(result).toEqual('value 300 should have less than 2 digits');
    });

    it('Should handle exactLength violation', () => {
      expect.assertions(1);

      // https://randomoverload.org/wp-content/uploads/2013/05/726cfunny-computer-options-gender.jpg
      const value = '9999';

      const result = validateNumeric({
        exactLength: 2,
      })(value);
      expect(result).toEqual('value 9999 should have exactly 2 digits');
    });

    it('Should handle minValue violation', () => {
      expect.assertions(1);

      // https://randomoverload.org/wp-content/uploads/2013/05/726cfunny-computer-options-gender.jpg
      const value = '9';

      const result = validateNumeric({
        minValue: 15,
      })(value);
      expect(result).toEqual('value 9 should be bigger than 15');
    });

    it('Should handle maxValue violation', () => {
      expect.assertions(1);

      // https://randomoverload.org/wp-content/uploads/2013/05/726cfunny-computer-options-gender.jpg
      const value = '11';

      const result = validateNumeric({
        maxValue: 7,
      })(value);
      expect(result).toEqual('value 11 should be smaller than 7');
    });
  });

  describe('validatePersonalNumber', () => {
    it('Should work with empty value', () => {
      expect.assertions(1);

      const value = null;

      const result = validatePersonalNumber(value);
      expect(result).toEqual(NO_ERROR);
    });

    it('Should work with proper number', () => {
      expect.assertions(1);

      const value = '12345678901234';

      const result = validatePersonalNumber(value);
      expect(result).toEqual(NO_ERROR);
    });

    it('Should work with filler', () => {
      expect.assertions(1);

      const value = '<<<<<<<<<<<<<<';

      const result = validatePersonalNumber(value);
      expect(result).toEqual(NO_ERROR);
    });

    it('Should work with incorrect data', () => {
      expect.assertions(1);

      const value = '123-4<5-!$*';

      const result = validatePersonalNumber(value);
      expect(result).toEqual(
        'value 123-4<5-!$* should be a number,' +
        ' a filler (<<<<<<<<<<<<<<) or an empty value',
      );
    });
  });
});
