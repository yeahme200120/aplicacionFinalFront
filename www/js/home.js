//imports

import { getEmpresa, getUserLocal, removeLocal, mostrarPreload, ocultarPreload, setNombreEmpresa, cerrarSesion } from "./general.js";
//variables
const $btn_userLogin = $('#btn-userLogin');
const $btn_cerrarSesion = $('#btn-cerrarSesion');
const $modal_cerrarSesion = $('#modal-cerrarSesion');
const $btnMenu = $('#menu-events');
const empresas = getEmpresa()
const $loadSystem = $('.loadSystem');

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
document.getElementById('btn-configuraciones').addEventListener('click', ()=>{
    window.location.href = "configuraciones.html"
});

$btn_userLogin.click(()=>{
    console.log("Cerrar");
    
    $modal_cerrarSesion.modal('show');
});

$btn_cerrarSesion.click(()=>{
    cerrarSesion()
});