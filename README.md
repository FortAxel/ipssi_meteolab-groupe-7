# Meteolab

## Présentation

Meteolab est une application web de météo réalisée avec Angular. L'utilisateur
recherche une ville depuis un formulaire ; l'application affiche les conditions
actuelles via l'API REST OpenWeather (température, ressenti, description,
humidité, vent, icône).

## Membres

- Safi Bougherara
- Amir Iradi
- Nassim Djemai
- Axel Fortunato

## Technologies

- Angular
- TypeScript
- HTML / CSS
- OpenWeather API
- Postman

## Installation

```bash
npm install
cp src/environments/environment.example.ts src/environments/environment.ts
```

Sous Windows : `copy src\environments\environment.example.ts src\environments\environment.ts`.

Ouvrir `src/environments/environment.ts` et coller votre clé OpenWeather dans
`openWeatherApiKey` (voir Configuration). Puis :

```bash
npm start
```

Ouvrir [http://localhost:4200](http://localhost:4200).

`npm start` lance le CLI **local** du projet (`ng serve` via `node_modules`).
`npx ng serve` fait la même chose. Un `ng serve` global n'est pas recommandé :
la version installée sur la machine peut différer d'Angular 22.

## Configuration

1. Créer un compte gratuit sur [openweathermap.org](https://openweathermap.org)
   (une seule clé pour le groupe). L'activation peut prendre jusqu'à 2 heures.
2. Récupérer la clé dans l'onglet **API keys**.
3. Copier `src/environments/environment.example.ts` vers
   `src/environments/environment.ts`.
4. Renseigner `openWeatherApiKey` avec **votre** clé. Ne jamais y mettre la
   clé du groupe dans un commit, ni dans ce README.

`environment.ts` est listé dans `.gitignore` : Git ne l'envoie pas. Le fichier
d'exemple (clé vide) reste versionné pour que le projet compile après copie.

Variante CI / variable d'environnement :

```bash
OPENWEATHER_API_KEY=votre_cle npm run setup
```

Le script `scripts/setup-env.mjs` génère alors `environment.ts`. S'il existe
déjà en local et que la variable n'est pas définie, le fichier n'est pas
écrasé.


## Fonctionnalités obligatoires

- Page d'accueil `/home` avec formulaire de recherche
- Page météo `/weather/:city` (ville lue dans l'URL)
- Page à propos `/about`
- Service Angular + `HttpClient` (aucun appel HTTP dans un composant)
- Gestion du chargement et des erreurs (formulaire vide, ville introuvable, erreur API, 429)

## Fonctionnalités supplémentaires

- Prévisions météo sur 5 jours (endpoint `/forecast` d'OpenWeather), affichées
  sous la météo actuelle une fois la ville chargée avec succès.

## Architecture

```
src/app/
  components/     navbar, (search)
  pages/          home, weather, about
  services/       (weather)
```

À préciser en fin de projet : organisation réelle, communication entre
composants (`@Input` / `@Output` / service), gestion d'état (signals et/ou RxJS).

## API

À compléter :

- API utilisée : OpenWeather

## Postman

La collection Postman se trouve dans
[`postman/Meteolab.postman_collection.json`](./postman/Meteolab.postman_collection.json).
Elle couvre la météo actuelle (`/weather`), les prévisions 5 jours
(`/forecast`) et des cas d'erreur (ville introuvable, clé API invalide).
Importer le fichier dans Postman et renseigner la variable de collection
`apiKey` avec une clé OpenWeather valide.

## Difficultés rencontrées

### Format de l'endpoint forecast

Nous nous attendions à 5 objets (un par jour). L'endpoint gratuit
`/data/2.5/forecast` renvoie une liste plate d'environ 40 mesures, une toutes
les 3 heures. Nous avons agrégé côté service : groupement par date, min / max
du jour, icône et description prises sur le créneau de midi (avec un fallback
si `12:00:00` est absent, par exemple en fin de journée). Cette structure a
été identifiée dans Postman avant d'écrire le code Angular.

### Changement de ville sans rechargement du composant

Le chargement était d'abord dans `ngOnInit`. En naviguant de `/weather/Paris`
vers `/weather/Lyon`, Angular **réutilise** la même instance : seul le
paramètre `:city` change, `ngOnInit` ne se réexécute pas, l'écran restait sur
Paris. Nous lisons `paramMap` via `toSignal`, et un `effect()` relance
`loadWeather` / `loadForecast` dès que la ville change.

### Décalage de date (fuseaux horaires)

`new Date('2026-08-27')` sans heure est interprété en UTC. Selon le fuseau du
navigateur, l'affichage pouvait reculer d'un jour. Dans le composant forecast,
la date est reconstruite pièce par pièce (`année`, `mois`, `jour`) pour rester
en heure locale.

## Améliorations possibles

Avec plus de temps :

- géolocalisation pour afficher la météo locale dès l'ouverture
- historique des recherches
- graphique d'évolution des températures
- champ de recherche sur la page météo (aujourd'hui il faut revenir à
  l'accueil pour changer de ville)

Ce que nous ferions différemment : remplacer l'`effect()` + `subscribe` par
un flux RxJS (`paramMap` → `switchMap` → `shareReplay`) pour gérer le cache et
les conditions de course, et écrire les tests au fil du développement plutôt
qu'à la fin.
