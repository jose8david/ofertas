// Declaración de variables con los elementos principales del HTML
const numOffersInput = document.getElementById("numOffers")
const offersContainer = document.getElementById("offersContainer")
const offerForm = document.getElementById("offerForm")
const resultsDiv = document.getElementById("results")
const excesivasDiv = document.getElementById("excesivas") 

// Generar las entradas para que el usuario introduzca el nombre de la empresa y el importe de su oferta

numOffersInput.addEventListener("change", ()=>{
    const num = parseInt(numOffersInput.value)
    for(let i = 0; i < num; i++){
        offersContainer.innerHTML +=`
        
        <div class="mb-3"> 
            <label class = "form-label"> Empresa ${i+1}</label>
            <input type="text" class="form-control mb-2" name="name${i}" placeholder="Nombre de la empresa" required>
            <input type="number" class="form-control" name="price${i}" placeholder="Introduce la oferta sin IVA" required>     
        </div>
        `
    }
})

offerForm.addEventListener("submit", (e) =>{
    e.preventDefault()
    resultsDiv.innerHTML=""

    const pbl = parseFloat(document.getElementById("pbl").value);
    const num = parseInt(numOffersInput.value)
    const offers = []

    // Array con el nombre de la empresa y el precio ofertado
    for(let i = 0; i < num; i++){
        const name = document.querySelector(`[name=name${i}]`).value.trim()
        const price = parseFloat(document.querySelector(`[name=price${i}]`).value)
        offers.push({name, price})
    }

    let resultHTML = "<h3>Resultados:</h3><ul class='list-group'>"

    for(let i= 0; i < offers.length; i++){

        if(offers[i].price >= pbl){
            excesivasDiv.innerHTML += `
            <p>La oferta de la empresa ${offers[i].name} está por encima del PBL</p>
            `

        }

    }

    if(num===1){
        const offer = offers[0]
        const isAB = offer.price < 0.75 * pbl
        resultHTML += `<li class='list-group-item'>${offer.name} : ${offer.price.toFixed(2)} € → ${isAB ? "<strong>AB</strong>" : "No AB"}</li> `
    } else if (num===2){
        const sorted = offers.sort((a,b)=>{b.price - a.price})
        const isAB = sorted[1].price < 0.80 * sorted[0].price
                resultHTML += `<li class="list-group-item">${sorted[0].name}: ${sorted[0].price.toFixed(2)} € → No AB</li>`;
        resultHTML += `<li class="list-group-item">${sorted[1].name}: ${sorted[1].price.toFixed(2)} € → ${isAB ? "<strong>AB</strong>" : "No AB"}</li>`;
      } else {
        let validOffers = [...offers];
        let mean = validOffers.reduce((sum, o) => sum + o.price, 0) / validOffers.length;

        const filtered = validOffers.filter(o => o.price <= mean * 1.1);
        if (filtered.length < validOffers.length) {
          mean = filtered.reduce((sum, o) => sum + o.price, 0) / filtered.length;
        }

        for (let offer of offers) {
          const isAB = offer.price < 0.90 * mean;
          resultHTML += `<li class="list-group-item">${offer.name}: ${offer.price.toFixed(2)} € → ${isAB ? "<strong>AB</strong>" : "No AB"}</li>`;
        }
      }

      resultHTML += "</ul>";
      resultsDiv.innerHTML = resultHTML;



})