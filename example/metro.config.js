const path = require('path');

module.exports = {
  projectRoot: __dirname,
  resolver: {
    extraNodeModules: new Proxy(
      {},
      {
        get: (target, name) =>
          Object.hasOwnProperty.call(target, name)
            ? target[name]
            : path.resolve(__dirname, 'node_modules', name),
      }
    ),
  },
  watchFolders: [path.resolve(__dirname, '../src')],
};
