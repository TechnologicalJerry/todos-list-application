module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  testMatch: ["**/**/*.test.ts", "**/**/*.spec.ts"],
  forceExit: true,
  clearMocks: true,
  resetMocks: true,
  restoreMocks: true,
};
