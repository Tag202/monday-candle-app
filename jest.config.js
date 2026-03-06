module.exports = {
  projects: [
    {
      displayName: "server",

      preset: "ts-jest",
      testEnvironment: "node",

      testMatch: [
        "<rootDir>/tests/server/controller/**/*.test.ts",
        "<rootDir>/tests/server/service/**/*.test.ts"
      ],

      setupFiles: ["<rootDir>/tests/setup.ts"]
    },

    {
      displayName: "client",

      preset: "ts-jest",
      testEnvironment: "jsdom",

      testMatch: [
        "<rootDir>/tests/client/**/*.test.tsx"
      ],

      setupFilesAfterEnv: [
        "@testing-library/jest-dom"
      ],

      moduleNameMapper: {
        "\\.(css|scss)$": "identity-obj-proxy",
        "^react$": "<rootDir>/client/node_modules/react",
        "^react-dom$": "<rootDir>/client/node_modules/react-dom"
      }
    }
  ]
};