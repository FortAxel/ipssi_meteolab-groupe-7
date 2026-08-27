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

- **Prévisions à 5 jours** : sur la page `/weather/:city`, en plus de la météo actuelle, un second appel à l'API OpenWeather (endpoint `/forecast`) affiche les prévisions des 5 prochains jours (température min/max, description, icône) via le composant `Forecast`. Les créneaux de 3h renvoyés par l'API sont regroupés par jour côté `WeatherService`.

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

- API utilisée : [OpenWeather](https://openweathermap.org/api)

| Endpoint | Méthode | Paramètres | Données récupérées |
| --- | --- | --- | --- |
| `/data/2.5/weather` | GET | `q` (ville), `appid` (clé API), `units=metric`, `lang=fr` | Météo actuelle : nom de la ville, pays, température, ressenti, description, humidité, vent, icône |
| `/data/2.5/forecast` | GET | `q`, `appid`, `units=metric`, `lang=fr` | Prévisions par créneaux de 3h sur 5 jours, regroupées par jour (fonctionnalité libre) |

Les températures sont demandées directement en degrés Celsius via le paramètre `units=metric` plutôt que converties manuellement depuis les Kelvin renvoyés par défaut.

## Postman

La collection Postman du projet se trouve dans [`postman/Meteolab.postman_collection.json`](postman/Meteolab.postman_collection.json).

Pour l'utiliser :

1. Importer le fichier dans Postman (`Import` > sélectionner le fichier).
2. Renseigner la variable de collection `api_key` avec votre clé API OpenWeather (ne jamais commiter de vraie clé).
3. Les variables `base_url` et `city` sont préremplies et modifiables.

Organisation de la collection :

- **Current Weather** — météo actuelle pour Paris, Lille, Tokyo
- **Forecast** — prévisions 5 jours pour Paris, Lille, Tokyo (fonctionnalité libre)
- **Gestion des erreurs** — exemple de requête sur une ville introuvable (404)

Chaque requête est documentée (objectif, méthode, paramètres, réponse attendue) et possède des tests Postman (`pm.test`) qui vérifient le code de statut et la présence des champs utilisés par l'application.

## Difficultés rencontrées

À compléter en fin de projet (au moins deux difficultés et leur résolution).

## Améliorations possibles

À compléter avant la soutenance.
