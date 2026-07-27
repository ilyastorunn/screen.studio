# screen.studio

An open-source, community-curated collection of app design.

Suggest an app through [GitHub Issues](https://github.com/ilyastorunn/screen.studio/issues/new?template=app-request.yml) or read the [contribution guide](CONTRIBUTING.md).

## Local development

```bash
npm install
npm run dev
```

Build with `npm run build`. For Cloudflare Pages use `npm run build` as the build command and `dist` as the output directory. The production site is [screen-studio.devanta.net](https://screen-studio.devanta.net).

## Content model

The starter catalog lives in `src/main.tsx` as a typed `App[]`. Production content is stored in Cloudflare D1, while screenshot assets are stored in Cloudflare R2. The admin dashboard uses the Cloudflare Worker API, and community submissions are managed through GitHub Issues and pull requests.
# screen.studio
