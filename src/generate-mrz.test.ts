import 'jest';
import { UserInfo } from 'machine-readable-zone';
import generateMrz from './generate-mrz';

describe('src/generate-mrz', () => {
  it('Should work with correct data', () => {
    expect.assertions(1);

    const user: UserInfo = {
      firstName: 'Ivan',
      lastName: 'Petrov',
      passportNumber: '123456789',
      countryCode: 'RUS',
      nationality: 'RUS',
      birthday: '01.02.1983',
      gender: 'M',
      validUntilDay: '02.03.2028',
      personalNumber: '12345678901234',
    };
    const result = generateMrz({ user });
    expect(result).toEqual(
`P<RUSPETROV<<IVAN<<<<<<<<<<<<<<<<<<<<<<<<<<<
1234567897RUS8302010M28030211234567890123454`,
    );
  });

  it('Should work with filler', () => {
    expect.assertions(1);

    const user: UserInfo = {
      firstName: 'Ivan',
      lastName: 'Petrov',
      passportNumber: '123456789',
      countryCode: 'RUS',
      nationality: 'RUS',
      birthday: '01.02.1983',
      gender: 'M',
      validUntilDay: '02.03.2028',
      personalNumber: '<<<<<<<<<<<<<<',
    };
    const result = generateMrz({ user });
    expect(result).toEqual(
`P<RUSPETROV<<IVAN<<<<<<<<<<<<<<<<<<<<<<<<<<<
1234567897RUS8302010M2803021<<<<<<<<<<<<<<04`,
    );
  });

  it('Should work without personalNumber filler', () => {
    expect.assertions(1);

    const user: UserInfo = {
      firstName: 'Ivan',
      lastName: 'Petrov',
      passportNumber: '123456789',
      countryCode: 'RUS',
      nationality: 'RUS',
      birthday: '01.02.1983',
      gender: 'M',
      validUntilDay: '02.03.2028',
      personalNumber: '<<<<<<<<<<<<<<',
    };
    const result = generateMrz({ user });
    expect(result).toEqual(
`P<RUSPETROV<<IVAN<<<<<<<<<<<<<<<<<<<<<<<<<<<
1234567897RUS8302010M2803021<<<<<<<<<<<<<<04`);
  });
});
