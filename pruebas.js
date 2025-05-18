const nombre_A = "Empresa A";
const nombre_B = "Empresa B";
const nombre_C = "Empresa C";
const pbl = 2000

offers = [
  { name: nombre_A, price: 1900 },
  { name: nombre_B, price: 1000 },
  { name: nombre_C, price: 1500 }
];


let validOffers = [...offers];

const ofertaNoExcluida = validOffers.every(offer=>offer.price < pbl)
// console.log(ofertaNoExcluida)

if(ofertaNoExcluida){

    const mean = validOffers.reduce((sum, offer) => sum + offer.price,0) / validOffers.length
    const ofertaNoSupera = validOffers.filter(o => o.price <= mean*1.1)
    const nuevaMedia = ofertaNoSupera.reduce((suma,offer) => suma + offer.price,0)/ofertaNoSupera.length

    for(let offer of offers){
        const isAB = offer.price <= nuevaMedia*0.90
        resultHTML += `
        <li class="list-group-item">${offer.name} : ${offer.price.toFixed(2)} --> ${isAB ? "<strong>En baja</strong>" : "No baja"} </li>     
        `
    }
} else{
    resultHTML += "<p>Alguna de las ofertas es superior al PBL</p>"
}



// let mean =
//   validOffers.reduce((sum, o) => sum + o.price, 0) / validOffers.length;
// const filtered = validOffers.filter((o) => o.price <= mean * 1.1);
// if (filtered.length < validOffers.length) {
//   mean = filtered.reduce((sum, o) => sum + o.price, 0) / filtered.length;
// }
// for (let offer of offers) {
//   const isAB = offer.price < 0.9 * mean;
//   resultHTML += `<li class="list-group-item">${
//     offer.name
//   }: ${offer.price.toFixed(2)} € → ${
//     isAB ? "<strong>AB</strong>" : "No AB"
//   }</li>`;
// }
