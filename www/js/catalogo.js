//Imports

import { getEmpresa, getUserLocal, removeLocal, mostrarPreload, ocultarPreload, setNombreEmpresa, cerrarSesion } from "./general.js";

// Variables globales
const $btnHome = $('#btn-menu-principal-home');
const $btnCatalogos = $('#btn-catalogos');
const $btnProvedores = $('#btn-provedores');

const $btn_userLogin = $('#btn-userLogin');
const $btn_cerrarSesion = $('#btn-cerrarSesion');
const $modal_cerrarSesion = $('#modal-cerrarSesion');

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
$btn_userLogin.click(()=>{ 
    $modal_cerrarSesion.modal('show');
});

$btn_cerrarSesion.click(()=>{
    cerrarSesion()
});