module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  testMatch: ["**/**/*.test.ts", "**/**/*.spec.ts"],
  moduleNameMapper: {
    "^nanoid$": "<rootDir>/src/__mocks__/nanoid.js",
  },
  forceExit: true,
  clearMocks: true,
  resetMocks: true,
  restoreMocks: true,
};
