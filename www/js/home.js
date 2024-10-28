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
    const empresa =await localStorage.getItem("Empresa");
    
    let nombre =empresa.replace(/["']/g, "")
    let mayus = nombre.toUpperCase(nombre);
    $("#nombreEmpresa").text(mayus);
    
    $('#btn-catalogo').click(function(){
        window.location.href = "catalogos.html"
    });
    $('#btn-productos').click(function(){
        window.location.href = "productos.html"
    });
    $('#btn-configuraciones').click(function(){
        window.location.href = "configuraciones.html"
    });

    $('#btn-usuarios').click(async function(){
        //Get Roles de }
        try {
            $(".loadSystem").modal('show');
        } catch (error) {
            console.log("Error: ", error);
            
        }
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
    $('#btn-mi-perfil').click(async function(){
        //Get Roles de }
        try {
            $(".loadSystem").modal('show');
        } catch (error) {
            console.log("Error: ", error);
            
        }
            window.location.href = "miPerfil.html"
    });
    $('#btn-impresoras').click( async function(){
        try {
            /* mostrarDispositivos()
            comprobarStatusBluethooth()
            conectarImpresora()
            impresoraConectada()
            desconectarImpresora()
            codificacionTexto()
            imprimirSimple()
            formatTexto()
            imprimirImgen64()
            tituloFormat()
            impresioPV()
            imprimirQR()
            imprimirBarras() 
            imprimirSeparador()  */  
            conectDevice()
            conectDeviceMoment()
            imprimir()
        } catch (error) {
            alert(error)
        }
    });

    $btn_userLogin.click(()=>{
        console.log("Cerrar");
        
        $modal_cerrarSesion.modal('show');
    });
    
    $btn_cerrarSesion.click(()=>{
        cerrarSesion()
    });
});