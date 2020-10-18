const credits = [
  "Source des données : Mapathon 2020, Direction générale de l'aviation civile (2020), Eurostats (2020)  - fond de carte France Topojson Khartis",
  "Préparation des données : débroussaillage LibreOffice et préparation avec Pandas",
  "Rendu des données : Librairie Leaflet, greffons leaflet-ant-path et Leaflet.Sync",
  "Codage avec ❤️ sous Lubuntu Focal Fossa et Visual Studio Code, code TypeScript, HTML5, less - panneau d'affichage DepartureBoard.js"
];

let i=0;
export function renderCredits() {
  window.setInterval(() => {
    const divCredits = document.getElementsByClassName('credits')[0];
    divCredits.innerHTML = credits[i];
    i = ((i + 1) % (credits.length));
  },
    5000);
  return i;
}
