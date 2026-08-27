import { createRequire } from 'module';

const require = createRequire(import.meta.url);

export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {
      // Target modern browsers to reduce CSS size
      overrideBrowserslist: [
        'last 2 Chrome versions',
        'last 2 Firefox versions',
        'last 2 Safari versions',
        'last 2 Edge versions',
        'iOS >= 15.4',
        'ChromeAndroid >= 92',
      ],
    },
  },
};
