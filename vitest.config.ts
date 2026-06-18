import { defineConfig } from 'vitest/config';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./tests/setup.ts'],
    coverage: {
      provider: 'v8',
      include: [
        'src/game/LevelCurve.ts',
        'src/game/Hole.ts',
        'src/game/Decomposer/**/*.ts',
        'src/shared/settings/**/*.ts',
        'src/shared/utils/**/*.ts',
        'src/shared/messaging/types.ts',
      ],
      thresholds: {
        lines: 70,
        functions: 70,
        branches: 60,
        statements: 70,
      },
    },
  },
});
