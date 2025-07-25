module.exports = {
  babel: {
    presets: [],
    plugins: [],
  },
  jest: {
    configure: (jestConfig) => {
      jestConfig.transformIgnorePatterns = [
        "/node_modules/(?!date-fns|react-day-picker)/"
      ];
      return jestConfig;
    }
  }
};