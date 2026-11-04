# Vintilbud

En lille webapp, der viser dagens tilbud på vin fra Bourgogne hos danske vinforhandlere.

- `data.json` indeholder dagens tilbud og er den eneste fil, der skal opdateres hver dag.
- `index.html`, `styles.css` og `app.js` er selve appen.
- `manifest.webmanifest`, `sw.js` og `icons/` gør, at appen kan lægges på telefonens hjemmeskærm.

## Offentliggørelse med GitHub Pages

1. Læg filerne i roden af et offentligt repository.
2. Gå til Settings > Pages.
3. Vælg "Deploy from a branch", branchen `main` og mappen `/ (root)`.

## Installation på telefonen

- iPhone: Åbn adressen i Safari, tryk på Del, og vælg "Føj til hjemmeskærm".
- Android: Åbn adressen i Chrome, tryk på menuen, og vælg "Føj til startskærm" eller "Installer app".

## Felter i data.json

Hvert tilbud har `image`, som er den fulde https-adresse på forhandlerens produktbillede. Er feltet tomt, eller kan billedet ikke hentes, viser appen en tegnet flaske.
