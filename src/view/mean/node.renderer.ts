import L from 'leaflet';
import { Node } from '../../model/node';
import { nbPaxToRadius, nbFretToRadius } from '../../model/value.mappers';
import { extendSemiCircle } from '../extendSemiCircle';
extendSemiCircle();

export function renderNode(
  markerLayer: Array<L.LayerGroup>,
  node: Node,
  type: 'Fret' | 'Pax'
) {
  _renderNodeMarker(markerLayer[0], node, type, 'A2010');
  _renderNodeMarker(markerLayer[1], node, type, 'A2019');
}

function _renderNodeMarker(
  markerLayer: L.LayerGroup,
  node: Node,
  type: 'Fret' | 'Pax',
  attribute :'A2010' | 'A2019' 
) {
  if (node[attribute] === 0) {
    return;
  }
  const increase =
    node['A2010'] > 0
      ? ((node[attribute] - node['A2010']) / node['A2010']) * 100
      : 0;
  let radius =
    type === 'Pax'
      ? nbPaxToRadius(node[attribute])
      : nbFretToRadius(node[attribute]);

  radius = Math.max(radius, 10000);
  let popupLabel =
    Number(node[attribute]).toLocaleString('fr-FR') +
    ' ' +
    (type === 'Fret' ? 't' : ' passagers');
  if (node.lat === undefined || node.lng === null) {
    console.warn(`Cannot render node: ${node.ville}, empty latlng`);
    return;
  }

  const color = attribute==='A2010'?'grey':(increase > 0 ? 'green' : 'red');
  if (node.ville === 'PARIS') {
    for (let i = 0; i < 3; i++) {
      const marker = L.circle([node.lat, node.lng], {
        radius: radius * (1 - 0.2 * (i + 1)),
        color: `black`,
        fillColor: color,
        fillOpacity: 0.5,
        weight: 2,
      }).addTo(markerLayer);
    }
  }

  const marker = L.circle([node.lat, node.lng], {
    radius: radius,
    color: `black`,
    fillColor: color,
    fillOpacity: 0.5,
    weight: 0.5,
  })
    // HACK add popup to eat click event
    .bindTooltip(` <b>${node.ville}</b><br>${popupLabel}`)
    //.bindPopup(` <b>${node.ville}</b><br>${popupLabel}`)

    .addTo(markerLayer);

  const props = JSON.stringify(node).split(',');
  marker['properties'] = props;
}
