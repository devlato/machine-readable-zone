declare module 'mrz' {
  export interface UserInfo {
    firstName: string;
    lastName: string;
    passportNumber: string;
    countryCode: string;
    nationality: string;
    birthday: string;
    gender: string;
    validUntilDay: string;
    personalNumber: string;
  }

  export type CommandLineArgs = string[];

  export interface MRZGeneratorArgs {
    user: UserInfo;
  }

  export interface MRZCommandLineArgs extends MRZGeneratorArgs {
    version: boolean;
    help: boolean;
    countries: boolean;
  }

  export type MRZGenerationResult = string;

  type CommandLineArgsMRZGenerator = (args: CommandLineArgs) => void;
  type MRZGenerator = (args: MRZGeneratorArgs) => MRZGenerationResult;

  export const generateMRZFromCommandLineArgs: CommandLineArgsMRZGenerator;
  export const generateMRZ: MRZGenerator;
}
