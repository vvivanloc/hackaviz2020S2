const credits = [
  "Source des données : [https://cartomob.sciencesconf.org/resource/page/id/14/ Mapathon 2020], Direction générale de l'aviation civile (2020), Eurostats (2020)  - fond de carte France Topojson [https://www.sciencespo.fr/cartographie/khartis/docs/les-fonds-de-carte-disponibles/ Khartis]",
  "Préparation des données : exploration avec [https://fr.libreoffice.org/discover/libreoffice/ LibreOffice] et préparation avec [https://pandas.pydata.org/ Pandas]",
  "Rendu des données : Librairie [https://leafletjs.com/ Leaflet], greffons [https://github.com/rubenspgcavalcante/leaflet-ant-path/ leaflet-ant-path] et [https://github.com/jieter/Leaflet.Sync/ Leaflet.Sync]",
  "Codé avec ❤️ sous [https://lubuntu.me/focal-released/ Lubuntu] Focal Fossa et [https://code.visualstudio.com/ Visual Studio Code], code [https://www.typescriptlang.org/ TypeScript], HTML5, [http://lesscss.org/ less] - panneau d'affichage [https://github.com/paulcuth/departure-board/ DepartureBoard.js]</a>"
];

function convertHlink(value: string): string {
  const regExp = /\[([^\]]+)\]/g;
  return value.replace(regExp, (_matching: string, firstMatch: string)=> {
    const matchSplit = firstMatch.split("/ ");
    return `<a href="${matchSplit[0]}" target="_blank" rel="noopener noreferrer">${matchSplit[1]}</a>`;
  });
}

let i=0;
export function renderCredits() {
  window.setInterval(() => {
    const divCredits = document.getElementsByClassName('credits')[0];
    divCredits.innerHTML = convertHlink(credits[i]);
    i = ((i + 1) % (credits.length));
  },
    5000);
  return i;
}
