//Imports
import { getUserLocal, getLocal, manejadorAPI, mostrarPreload, ocultarPreload, setNombreEmpresa, cerrarSesion, removeLocal } from "./general.js";
import { loadModal } from "./modal.js";
import { configTable } from "./dataTables/config-table.js";

// Variables globales
const $color = $('.colorGlobal');

const $tabsTurnos = $('#tabs-turnos');

const $seccionAgregar = $('#section-agregarTurnos');
const $seccionConsultar = $('#section-consultarTurnos');

const $btnAgregarTurno = $('#btn-agregarTurno');

const $loadSystem = $('.loadSystem');
//Flojo cerrar sesion
const $btn_userLogin = $('#btn-userLogin');
const $btn_cerrarSesion = $('#btn-cerrarSesion');
const $modal_cerrarSesion = $('#modal-cerrarSesion');

//Tables
const tablaTurnos = $("#tablaTurnos").DataTable(configTable);
$(document).ready(async function () {
    mostrarPreload();
    //Setaemos el nombre de la empresa
    await setNombreEmpresa()    

    const userData = getUserLocal();
    const metodo = 'POST';
    
    //Setear el nombre del usuario logeado
    const user =JSON.parse(localStorage.getItem("DataUser"));
    let nombre = user.name;
    let mayus = nombre.toUpperCase(nombre);
    $("#nombreUser").text(mayus);


    //Categorias
    const urlTurno = 'http://127.0.0.1:8000/api/getTurnoUsuario';
    const datosTurno = userData;
    
    const respTurno = await manejadorAPI(metodo,urlTurno, datosTurno)
    removeLocal('Turnos');
    localStorage.setItem('Turnos', JSON.stringify(respTurno));
  
    ocultarPreload();
});
$color.change(function(){
    let color = $(".colorGlobal").val()
    console.log(color);
    localStorage.removeItem("ColorGlobal")
    localStorage.setItem("ColorGlobal", JSON.stringify(color))
    $(":root").css(`--bg-principal`, color)
})