# Fonts for generated images

`src/app/opengraph-image.tsx` uses these (next/og cannot read woff2):

- `instrument-sans-latin-600.woff` — Instrument Sans, SIL Open Font License 1.1
- `roboto-latin-400.woff` — Roboto, SIL Open Font License 1.1

Source: Fontsource (https://fontsource.org). The website itself loads both families
through `next/font`, not from this folder.
