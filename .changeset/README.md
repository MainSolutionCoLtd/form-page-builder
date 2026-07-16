# Changesets

This directory is managed by [Changesets](https://github.com/changesets/changesets).

Whenever you make a change that consumers should know about, run:

```bash
npx changeset
```

Pick a bump type (patch/minor/major), describe the change, and commit the generated markdown file in this folder alongside your PR. On merge to `main`, a bot PR ("Version Packages") accumulates these into a version bump and `CHANGELOG.md` entry. Merging that PR does **not** publish by itself — publishing happens when a maintainer cuts a GitHub Release (see [README.md](../README.md#releasing)).
