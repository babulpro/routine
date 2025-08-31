// jest.config.js
import nextJest from 'next/jest.js';

const createJestConfig = nextJest({
  dir: './', // Path to your Next.js app
});

/** @type {import('jest').Config} */
const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jsdom',
};

export default createJestConfig(customJestConfig);
