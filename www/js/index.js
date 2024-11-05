//Imports
import { getUserLocal, removeLocal } from "./general.js";

$(document).ready(function(){
    cerrarSesion();
    setTimeout(() => {
        location.href = "login.html";
    }, 2500);
});


function cerrarSesion(){
    try {
        removeLocal('DataUser');
        removeLocal('Catalogos');
        removeLocal('Provedores');
        removeLocal('EstatusProductos');
        removeLocal('Empresa');
        removeLocal('Estados_usuarios');
        removeLocal('Estatus_usuarios');
        removeLocal('Roles_usuarios');
        removeLocal('Areas_usuario');
        removeLocal('Categorias');
        removeLocal('Turnos');
        removeLocal('Rol_Usuario');
    } catch (error) {
        console.log("ERROR: ", error);
        
    }
}
