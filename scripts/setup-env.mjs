// Generates src/environments/environment.ts from OPENWEATHER_API_KEY env var.
// - If OPENWEATHER_API_KEY is set: always generates (CI/deploy mode).
// - Otherwise: skips if the file already exists (local dev mode).
import { existsSync, writeFileSync } from 'node:fs';

const OUT = 'src/environments/environment.ts';
const apiKey = process.env.OPENWEATHER_API_KEY ?? '';
const isProd = process.env.NODE_ENV === 'production';

if (!apiKey && existsSync(OUT)) {
  console.log('environment.ts already exists, skipping generation.');
  process.exit(0);
}

if (!apiKey) {
  console.warn('Warning: OPENWEATHER_API_KEY is not set — generating empty environment.ts.');
}

writeFileSync(
  OUT,
  `export const environment = {
  production: ${isProd},
  openWeatherApiKey: '${apiKey}',
  openWeatherBaseUrl: 'https://api.openweathermap.org/data/2.5',
};
`,
);

console.log(`environment.ts generated (production: ${isProd}).`);
