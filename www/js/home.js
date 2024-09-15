//imports

import { getEmpresa, getUserLocal, removeLocal } from "./general.js";

//variables
const $btn_userLogin = $('#btn-userLogin');
const $btn_cerrarSesion = $('#btn-cerrarSesion');
const $modal_cerrarSesion = $('#modal-cerrarSesion');
const $btnMenu = $('#menu-events');
const empresas = getEmpresa()

$(document).ready(async function(){
    //Setaemos el nombre de la empresa
    const empresa =await  localStorage.getItem("Empresa");
    let nombre =await empresa.replace(/["']/g, "")
    let mayus = await nombre.toUpperCase(nombre);
    $("#nombreEmpresa").text(mayus);
});
document.getElementById('btn-catalogo').addEventListener('click', ()=>{
    window.location.href = "catalogos.html"
});

document.getElementById('btn-insumos').addEventListener('click', ()=>{
    window.location.href = "insumos.html"
});
document.getElementById('btn-productos').addEventListener('click', ()=>{
    window.location.href = "productos.html"
});
document.getElementById('btn-provedores').addEventListener('click', ()=>{
    window.location.href = "provedores.html"
});




$btn_userLogin.click(()=>{
    $modal_cerrarSesion.modal('show');
});

$btn_cerrarSesion.click(()=>{
    const user = getUserLocal()
    if (user == false) {
    } else {
        removeLocal('DataUser');
        removeLocal('Catalogos');
        removeLocal('Provedores');
        removeLocal('EstatusProductos');
        removeLocal('Empresa');

        window.location.href = '../index.html';
    }
});