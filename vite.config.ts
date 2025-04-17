import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    test: {
        env: {
            NODE_ENV: 'test',
        },
        environment: process.env.VITEST_ENV === 'node' || process.env.TEST_ENV === 'node' ? 'node' : 'jsdom',
        setupFiles: ['./src/server/test/setup.ts'],
        include: ['src/client/**/*.test.{ts,tsx}', 'src/server/test/**/*.spec.ts'],
    },
});
