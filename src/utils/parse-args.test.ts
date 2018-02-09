import 'jest';
import { CommandLineArgs } from 'machine-readable-zone';
import parseArgs from './parse-args';

describe('src/utils/parse-args', () => {
  it('Should work with correct data', () => {
    expect.assertions(1);

    const args: CommandLineArgs = [
      '--first-name=Ivan',
      '--last-name=Petrov',
      '--passport-number=123456789',
      '--country-code=RUS',
      '--nationality=RUS',
      '--birthday=01.02.1983',
      '--gender=M',
      '--valid-until-day=02.03.2028',
      '--personal-number=12345678901234',
    ];

    const result = parseArgs(args);
    expect(result).toEqual({
      firstName: 'Ivan',
      lastName: 'Petrov',
      passportNumber: '123456789',
      countryCode: 'RUS',
      nationality: 'RUS',
      birthday: '01.02.1983',
      gender: 'M',
      validUntilDay: '02.03.2028',
      personalNumber: '12345678901234',
    });
  });

  it('Should handle single character args', () => {
    expect.assertions(1);

    const args: CommandLineArgs = [
      '-d=/usr/bin',
      '--file=/var/mrz.lock',
    ];

    const result = parseArgs(args);
    expect(result).toEqual({
      d: '/usr/bin',
      file: '/var/mrz.lock',
    });
  });

  it('Should handle key-value pairs without equality sign', () => {
    expect.assertions(1);

    const args: CommandLineArgs = [
      '--arg1=hello',
      '--arg2',
      'goodbye',
    ];

    const result = parseArgs(args);
    expect(result).toEqual({
      arg1: 'hello',
      arg2: 'goodbye',
    });
  });

  it('Should handle params without value', () => {
    expect.assertions(1);

    const args: CommandLineArgs = [
      '-xf',
      '--exec-dir=/tmp',
      '--force',
    ];

    const result = parseArgs(args);
    expect(result).toEqual({
      xf: true,
      execDir: '/tmp',
      force: true,
    });
  });

  it('Should handle mistyped params', () => {
    expect.assertions(1);

    const args: CommandLineArgs = [
      '--too---much--dashes',
      'yeah',
      '--and-----here-too-much-as-well=yes',
      '--and-this-one---too',
      '--trailing-dashes-too----',
    ];

    const result = parseArgs(args);
    expect(result).toEqual({
      tooMuchDashes: 'yeah',
      andHereTooMuchAsWell: 'yes',
      andThisOneToo: true,
      trailingDashesToo: true,
    });
  });
});
