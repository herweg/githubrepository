const ORDER_ASC_BY_PRICE = "AZ";
const ORDER_DESC_BY_PRICE = "ZA";
const ORDER_BY_PROD_COUNT = "Cant.";
var currentCategoriesArray = [];
var currentSortCriteria = undefined;
var minCount = undefined;
var maxCount = undefined;

function sortProducts(criteria, array) {
    let result = [];

    //Criterios por precio y relevancia
    if (criteria === ORDER_ASC_BY_PRICE) {
        result = array.sort(function (a, b) {
            if (a.cost < b.cost) { return -1; }
            if (a.cost > b.cost) { return 1; }
            return 0;
        });
    } else if (criteria === ORDER_DESC_BY_PRICE) {
        result = array.sort(function (a, b) {
            if (a.cost > b.cost) { return -1; }
            if (a.cost < b.cost) { return 1; }
            return 0;
        });
    } else if (criteria === ORDER_BY_PROD_COUNT) {
        result = array.sort(function (a, b) {
            let aCount = parseInt(a.soldCount);
            let bCount = parseInt(b.soldCount);

            if (aCount > bCount) { return -1; }
            if (aCount < bCount) { return 1; }
            return 0;
        });
    }

    return result;
};

function showProductsList() {

    let agregaHTML = "";

    for (let i = 0; i < currentCategoriesArray.length; i++) {
        let producto = currentCategoriesArray[i];

        //Compara mincount(value) vs product.cost
        if (((minCount == undefined) || (minCount != undefined && parseInt(producto.cost) >= minCount)) &&
            ((maxCount == undefined) || (maxCount != undefined && parseInt(producto.cost) <= maxCount))) {

            agregaHTML += `
            <div class="col-md-4">
              <a href="product-info.html" class="card mb-4 custom-card">
                <img src="` + producto.imgSrc + `" alt="` + producto.description + `">
                <h3 class="m-3">`+ producto.name + `</h3>
                <div class="card-body">
                  <p class="card-text">` + producto.description + `</p>
                  <p class="card-text">` + producto.currency + ": " + producto.cost + `</p>
                  <small class="text-muted">` + producto.soldCount + ` artículos</small>
                </div>
              </a>
            </div>
            `
        }

        document.getElementById("lista-productos").innerHTML = agregaHTML;
    }
};

function sortAndShowProducts(sortCriteria, categoriesArray) {

    currentSortCriteria = sortCriteria;

    if (categoriesArray != undefined) {
        currentCategoriesArray = categoriesArray;
    }

    currentCategoriesArray = sortProducts(currentSortCriteria, currentCategoriesArray);

    //Muestro las categorías ordenadas
    showProductsList();
};

//Función que se ejecuta una vez que se haya lanzado el evento de
//que el documento se encuentra cargado, es decir, se encuentran todos los
//elementos HTML presentes.
document.addEventListener("DOMContentLoaded", function (e) {
    getJSONData(PRODUCTS_URL).then(function (resultObj) {
        if (resultObj.status === "ok") {
            sortAndShowProducts(ORDER_ASC_BY_PRICE, resultObj.data);
        }
    });

    document.getElementById("sortAsc").addEventListener("click", function () {
        sortAndShowProducts(ORDER_ASC_BY_PRICE);
    });

    document.getElementById("sortDesc").addEventListener("click", function () {
        sortAndShowProducts(ORDER_DESC_BY_PRICE);
    });

    document.getElementById("sortByCount").addEventListener("click", function () {
        sortAndShowProducts(ORDER_BY_PROD_COUNT);
    });

    //Boton filtrar por precio
    document.getElementById("rangoFiltrar").addEventListener("click", function () {
        //Obtengo los valores mínimo y máximo ingresados
        minCount = document.getElementById("rangoPrecioMin").value;
        maxCount = document.getElementById("rangoPrecioMax").value;

        //Verificacion de que minCount y maxCount son enteros
        if ((minCount != undefined) && (minCount != "") && (parseInt(minCount)) >= 0) {
            minCount = parseInt(minCount);
        }
        else {
            minCount = undefined;
        }

        if ((maxCount != undefined) && (maxCount != "") && (parseInt(maxCount)) >= 0) {
            maxCount = parseInt(maxCount);
        }
        else {
            maxCount = undefined;
        }
        //Muestra la lista de productos
        showProductsList();
    });


    //Boton borrar filtro
    document.getElementById("rangoLimpiar").addEventListener("click", function () {
        document.getElementById("rangoPrecioMin").value = "";
        document.getElementById("rangoPrecioMax").value = "";

        minCount = undefined;
        maxCount = undefined;
    });
});
/*
//////////////////////
//Mi propio buscador//
//////////////////////

*/