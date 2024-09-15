//Imports



// Variables globales
const $btnHome = $('#btn-menu-principal-home');
const $btnBack = $('#btn-menu-principal-back');
const $btnCatalogos = $('#btn-catalogos');
const $btnProvedores = $('#btn-provedores');

$(document).ready(function(){
    //Setaemos el nombre de la empresa
    const empresa = localStorage.getItem("Empresa");
    let nombre = empresa.replace(/["']/g, "")
    let mayus = nombre.toUpperCase(nombre);
    $("#nombreEmpresa").text(mayus);
});
$btnHome.click(()=>{
    window.location.href = "home.html"
});

$btnBack.click(()=>{
    console.log("Click on btn back");
    
    history.back();
});

$btnCatalogos.on('click','div', (e)=>{
    const btnEvent = e.currentTarget.innerText
    switch (btnEvent) {
        case 'INSUMOS':
            window.location.href = "insumos.html";
            break;
        case 'PRODUCTOS':
            window.location.href = "productos.html";
            break;
        case 'PROVEEDORES':
            window.location.href = "provedores.html";
            break;
        case 'COMPRAS':
            
            break;
        case 'REPORTES':
            
            break;
    
        default:
            break;
    }
    
});