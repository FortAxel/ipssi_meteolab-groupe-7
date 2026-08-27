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
npx ng serve
```

Ouvrir [http://localhost:4200](http://localhost:4200).

## Configuration


## Fonctionnalités obligatoires

- Page d'accueil `/home` avec formulaire de recherche
- Page météo `/weather/:city` (ville lue dans l'URL)
- Page à propos `/about`
- Service Angular + `HttpClient` (aucun appel HTTP dans un composant)
- Gestion du chargement et des erreurs (formulaire vide, ville introuvable, erreur API, 429)

## Fonctionnalités supplémentaires


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

À compléter 

## Difficultés rencontrées

À compléter en fin de projet (au moins deux difficultés et leur résolution).

## Améliorations possibles

À compléter avant la soutenance.
