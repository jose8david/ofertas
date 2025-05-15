// Declaración de variables con los elementos principales del HTML
const numOffersInput = document.getElementById("numOffers")
const offersContainer = document.getElementById("offersContainer")
const offerForm = document.getElementById("offerForm")
const resultsDiv = document.getElementById("results")

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