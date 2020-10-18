export function nbPaxToRadius(nbPax: number) {
  let radius = nbPax;
  if (nbPax === 0) {
    radius = 0;
  } else {
    radius = nbPax / 200;
    if (nbPax > 1e7) {
      radius = 60000;
    }
  }

  return radius;
}
export function nbFretToRadius(nbFret: number) {
  let radius = nbFret;
  if (nbFret === 0) {
    radius = 0;
  } else {
    radius = nbFret / 2;
    if (nbFret > 1e6) {
      radius = 60000;
    }
  }

  return radius;
}
// export function hoursToHue(nbHours: number) {
//   let hue = 0;
//   if (nbHours < 0.25) {
//     hue = 200;
//   } else if (nbHours < 0.5) {
//     hue = 120;
//   } else if (nbHours < 0.75) {
//     hue = 50;
//   } else if (nbHours < 1) {
//     hue = 40;
//   } else if (nbHours < 2) {
//     hue = 20;
//   } else hue = 0;
//   return hue;
// }

// export function nbPeopleToStrokeWeight(nbPeople: number) {
//   let weight = 1;
//   if (nbPeople < 1000) {
//     weight = 1;
//   } else if (nbPeople < 5000) {
//     weight = 5;
//   } else if (nbPeople < 10000) {
//     weight = 10;
//   } else if (nbPeople < 50000) {
//     weight = 15;
//   } else {
//     weight = 20;
//   }
//   return weight;
// }

// export function nbPeopleToRadius(nbPeople: number) {
//   let radius = 1;
//   if (nbPeople < 1000) {
//     radius = 3;
//   } else if (nbPeople < 5000) {
//     radius = 7;
//   } else if (nbPeople < 10000) {
//     radius = 10;
//   } else if (nbPeople < 100000) {
//     radius = 20;
//   } else {
//     radius = 30;
//   }
//   return 100*radius;
// }

// export function speedToHue(speedKmH: number) {
//   let hue = 0;
//   if (speedKmH < 40) {
//     hue = 120;
//   } else if (speedKmH < 50) {
//     hue = 30;
//   } else if (speedKmH < 80) {
//     hue = 8;
//   } else hue = 0;
//   return hue;
// }

// export function timeToHue(timeMinutes: number) {
//   let hue = 0;
//   if (timeMinutes < 40) {
//     hue = 120;
//   } else if (timeMinutes < 60) {
//     hue = 30;
//   } else hue = 0;
//   return hue;
// }

// export function timeGainToHue(timeGain: number) {
//   let hue = 0;
//   if (timeGain < 0.25) {
//     hue = 0;
//   } else if (timeGain < 0.5) {
//     hue = 30;
//   } else if (timeGain < 0.78) {
//     hue = 120;
//   } else hue = 120;
//   return hue;
// }

// export const floatToStr= (value:number, maximumFractionDigits =2)=> Number(value).toLocaleString('fr-FR',{maximumFractionDigits:maximumFractionDigits});
