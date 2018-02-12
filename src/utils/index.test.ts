import * as utils from './index';
import * as etc from './etc';
import * as validateArgs from './validate-args';

describe('src/utils/index', () => {
  it('Should export all the necessary utils', () => {
    expect.assertions(7);

    expect(utils.NEW_LINE).toEqual(etc.NEW_LINE);
    expect(utils.SCHEMA).toEqual(etc.SCHEMA);
    expect(utils.extractSupportedCommandLineArgs).toEqual(etc.extractSupportedCommandLineArgs);
    expect(utils.validateGenerationData).toEqual(etc.validateGenerationData);
    expect(utils.areObjectsEqualDeeply).toEqual(etc.areObjectsEqualDeeply);

    expect(utils.DATE_DELIMITER).toEqual(validateArgs.DATE_DELIMITER);
    expect(utils.getDatePartsFromString).toEqual(validateArgs.getDatePartsFromString);
  });
});
