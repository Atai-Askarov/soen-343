module.exports = {
  transform: {
    "^.+\\.(js|jsx|ts|tsx)$": "babel-jest", // Process JavaScript and JSX files with Babel
  },
  moduleNameMapper: {
    "\\.(svg)$": "<rootDir>/__mocks__/fileMock.js", // Mock SVG files
  },
};
