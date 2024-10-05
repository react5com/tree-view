// /* eslint-disable */

// const { pathsToModuleNameMapper } = require("ts-jest");
// const { compilerOptions } = require("./tsconfig");

// /** @type {import('ts-jest').JestConfigWithTsJest} */
// module.exports = {
//   preset: "ts-jest",
//   testEnvironment: "jsdom",
//   modulePaths: [compilerOptions.baseUrl],
//   moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths ?? {}),
//   transform: {
//     ".+\\.(css|less|sass|scss|png|jpg|gif|ttf|woff|woff2|svg)$":
//       "jest-transform-stub",
//   },
// };

/** @type {import('ts-jest').JestConfigWithTsJest} **/
export default {
  testEnvironment: "node",
  transform: {
    ".+\\.(css|less|sass|scss|png|jpg|gif|ttf|woff|woff2|svg)$":
       "jest-transform-stub",
    "^.+.tsx?$": ["ts-jest",{}],
  },
};