# Academic website

Run locally with Node.js 22.18 or later.

```sh
cd site && npm install
npm run dev
npm run build
gh workflow run deploy.yml
```

Run the first three commands in the same shell, stopping the dev server before
building. For the fourth command, use a Git checkout connected to the Pages
repository. Create or use `brian4685380.github.io`, push the files to
its main branch, and select **GitHub Actions** in **Settings → Pages**. Pushes to
main also deploy automatically to https://brian4685380.github.io/.

See [AGENT.md](AGENT.md) for content paths and validation.
