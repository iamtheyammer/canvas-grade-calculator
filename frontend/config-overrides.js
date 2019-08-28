const { override, fixBabelImports } = require('customize-cra');

module.exports = (config, env) => {
  override(fixBabelImports('import', {
    libraryName: 'antd',
    libraryDirectory: 'es',
    style: 'css'
  }));
  return config;
};
