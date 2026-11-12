# App screens

iPhone 15 screenshots (393 × 852 pt, exported at 2× = 786 × 1704 px) with the iOS status bar
and home indicator, rendered by `npm run screens:generate`:

| File           | Used in                                   | Source |
| -------------- | ----------------------------------------- | ------ |
| `home.png`     | Hero, OG image                            | The app's real home screen, rebuilt from its source (`scripts/screens/home.mjs`) |
| `food.png`     | "Inside the app" → Food Court             | Mockup of the Food Court home (`scripts/generate-screens.mjs`) |
| `health.png`   | "Inside the app" → Digital Health         | Mockup of the Health home |
| `shopping.png` | "Inside the app" → Smart Shopping         | Mockup of the Shopping home |
| `rider.png`    | Partners → Rider view                     | Mockup of a new delivery in the rider view |

Photos come from the MetroMatrix app (licences: `scripts/screen-photos/CREDITS.md`). Names on
screen are the app's fictional demo data.

To use real device captures, replace a file with a PNG of the same name and size (786 × 1704).
A 1179 × 2556 capture also works if you update `SCREEN_SIZE` in `src/content/images.ts`. Then
delete `.next/cache/images` so a running server stops serving old copies. Update alt text in
`src/content/images.ts` if a screen's content changes.
