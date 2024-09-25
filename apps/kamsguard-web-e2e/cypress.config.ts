import { nxE2EPreset } from '@nx/cypress/plugins/cypress-preset';

import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    ...nxE2EPreset(__filename, {
      cypressDir: 'src',
      webServerCommands: {
        default: 'nx run kamsguard-web:serve:development',
        production: 'nx run kamsguard-web:serve:production',
      },
      ciWebServerCommand: 'nx run kamsguard-web:serve-static',
    }),
    baseUrl: 'https://kamsguard-web.vercel.app',
  },
});
