/** @type {import('ts-jest').JestConfigWithTsJest} */
export default {
  preset: "ts-jest",
  testEnvironment: "node",
  testMatch: ["**/__tests__/**/*.test.ts"],
  moduleFileExtensions: ["ts", "js"],
  roots: ["<rootDir>/__tests__", "<rootDir>/src"],
  coverageDirectory: "./coverage",
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80
    }
  },
  collectCoverageFrom: ["src/**/*.ts", "!src/**/index.ts"],
  clearMocks: true,
  restoreMocks: true,
  resetMocks: true,
  setupFiles: ["<rootDir>/jest.setup.ts"]
}
