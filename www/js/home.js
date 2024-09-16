//imports

import { getEmpresa, getUserLocal, removeLocal, mostrarPreload, ocultarPreload, setNombreEmpresa } from "./general.js";
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
document.getElementById('btn-insumos').addEventListener('click', ()=>{
    window.location.href = "insumos.html"
});
document.getElementById('btn-productos').addEventListener('click', ()=>{
    window.location.href = "productos.html"
});
document.getElementById('btn-provedores').addEventListener('click', async ()=>{
    let url = 'https://abonos.sipecem.com.mx/api/getCategoriasApi'
    let datos = localStorage.getItem("DataUser") ? localStorage.getItem("DataUser") : 0;
    await $.ajax(
        {
        url : `${url}`,
        type: `POST`,
        data : datos ? JSON.parse(datos)  : null,
        })
        .done(async function(data) {
            localStorage.setItem("Categorias", JSON.stringify(data.Categorias))
            window.location.href = "provedores.html"
        })
        .fail(function(error) {
            console.log("Respuesta fail: ",error);
            Toastify({
                text: `Ocurrió un error! ${respuesta}`,
                duration: 3000,
                backgroundColor: "#f7dc6f"
            }).showToast();
        })
});
document.getElementById('btn-usuarios').addEventListener('click', async ()=>{
    //Get Roles de usuario
    await $.ajax(
        {
        url : `https://abonos.sipecem.com.mx/api/getRolUsuarios`,
        type: `GET`,
        })
        .done(async function(data) {
            localStorage.setItem("Rol_Usuario", JSON.stringify(data))
        })
        .fail(function(error) {            
            Toastify({
                text: `Ocurrió un error! ${respuesta}`,
                duration: 3000,
                backgroundColor: "#f7dc6f"
            }).showToast();
        })

    let url = 'https://abonos.sipecem.com.mx/api/getTurnoUsuario'
    let datos = localStorage.getItem("DataUser") ? localStorage.getItem("DataUser") : 0;
    await $.ajax(
        {
        url : `${url}`,
        type: `POST`,
        data : datos ? JSON.parse(datos)  : null,
        })
        .done(async function(data) {
            localStorage.setItem("Turnos", JSON.stringify(data))
            
        })
        .fail(function(error) {
            Toastify({
                text: `Ocurrió un error! ${respuesta}`,
                duration: 3000,
                backgroundColor: "#f7dc6f"
            }).showToast();
        })

        let url2 = 'https://abonos.sipecem.com.mx/api/getEstatusUsuarios'
        await $.ajax(
            {
            url : `${url2}`,
            type: `POST`,
            data : datos ? JSON.parse(datos)  : null,
            })
            .done(async function(data) {
                localStorage.setItem("Estatus_usuarios", JSON.stringify(data))
                
            })
            .fail(function(error) {
                Toastify({
                    text: `Ocurrió un error! ${respuesta}`,
                    duration: 3000,
                    backgroundColor: "#f7dc6f"
                }).showToast();
            })
        window.location.href = "usuarios.html"
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