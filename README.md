# Bastide Aurane

Site vitrine pour la Bastide Aurane, maison d'hôtes de luxe à Gordes, en Provence
(projet de démonstration — établissement fictif). Toutes les images sont générées
via Higgsfield (Nano Banana Pro / Nano Banana 2).

## Aperçu local

```bash
python3 -m http.server 8877
```

Puis ouvrir `http://localhost:8877/`.

## Structure

```
index.html          page unique
css/style.css        styles
js/main.js            interactions (nav, scroll-reveal, vidéo d'arrivée, formulaire)
assets/img/           photographie générée
assets/video/         vidéo d'arrivée (arrivee.mp4 — à ajouter, voir ci-dessous)
```

## Vidéo d'arrivée

La section héro (`#accueil`) est prévue pour une vidéo Seedance 2.5 scrubée au
scroll (`assets/video/arrivee.mp4`, 24 s, 720p, 16:9, sans audio). Tant que le
fichier n'est pas présent, une image de repli (`hero-facade.jpg`) s'affiche
avec un effet Ken Burns — aucune modification de code n'est nécessaire, il
suffit de déposer le fichier `arrivee.mp4` à cet emplacement.
