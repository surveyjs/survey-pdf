process.env.TZ = 'GMT';

module.exports = {
  testEnvironment: "jsdom",
  setupFiles: ["<rootDir>/setupFile.js"],
  setupFilesAfterEnv: ["<rootDir>/beforeAllTests.js", "jest-expect-message"],
  reporters: [
    "default",
    ["jest-junit", {
      "suiteNameTemplate": "{filepath}",
      "outputDirectory": ".",
      "outputName": "junit.xml"
    }]
  ],
  collectCoverage: true,
  coverageReporters: ["json", "lcov", "text", "html", "text-summary", "cobertura"],
  roots: ["tests"],
  transform: {
    "^.+\\.(js|ts|tsx)?$": ["ts-jest", {
      diagnostics: false,
      tsconfig: "tsconfig.test.json"
    }]
  },
  moduleNameMapper: {
    "\\.(scss|html)$": "<rootDir>/tests/empty-module.js",
    '^jspdf$': '<rootDir>/node_modules/jspdf/dist/jspdf.node.js',
  },
  testRegex: "(/tests/.*\\.(test))\\.ts$",
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"]
};
