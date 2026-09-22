module.exports = {
  preset: "ts-jest/presets/default-esm",

  testEnvironment: "node",

  extensionsToTreatAsEsm: [".ts"],

  testMatch: ["<rootDir>/tests/**/*.test.ts"],

  transform: {
    "^.+\\.tsx?$": [
      "ts-jest",
      {
        useESM: true,
        tsconfig: "tsconfig.json",
      },
    ],
  },

  moduleNameMapper: {
    "^(\\.{1,2}/.*)\\.js$": "$1",
  },

  clearMocks: true,

  verbose: true,
};
