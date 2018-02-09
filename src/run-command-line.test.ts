import 'jest';
import { CommandLineArgs } from 'machine-readable-zone';
import runCommandLine from './run-command-line';

interface MockFNState {
  calls: any[][];
}

interface MockFN {
  (...args: any[]): any;
  mock: MockFNState;
}

jest.mock('../data/countries.json', () => [{
  code: 'D',
  name: 'Germany',
}, {
  code: 'RUS',
  name: 'Russia',
}]);

const consoleLog = console.log;

describe('src/run-command-line', () => {
  beforeEach(() => {
    console.log = consoleLog;
  });

  it('Should work with correct data', () => {
    expect.assertions(2);

    console.log = jest.fn();

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
    runCommandLine(args);
    expect(console.log).toHaveBeenCalledTimes(1);
    expect(console.log).toHaveBeenCalledWith(
`P<RUSPETROV<<IVAN<<<<<<<<<<<<<<<<<<<<<<<<<<<
1234567897RUS8302010M28030211234567890123454`,
    );
  });

  it('Should print error if data is incorrect', () => {
    expect.assertions(2);

    const mockFn = jest.fn() as MockFN;
    console.log = mockFn;

    const args: CommandLineArgs = [
      '--first-name=Ivan',
      '--last-name=Petrov',
      '--passport-number=123',
      '--country-code=RUS',
      '--nationality=RUS',
      '--birthday=01.02.1983',
      '--gender=M',
      '--valid-until-day=02.03.2028',
      '--personal-number=12345678901234',
    ];
    runCommandLine(args);
    expect(console.log).toHaveBeenCalledTimes(2);
    expect(mockFn.mock.calls).toEqual([[`
  Field "passportNumber" has wrong format: value 123 should have exactly 9 digits`,
    ], [`
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
  --help                 Print this help message`,
    ]]);
  });

  it('Should show help', () => {
    expect.assertions(2);

    console.log = jest.fn();

    const args: CommandLineArgs = ['--help'];
    runCommandLine(args);
    expect(console.log).toHaveBeenCalledTimes(1);
    expect(console.log).toHaveBeenCalledWith(`
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
  --help                 Print this help message`,
    );
  });

  it('Should show version', () => {
    expect.assertions(2);

    console.log = jest.fn();

    const args: CommandLineArgs = ['--version'];
    runCommandLine(args);
    expect(console.log).toHaveBeenCalledTimes(1);
    expect(console.log).toHaveBeenCalledWith(
'  Machine-readable zone code generator.\n  Version: 0.1.0',
    );
  });

  it('Should show countries', () => {
    expect.assertions(2);

    console.log = jest.fn();

    const args: CommandLineArgs = ['--countries'];
    runCommandLine(args);
    expect(console.log).toHaveBeenCalledTimes(1);
    expect(console.log).toHaveBeenCalledWith(`    D    - Germany
  RUS    - Russia`,
    );
  });
});
