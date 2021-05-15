import { getFileInfo } from '@cyph/prettier';

export default (resolveConfig) => (file) =>
  Boolean(getFileInfo.sync(file, { resolveConfig }).inferredParser);
