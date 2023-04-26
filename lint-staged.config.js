module.exports = {
  '*.{md,json}': (filenames) => `prettier --write ${filenames.join(' ')}`,
  '*.{ts,tsx,js,jsx}': (filenames) => {
    const files = filenames.join(' ');
    const commands = [
      `yarn import-sort --write ${files}`,
      `yarn eslint --cache ${files} --fix`,
    ];
    return commands;
  },
};
