import L from 'leaflet';
import { antPath } from 'leaflet-ant-path';
import { Arc } from '../../model/arc';

export function renderArcs(
  lineArcs: Array<L.LayerGroup>,
  arc: Arc,
  type: 'Fret' | 'Pax'
) {
  _renderArcs(type, arc, lineArcs[0], '2009');
  _renderArcs(type, arc, lineArcs[1], '2019');
}
function _renderArcs(
  type: string,
  arc: Arc,
  lineArcs: L.LayerGroup<any>,
  year: '2009' | '2019'
) {
  const attrib = (type === 'Pax' ? 'Pax_Total_' : 'Fret_Total_')+year;
  const src = new L.LatLng(arc.lng_Origine, arc.lat_Origine);
  const dest = new L.LatLng(arc.lng_Destination, arc.lat_Destination);
  const weight2009 =
    arc[attrib] / (type === 'Pax' ? 300000 : 2000);
  let weightDestExtra = 0;

  const weight = Math.max(weightDestExtra, weight2009);

  const mainLine: L.LatLngExpression[] = [
    [src.lng, src.lat],
    [dest.lng, dest.lat],
  ];

  const label = `<b>${arc.Origine} ⟷ ${arc.Destination}</b><br> ${
    type === 'Pax'
      ? Number(arc[attrib]).toLocaleString('fr-FR') + ' passagers'
      : Number(arc[attrib]).toLocaleString('fr-FR') + ' t'
  }`;
  let color: string;
  if (year==="2019") {
  if (type === 'Pax') {
    color = arc.Pax_Total_2019 > arc.Pax_Total_2009 ? 'green' : 'red';
  } else {
    color = arc.Fret_Total_2019 > arc.Fret_Total_2009 ? 'green' : 'red';
  }
} else {
  color="grey"
}

  let useAnimation = false;
  if (type === 'Pax') {
    useAnimation = arc[attrib] > 5e5;
  } else {
    useAnimation = arc[attrib] > 5000;
  }
  if (useAnimation) {
    const options = {
      use: L.polyline,
      color: 'white',
      weight: weight,
      lineCap: 'butt',
      opacity: 0.6,
      delay: 500,
      dashArray: [
        100 / (arc[attrib] / (type === 'Pax' ? 1e6 : 5000)),
        5,
      ],
      pulseColor: color,
      hardwareAccelerated: true,
    };
    const path = antPath(mainLine, options).bindTooltip(label, {
      sticky: true,
    });
    path.addTo(lineArcs);
  } else {
    L.polyline(mainLine, {
      color: color,
      weight: weight,
      opacity: 0.5,
    } as any)
      .bindTooltip(label, { sticky: true })
      .addTo(lineArcs);
  }
}
