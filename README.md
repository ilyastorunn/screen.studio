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

The starter catalog lives in `src/main.tsx` as a typed `App[]`. The next backend phase can move this model to Supabase while keeping screenshot assets in Cloudflare R2. That enables the admin dashboard, authenticated uploads, moderation, and community submissions without coupling the public UI to GitHub.
# screen.studio
