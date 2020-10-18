import L from 'leaflet';

declare const _nodes: any;
declare const _arcs: any;
declare var topojson: any;

import { Node } from './model/node';
import { Arc } from './model/arc';

import { renderNode } from './view/mean/node.renderer';

import { renderArcs } from './view/mean/arc.renderer';

// -1 for all
const nbMaxNodes: number = -1;

export type NodeLatLongs = { [key: string]: { lon: number; lat: number } };

let nodeData = _nodes as Array<Node>;
let arcData = _arcs as Array<Arc>;

async function createOpenStreetMapLayer(mapDivId: string): Promise<L.Map> {
  var map = L.map(mapDivId, {
    center: [46.7, 2.3],
    minZoom: 5,
    maxZoom: 8,
    zoom: 5.5,
    renderer: L.svg(),
  });
  // L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  //   attribution:
  //     '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  //   subdomains: ['a', 'b', 'c']
  // }).addTo(map);

  //extend Leaflet to create a GeoJSON layer from a TopoJSON file
  (L as any).TopoJSON = L.GeoJSON.extend({
    addData: function (data) {
      var geojson, key;
      if (data.type === 'Topology') {
        for (key in data.objects) {
          if (data.objects.hasOwnProperty(key)) {
            geojson = (topojson as any).feature(data, data.objects[key]);
            L.GeoJSON.prototype.addData.call(this, geojson);
          }
        }
        return this;
      }
      L.GeoJSON.prototype.addData.call(this, data);
      return this;
    },
  });
  (L as any).topoJson = function (data, options) {
    return new (L as any).TopoJSON(data, options);
  };
  //create an empty geojson layer
  //with a style and a popup on click
  var geojson = (L as any)
    .topoJson(null, {
      style: function (_feature) {
        return {
          color: 'black',
          opacity: 1,
          weight: 0.1,
          fillColor: '#2E2E2E',
          fillOpacity: 1,
        };
      },
    })
    .addTo(map);
  //fill: #317581;
  //define a function to get and parse geojson from URL
  async function getGeoData(url) {
    let response = await fetch(url);
    let data = await response.json();
    return data;
  }

  //fetch the geojson and add it to our geojson layer
  let data: any = await getGeoData('maps/france.topojson');
  geojson.addData(data);
  return map;
}

let mapPax: L.Map;
let mapFret: L.Map;
let linePaxArcs: Array<L.LayerGroup>;
let markerPaxLayers: Array<L.LayerGroup>;
let lineFretArcs: Array<L.LayerGroup>;
let markerFretLayers: Array<L.LayerGroup>;
async function renderMap() {
  mapPax = await createOpenStreetMapLayer('mapPax');
  mapFret = await createOpenStreetMapLayer('mapFret');

  (mapPax as any).sync(mapFret);
  (mapFret as any).sync(mapPax);
  // manage overlays in groups to ease superposition order
  linePaxArcs = [L.layerGroup(), L.layerGroup()];
  markerPaxLayers = [L.layerGroup(), L.layerGroup()];
  markerPaxLayers[0].addTo(mapPax);
  linePaxArcs[0].addTo(mapPax);

  lineFretArcs = [L.layerGroup(), L.layerGroup()];
  markerFretLayers = [L.layerGroup(), L.layerGroup()];
  markerFretLayers[0].addTo(mapFret);
  lineFretArcs[0].addTo(mapFret);

  // FRM_LD_NLD
  nodeData
    .filter((node) => node.tra_meas === 'PAS_CRD')
    .forEach((node) => {
      renderNode(markerPaxLayers, node, 'Pax');
    });

  arcData.forEach((arc) => {
    renderArcs(linePaxArcs, arc, 'Pax');
  });

  nodeData
    .filter((node) => node.tra_meas === 'FRM_LD_NLD')
    .forEach((node) => {
      renderNode(markerFretLayers, node, 'Fret');
    });

  arcData.forEach((arc) => {
    renderArcs(lineFretArcs, arc, 'Fret');
  });
}
let toggle = true;

let slideIndex = 0;
const titre = 'Evolution du trafic aerien en France de 2009 A 2019';
declare var DepartureBoard;
var board = new DepartureBoard(document.getElementById('test'), {
  rowCount: 2,
  letterCount: 52,
});

const divComments = document.getElementsByClassName('blah')[0];
const comments = [
  `<ul>
  <li> Avec 83 millions de passagers, Paris se démarque des 5 plus grands aéroports, Nice (10M), Lyon, Marseille et Toulouse (6M).</li>
  <li> Paris draine la majeure partie du fret (1,3Mt), loin devant Marseille et Toulouse (50 kt) avec deux axes, St-Nazaire ⟷ Toulouse, Paris ⟷ Bale-Mulhouse (8t).</li>
   </ul>
  `,
  `
  Comment a évolué le trafic 10 ans après ?
  `,
  `
  <ul>
  <li>Paris continue en tête avec 108 millions de passagers.Les 5 plus grands aéroports (15 à 10M) sont rejoints par Nantes et Bordeaux (7M).</li>
  <li>Le passagers préfèrent le train (lignes TGV Paris ⟷ Marseille et Paris ⟷ Bordeaux).</li>
  <li>Pour le fret, les colis devant arriver toujours plus vite, 4 axes se sont renforcés entre Paris, Marseille, Toulouse, Lyon et Montpellier.</li>
  <li>Le trafic passager et fret se concentre : les petits aéroports sont absorbés par les grands pôles.</li>  
   </ul>
   `,
];

(window as any).togglePoints = () => {
  if (toggle) {
    document.getElementById('year').innerHTML = '2019';
    board.setValue([titre, 'ANNEE 2019']);

    slideIndex = 2;
    divComments.innerHTML = comments[slideIndex];

    linePaxArcs[0].removeFrom(mapPax);
    linePaxArcs[1].addTo(mapPax);
    lineFretArcs[0].removeFrom(mapFret);
    lineFretArcs[1].addTo(mapFret);

    markerPaxLayers[0].removeFrom(mapPax);
    markerPaxLayers[1].addTo(mapPax);
    markerFretLayers[0].removeFrom(mapFret);
    markerFretLayers[1].addTo(mapFret);
  } else {
    document.getElementById('year').innerHTML = '2009';

    slideIndex = 0;
    divComments.innerHTML = comments[slideIndex];

    board.setValue([titre, 'ANNEE 2009']);
    linePaxArcs[1].removeFrom(mapPax);
    linePaxArcs[0].addTo(mapPax);
    lineFretArcs[1].removeFrom(mapFret);
    lineFretArcs[0].addTo(mapFret);

    markerPaxLayers[1].removeFrom(mapPax);
    markerPaxLayers[0].addTo(mapPax);
    markerFretLayers[1].removeFrom(mapFret);
    markerFretLayers[0].addTo(mapFret);
  }
  toggle = !toggle;
};

(window as any).nextSlide = () => {
  divComments.innerHTML = comments[slideIndex + 1];
  slideIndex = slideIndex + 1;
  if (slideIndex == 2) {
    toggle = true;

    (window as any).togglePoints();
    (document.getElementById('checkbox') as HTMLInputElement).checked = true;
  }
  if (slideIndex === comments.length) {
    slideIndex = 0;
    toggle = false;
    (window as any).togglePoints();
    (document.getElementById('checkbox') as HTMLInputElement).checked = false;
  }
};

const credits=[
  "Source des données : Mapathon 2020, Direction générale de l'aviation civile (2020), Eurostats (2020)  - fond de carte France Topojson Khartis",
  "Préparation des données : débroussaillage LibreOffice et préparation avec Pandas",
  "Rendu des données : Librairie Leaflet, greffons leaflet-ant-path et Leaflet.Sync",
  "Codage avec ❤️ sous Lubuntu Focal Fossa et Visual Studio Code, code TypeScript, HTML5, less - panneau d'affichage DepartureBoard.js"
];

function main() {
  renderMap();

  divComments.innerHTML = comments[0];

  board.setValue([titre]);
  window.setTimeout( ()=> {
    board.setValue([titre, 'ANNEE 2009']);
  }, 1000);

  let i=0;
  
  window.setInterval(()=> {
    const divCredits = document.getElementsByClassName('credits')[0];
    divCredits.innerHTML=credits[i];
    i=((i+1)%(credits.length));
  }
  ,5000);
}

main();
