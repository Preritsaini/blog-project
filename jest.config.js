/** @type {import('jest').Config} */
const config = {
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.(ts|tsx)$': ['ts-jest', { tsconfig: { jsx: 'react-jsx' } }],
  },
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^next/image$': '<rootDir>/__mocks__/next/image.tsx',
    '^next/link$': '<rootDir>/__mocks__/next/link.tsx',
    '^server-only$': '<rootDir>/__mocks__/server-only.js',
    '\\.(css|scss|sass)$': '<rootDir>/__mocks__/styleMock.js',
    '\\.(jpg|jpeg|png|gif|svg|webp)$': '<rootDir>/__mocks__/fileMock.js',
  },
}

module.exports = config
