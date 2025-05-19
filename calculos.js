// Declaración de variables con los elementos principales del HTML
const numOffersInput = document.getElementById("numOffers");
const offersContainer = document.getElementById("offersContainer");
const offerForm = document.getElementById("offerForm");
const resultsDiv = document.getElementById("results");
const excesivasDiv = document.getElementById("excesivas");
const InputPBL = document.getElementById("pbl");

// Convertir cantidades en €

function formatoMoneda(value) {
  return new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
    useGrouping: true,
  }).format(value);
}

function aplicarFormato(input) {
  input.addEventListener("blur", (e) => {
    let rawValue = e.target.value.replace(/[^0-9,]/g, "").replace(",", ".");
    const euro = parseFloat(rawValue);
    if (!isNaN(euro)) {
      e.target.value = formatoMoneda(euro);
    }
  });
}

aplicarFormato(InputPBL);

// Generar las entradas para que el usuario introduzca el nombre de la empresa y el importe de su oferta

numOffersInput.addEventListener("change", () => {
  offersContainer.innerHTML = "";
  const num = parseInt(numOffersInput.value);
  for (let i = 0; i < num; i++) {
    offersContainer.innerHTML += `
        <div class="mb-3"> 
            <label class = "form-label"> Empresa ${i + 1}</label>
            <input type="text" class="form-control mb-2" name="name${i}" placeholder="Nombre de la empresa" required>
            <input type="text" class="form-control" name="price${i}" placeholder="Introduce la oferta sin IVA" required>     
        </div>
        `;
    document.querySelectorAll("[name^='price']").forEach((input) => {
      aplicarFormato(input);
    });
  }
});

// Limpiar las cifras para operar con ellas

function limpiarDatos(input) {
  return parseFloat(input.replace(/[^\d,]/g, "").replace(",", "."));
}

offerForm.addEventListener("submit", (e) => {
  e.preventDefault();
  resultsDiv.innerHTML = "";

  const pbl = limpiarDatos(document.getElementById("pbl").value);
  const num = parseInt(numOffersInput.value);
  const offers = [];

  // Array con el nombre de la empresa y el precio ofertado
  for (let i = 0; i < num; i++) {
    const name = document.querySelector(`[name=name${i}]`).value.trim();
    const price = limpiarDatos(
      document.querySelector(`[name=price${i}]`).value
    );
    offers.push({ name, price });
  }

  let resultHTML = "<h3>Resultados:</h3><ul class='list-group'>";

  let todasMenores = offers.every((offer) => offer.price <= pbl);
  let mayoresPBL = offers.filter((offer) => offer.price > pbl);

  if (todasMenores) {
    if (num === 1) {
      const offer = offers[0];
      const isAB = offer.price < 0.75 * pbl;
      const umbral = 0.75 * pbl;
      resultHTML += `<li class='list-group-item'>${
        offer.name
      } : ${offer.price.toFixed(2)} € → ${
        isAB ? "<strong>En baja</strong>" : "No baja"
      }</li> `;
      resultHTML += `<p>Serán anormalmente bajas aquellas ofertas inferior al 25 % del PBL. El umbral es de ${formatoMoneda(umbral)} €</p>`;
    } else if (num === 2) {
      const orderOfferts = offers.sort((a, b) => b.price - a.price);
      const umbral = orderOfferts[0].price * 0.8;
      const isAB = orderOfferts[1].price < umbral;
      resultHTML += `<li class="list-group-item">${
        orderOfferts[0].name
      }: ${orderOfferts[0].price.toFixed(2)} € → No baja</li>`;
      resultHTML += `<li class="list-group-item">${
        orderOfferts[1].name
      }: ${orderOfferts[1].price.toFixed(2)} € → ${
        isAB ? "<strong>En baja</strong>" : "No baja"
      }</li>`;
      resultHTML += `<p>Será anormalmente baja aquellas oferta inferior al 20 % del precio de la oferta con mayor precio. El umbral es de ${umbral.toFixed(
        2
      )} €</p>`;
        resultHTML += `
                    <div class="container mt-4">
                        <table class="table table-bordered text-center">
                             <thead class="table-light">
                                 <tr>
                                    <th></th> 
                                    <th>Oferta</th>
                                    <th>Puntuación</th>
                                </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                    <th class="table-light">${
                                      orderOfferts[1].name
                                    }</th>
                                    <td>${orderOfferts[1].price} €</td>
                                    <td>${
                                      (((pbl - orderOfferts[1].price) /
                                      (pbl - orderOfferts[1].price))*100).toFixed(2)
                                    }</td>
                                    </tr>
                                    <tr>
                                    <th class="table-light">${
                                      orderOfferts[0].name
                                    }</th>
                                    <td>${formatoMoneda(orderOfferts[0].price)}</td>
                                    <td>${
                                      (((pbl - orderOfferts[0].price) /
                                      (pbl - orderOfferts[1].price))*100).toFixed(2)
                                    }</td>
                                    </tr>
                                </tbody>
                        </table>
                    </div>                 
                    `;
      
    } else {
      let validOffers = [...offers];
      const ofertaNoExcluida = validOffers.every((offer) => offer.price < pbl);
      // console.log(ofertaNoExcluida)

      if (ofertaNoExcluida) {
        const mean =
          validOffers.reduce((sum, offer) => sum + offer.price, 0) /
          validOffers.length;
        const ofertaNoSupera = validOffers.filter((o) => o.price <= mean * 1.1);
        const nuevaMedia =
          ofertaNoSupera.reduce((suma, offer) => suma + offer.price, 0) /
          ofertaNoSupera.length;
        const anormalBaja = nuevaMedia*0.90
        ;

        for (let offer of offers) {
          let isAB = offer.price <= nuevaMedia * 0.9;
          resultHTML += `
        <li class="list-group-item">${offer.name} : ${offer.price.toFixed(
            2
          )} --> ${
            isAB
              ? `<strong>En baja</strong> <p>El umbral de anormalidad es ${formatoMoneda(anormalBaja)}</p>`
              : "No baja"
          } </li>     
        `;
        }

        const ordenOfertas = validOffers.sort((a,b) => b.price - a.price)

        resultHTML += `
        <div class = "container mt-4">
            <table class = "table table-bordered text-center">
                <thead class ="table-light"
                    <tr>
                        <th>Empresa</th>
                        <th>Oferta</th>
                        <th>Puntuación</th>
                    </tr>
                </thead>
                <tbody>`
        for (let offer of ordenOfertas){
            const puntos= (((pbl - offer.price) / (pbl - ordenOfertas[ordenOfertas.length - 1].price))*100).toFixed(2) 
        resultHTML +=`
            <tr>
                <th class="table-light">${offer.name}</th>
                <td>${formatoMoneda(offer.price)}</td>
                <td>${puntos}</td>
            </tr>
        `;
        }

        resultHTML += `
                </tbody>
            </table>
        </div>
        `
        resultsDiv.innerHTML = resultHTML;

      }
    }
  } else {
    excesivasDiv.innerHTML = "";
    mayoresPBL.forEach((offer) => {
      excesivasDiv.innerHTML += `<p>La oferta de la empresa ${offer.name} está por encima del PBL. Elimínala o corrígela en su caso</p>`;
    });
  }

  resultHTML += "</ul>";
  resultsDiv.innerHTML = resultHTML;
});
