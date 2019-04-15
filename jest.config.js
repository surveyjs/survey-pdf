module.exports = {
    "globals": {
        'ts-jest': {
            "tsConfig": 'tsconfig.test.json'
        }
    },
    "roots": [
        "tests"
    ],
    "setupFiles": ["jest-canvas-mock"], // Get rid off HTMLCanvasElement.prototype.getContext, and canvas errors. Now no need to mock in the test file explicitly.
    "transform": {
        "^.+\\.(ts|tsx)?$": "ts-jest"
    },
    "moduleNameMapper": {
        "\\.(scss|html)$": "<rootDir>/tests/empty-module.js"
    },
    "testRegex": "(/tests/.*|(\\.|/)(test|spec))\\.(ts|tsx)?$",
    "moduleFileExtensions": [
        "ts",
        "tsx",
        "js",
        "jsx",
        "json",
        "node"
    ],
}