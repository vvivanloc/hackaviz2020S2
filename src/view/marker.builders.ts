import L from 'leaflet';

const toRad = Math.PI / 180;
const toDeg = 180 / Math.PI;
const R = 6378137; // approximation of Earth's radius

export class MarkerUtils {
  private static readonly epsilon = 0.1;
  private static readonly nbSides = 6;

  /**
   * shamelessly taken from Leaflet.GeometryUtil
   * http://makinacorpus.github.io/Leaflet.GeometryUtil/index.html
   * MakinaCorpus
   */

  /**
       Returns the bearing in degrees clockwise from north (0 degrees)
       from the first L.LatLng to the second, at the first LatLng
       @param {L.LatLng} latlng1: origin point of the bearing
       @param {L.LatLng} latlng2: destination point of the bearing
       @returns {float} degrees clockwise from north.
    */
  static bearing = (latlng1: L.LatLng, latlng2: L.LatLng): number => {
    const lat1 = latlng1.lat * toRad,
      lat2 = latlng2.lat * toRad,
      lon1 = latlng1.lng * toRad,
      lon2 = latlng2.lng * toRad,
      y = Math.sin(lon2 - lon1) * Math.cos(lat2),
      x =
        Math.cos(lat1) * Math.sin(lat2) -
        Math.sin(lat1) * Math.cos(lat2) * Math.cos(lon2 - lon1);
    const bearing = ((Math.atan2(y, x) * 180) / Math.PI + 360) % 360;
    return bearing >= 180 ? bearing - 360 : bearing;
  };

  /**
        Returns the Point located on a segment at the specified ratio of the segment length.
        @param {L.Point} pA coordinates of point A
        @param {L.Point} pB coordinates of point B
        @param {Number} the length ratio, expressed as a decimal between 0 and 1, inclusive.
        @returns {L.Point} the interpolated point.
    */
  static interpolateOnPointSegment = (
    pA: { x: number; y: number },
    pB: { x: number; y: number },
    ratio: number
  ) => {
    return L.point(
      pA.x * (1 - ratio) + ratio * pB.x,
      pA.y * (1 - ratio) + ratio * pB.y
    );
  };

  /**
        Returns the coordinate of the point located on a line at the specified ratio of the line length.
        @param {L.Map} map Leaflet map to be used for this method
        @param {Array<L.LatLng>|L.PolyLine} latlngs Set of geographical points
        @param {Number} ratio the length ratio, expressed as a decimal between 0 and 1, inclusive
        @returns {Object} an object with latLng ({LatLng}) and predecessor ({Number}), the index of the preceding vertex in the Polyline
        (-1 if the interpolated point is the first vertex)
    */
  static interpolateOnLineFromRatio = (
    map: L.Map,
    latLngs: Array<L.LatLng> | L.Polyline,
    ratio: number
  ): object => {
    let _latLngs =
      latLngs instanceof L.Polyline ? latLngs.getLatLngs() : latLngs;
    var n = _latLngs.length;
    if (n < 2) {
      return null;
    }
    // ensure the ratio is between 0 and 1;
    ratio = Math.max(Math.min(ratio, 1), 0);
    if (ratio === 0) {
      return {
        latLng:
          _latLngs[0] instanceof L.LatLng ? _latLngs[0] : L.latLng(latLngs[0]),
        predecessor: -1
      };
    }
    if (ratio == 1) {
      return {
        latLng:
          _latLngs[_latLngs.length - 1] instanceof L.LatLng
            ? _latLngs[_latLngs.length - 1]
            : L.latLng(latLngs[_latLngs.length - 1]),
        predecessor: _latLngs.length - 2
      };
    }
    // project the LatLngs as Points,
    // and compute total planar length of the line at max precision
    var maxzoom = map.getMaxZoom();
    if (maxzoom === Infinity) maxzoom = map.getZoom();
    var pts = [];
    var lineLength = 0;
    for (var i = 0; i < n; i++) {
      pts[i] = map.project(latLngs[i], maxzoom);
      if (i > 0) lineLength += pts[i - 1].distanceTo(pts[i]);
    }
    var ratioDist = lineLength * ratio;
    var a = pts[0],
      b = pts[1],
      distA = 0,
      distB = a.distanceTo(b);
    // follow the line segments [ab], adding lengths,
    // until we find the segment where the points should lie on
    var index = 1;
    for (; index < n && distB < ratioDist; index++) {
      a = b;
      distA = distB;
      b = pts[index];
      distB += a.distanceTo(b);
    }
    // compute the ratio relative to the segment [ab]
    var segmentRatio =
      distB - distA !== 0 ? (ratioDist - distA) / (distB - distA) : 0;
    var interpolatedPoint = MarkerUtils.interpolateOnPointSegment(
      a,
      b,
      segmentRatio
    );
    return {
      latLng: map.unproject(interpolatedPoint, maxzoom),
      predecessor: index - 2
    };
  };

  /**
        Returns the coordinate of the point located on a line at the specified ratio of the line length.
        @param {L.Map} map Leaflet map to be used for this method
        @param {Array<L.LatLng>|L.PolyLine} latlngs Set of geographical points
        @param {Number} distanceMeter the length in meters
        @returns {Object} an object with latLng ({LatLng}) and predecessor ({Number}), the index of the preceding vertex in the Polyline
        (-1 if the interpolated point is the first vertex)
    */
  static interpolateOnLineFromDistance = (
    map: L.Map,
    latLngs: Array<L.LatLng> | L.Polyline,
    distanceMeter: number
  ): { latLng: L.LatLng; predecessor: number } | null => {
    let _latLngs =
      latLngs instanceof L.Polyline ? latLngs.getLatLngs() : latLngs;
    var n = _latLngs.length;
    if (n < 2) {
      return null;
    }
    // ensure the ratio is between 0 and 1;

    // project the LatLngs as Points,
    // and compute total planar length of the line at max precision
    var maxzoom = map.getMaxZoom();
    if (maxzoom === Infinity) maxzoom = map.getZoom();
    var pts = [];
    var lineLength = 0;
    for (var i = 0; i < n; i++) {
      pts[i] = map.project(latLngs[i], maxzoom);
      if (i > 0) lineLength += pts[i - 1].distanceTo(pts[i]);
    }

    let _distanceMeter = distanceMeter;
    if (distanceMeter > lineLength) {
      return {
        latLng:
          _latLngs[_latLngs.length - 1] instanceof L.LatLng
            ? (_latLngs[_latLngs.length - 1] as L.LatLng)
            : (L.latLng(latLngs[_latLngs.length - 1]) as L.LatLng),
        predecessor: _latLngs.length - 2
      };
    }

    if (distanceMeter <= 0) {
      _distanceMeter = lineLength - distanceMeter;
    }
    var a = pts[0],
      b = pts[1],
      distA = 0,
      distB = a.distanceTo(b);
    // follow the line segments [ab], adding lengths,
    // until we find the segment where the points should lie on
    var index = 1;
    for (; index < n && distB < _distanceMeter; index++) {
      a = b;
      distA = distB;
      b = pts[index];
      distB += a.distanceTo(b);
    }
    // compute the ratio relative to the segment [ab]
    var segmentRatio =
      distB - distA !== 0 ? (_distanceMeter - distA) / (distB - distA) : 0;
    var interpolatedPoint = MarkerUtils.interpolateOnPointSegment(
      a,
      b,
      segmentRatio
    );
    return {
      latLng: map.unproject(interpolatedPoint, maxzoom),
      predecessor: index - 2
    };
  };
  /**
   * Returns the point that is a distance and heading away from
   * the given origin point.
   * @param {L.LatLng} latlng: origin point
   * @param {float}: heading in degrees, clockwise from 0 degrees north.
   * @param {float}: distance in meters
   * @returns {L.latLng} the destination point.
   * Many thanks to Chris Veness at http://www.movable-type.co.uk/scripts/latlong.html
   * for a great reference and examples.
   */
  static destination = (
    latlng: { lng: number; lat: number },
    headingDegrees: number,
    distanceMeter: number
  ): L.LatLng => {
    headingDegrees = (headingDegrees + 360) % 360;
    const lon1 = latlng.lng * toRad,
      lat1 = latlng.lat * toRad,
      rheading = headingDegrees * toRad,
      sinLat1 = Math.sin(lat1),
      cosLat1 = Math.cos(lat1),
      cosDistR = Math.cos(distanceMeter / R),
      sinDistR = Math.sin(distanceMeter / R),
      lat2 = Math.asin(
        sinLat1 * cosDistR + cosLat1 * sinDistR * Math.cos(rheading)
      );

    let lon2 =
      lon1 +
      Math.atan2(
        Math.sin(rheading) * sinDistR * cosLat1,
        cosDistR - sinLat1 * Math.sin(lat2)
      );

    lon2 = lon2 * toDeg;
    lon2 = lon2 > 180 ? lon2 - 360 : lon2 < -180 ? lon2 + 360 : lon2;
    return L.latLng([lat2 * toDeg, lon2]);
  };

  static buildArcCircle = (
    center: [number, number],
    radiusMeter: number,
    startAngleRad: number,
    endAngleRad: number,
    nbSides = MarkerUtils.nbSides
  ): Array<[number, number]> => {
    const points: Array<[number, number]> = [];

    const arcIncrement = (2 * Math.PI) / nbSides;

    for (
      let angle = startAngleRad;
      angle < endAngleRad;
      angle = angle + arcIncrement
    ) {
      const x = MarkerUtils.destination(
        { lat: center[0], lng: center[1] },
        (angle * 360) / (2 * Math.PI),
        radiusMeter
      );
      points.push([x.lat, x.lng]);
    }
    return points;
  };

  static buildHalfLeftCircle = (
    center: [number, number],
    radiusMeter: number
  ): Array<[number, number]> => {
    return MarkerUtils.buildArcCircle(
      center,
      radiusMeter,
      Math.PI,
      Math.PI * 2 + MarkerUtils.epsilon
    );
  };

  static buildHalfRightCircle = (
    center: [number, number],
    radiusMeter: number
  ): Array<[number, number]> => {
    return MarkerUtils.buildArcCircle(
      center,
      radiusMeter,
      0,
      Math.PI + MarkerUtils.epsilon
    );
  };
}
