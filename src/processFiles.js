import { readFileSync, writeFileSync } from 'fs';
import * as prettier from '@cyph/prettier';
import { join } from 'path';

export default async (
  directory,
  files,
  { check, config, onExamineFile, onCheckFile, onWriteFile } = {},
) => {
  for (const relative of files) {
    onExamineFile && onExamineFile(relative);
    const file = join(directory, relative);
    const options = Object.assign(
      {},
      await prettier.resolveConfig(file, {
        config,
        editorconfig: true,
      }),
      { filepath: file },
    );
    const input = readFileSync(file, 'utf8');

    if (check) {
      const isFormatted = await prettier.check(input, options);
      onCheckFile && onCheckFile(relative, isFormatted);
      continue;
    }

    try {
      const output = await prettier.format(input, options);

      if (output !== input) {
        writeFileSync(file, output);
        onWriteFile && onWriteFile(relative);
      }
    }
    catch (err) {
      console.warn(err.message);
    }
  }
};
