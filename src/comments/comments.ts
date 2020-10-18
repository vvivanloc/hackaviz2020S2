let divComments: Element;
export const comments = [
  `<ul>
  <li> Avec 83 millions de passagers, Paris se démarque des 5 plus grands aéroports, Nice (10M), Lyon, Marseille et Toulouse (6M).</li>
  <li> Paris draine la majeure partie du fret (1,3Mt), loin devant Marseille et Toulouse (50 kt) avec deux axes, St-Nazaire ⟷ Toulouse, Paris ⟷ Bale-Mulhouse (8t).</li>
   </ul>
  `,
  `
  <ul>
  <li><b>Comment a évolué le trafic 10 ans après ?</b>
  </li>
  <ul>
  `,
  `
  <ul>
  <li>Paris continue en tête avec 108 millions de passagers.Les 5 plus grands aéroports (15 à 10M) sont rejoints par Nantes et Bordeaux (7M).</li>
  <li>Le passagers préfèrent le train (lignes TGV Paris ⟷ Marseille et Paris ⟷ Bordeaux).</li>
  <li>Les colis devant arriver toujours plus vite, 4 axes se sont renforcés entre Paris, Marseille, Toulouse, Lyon et Montpellier.</li>
  <li>Le trafic passager et fret se concentre : les petits aéroports proches des grands pôles disparaissent ou voient leur trafic diminuer.</li>  
   </ul>
   `,
];
export function setDivComments() {
  divComments = document.getElementsByClassName('blah')[0];
}
export function renderComments(commentIndex: number) {
  divComments.innerHTML = comments[commentIndex];
}
