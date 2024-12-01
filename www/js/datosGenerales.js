//Imports
import { getUserLocal, getLocal, manejadorAPI, mostrarPreload, ocultarPreload, setNombreEmpresa, cerrarSesion } from "./general.js";
import { loadModal } from "./modal.js";
import { configTable } from "./dataTables/config-table.js";

// Variables globales
const $btnHome = $('#btn-menu-principal-home');

const $tabsUsuarios = $('#tabs-usuarios');

const $btnActualizarUsuario = $('#btn-actualizarUsuario');

const $loadSystem = $('.loadSystem');

//Select´s
const $id_area = $('#id_area');
const $id_rol = $('#id_rol');
const $id_estado_usuario = $('#id_estado_usuario');
const $id_turno = $('#id_turno');

//variables globales de los catalogos
let rol = ''
let estadoUsuario = ''
let turnoUsuario = '' 
let areasUsuario = ''
$(document).ready(async function () {
    let catalogos = ''
    mostrarPreload();
    //Setaemos el nombre de la empresa
    await setNombreEmpresa()    

    //Setear el nombre del usuario logeado
    const user = JSON.parse(localStorage.getItem("DataUser"));
    catalogos = JSON.parse(localStorage.getItem("Catalogos"));
    
    rol = catalogos["RolesUsuarios"];
    estadoUsuario = catalogos["EstadosUsuarios"]
    turnoUsuario =  catalogos["TurnosEmpresa"]
    areasUsuario =  catalogos["Areas"]
    
    let nombre = user.name;
    let mayus = nombre.toUpperCase(nombre);
    $("#nombreUser").text(mayus);
    //Seteamos los campos del usuario
    $("#name").val(mayus);
    $("#telefono").val(user.telefono);

    //Lenamos los selects
    $id_rol.append('<option selected value=""> Selecciona una opcion...</option>');
    $.each(rol, function (index, item) {
        if(item.id == user.id_rol){
            $id_rol.append(
                $('<option selected></option>').val(item.id).text(item.rol_usuario)
            );
        }else{
            $id_rol.append(
                $('<option></option>').val(item.id).text(item.rol_usuario)
            );
        }
    });

    $id_area.append('<option selected value=""> Selecciona una opcion...</option>');
    $.each(areasUsuario, function (index, item) {
        if(item.id == user.id_area){
            $id_area.append(
                $('<option selected></option>').val(item.id).text(item.nombre_area)
            );
        }else{
            $id_area.append(
                $('<option></option>').val(item.id).text(item.nombre_area)
            );
        }
    });
    
    $id_estado_usuario.append('<option selected value=""> Selecciona una opcion...</option>');
    $.each(estadoUsuario, function (index, item) {  
        if(item.id == user.id_estado_usuario){
            $id_estado_usuario.append(
                $('<option selected></option>').val(item.id).text(item.estado_usuario)
            );
        }else{
            $id_estado_usuario.append(
                $('<option></option>').val(item.id).text(item.estado_usuario)
            );
        }      
    });

    $id_turno.append('<option selected value=""> Selecciona una opcion...</option>');
    $.each(turnoUsuario, function (index, item) {    
        if(item.id == user.id_turno){
            $id_turno.append(
                $('<option selected></option>').val(item.id).text(item.turno)
            );
        }else{
            $id_turno.append(
                $('<option></option>').val(item.id).text(item.turno)
            );
        }    
    });

    ocultarPreload();
});

$btnHome.on('click', function() {
    window.location.href = "home.html"
});

$tabsUsuarios.on('click', 'li a', async (e) => {
    const btnEvent = e.currentTarget.innerText
    if (btnEvent == "Agregar") {
        mostrarPreload()
        $seccionConsultar.addClass('d-none');
        $seccionAgregar.removeClass('d-none');
        ocultarPreload()
    } else if (btnEvent == "Consultar") {
        mostrarPreload()
            $seccionAgregar.addClass('d-none');
            $seccionConsultar.removeClass('d-none');
        await getUsuarios()
        ocultarPreload()
    }
})

$btnActualizarUsuario.on('click', async function () {
    const dataUsuario = getUserLocal();
    
    //OBTENER FORMULARIO
    let name = $("#name").val();
    let id_area = $("#id_area").val();
    let id_estado_usuario = $("#id_estado_usuario").val();
    let id_rol = $("#id_rol").val();
    let telefono = $("#telefono").val();
    let id_turno = $("#id_turno").val();

    if(name == null || name == '' || name == undefined)
        {
            Toastify({
            text: "Ingresa el nombre del usuario",
            duration: 3000,
            backgroundColor: "#ec851f"
        }).showToast();
        $("#name").focus()
        return;
        }
    if(id_area == null || id_area == '' || id_area == undefined)
        {
            Toastify({
            text: "Selecciona el area del usuario!",
            duration: 3000,
            backgroundColor: "#ec851f"
        }).showToast();
        $("#id_area").focus()
        return;
        }
    
    if(id_estado_usuario == null || id_estado_usuario == '' || id_estado_usuario == undefined)
        {
            Toastify({
            text: "Selecciona el estado del usuario!",
            duration: 3000,
            backgroundColor: "#ec851f"
        }).showToast();
        $("#id_estado_usuario").focus()
        return;
        }
    if(id_rol == null || id_rol == '' || id_rol == undefined)
        {
            Toastify({
            text: "Selecciona el rol del usuario!",
            duration: 3000,
            backgroundColor: "#ec851f"
        }).showToast();
        $("#id_rol").focus()
        return;
        }
    if(telefono == null || telefono == '' || telefono == undefined)
        {
            Toastify({
            text: "Ingresa el telefono!",
            telefono: 3000,
            backgroundColor: "#ec851f"
        }).showToast();
        $("#telefono").focus()
        return;
        }
    if(id_turno == null || id_turno == '' || id_turno == undefined)
        {
            Toastify({
            text: "Selecciona el turno!",
            id_turno: 3000,
            backgroundColor: "#ec851f"
        }).showToast();
        $("#telefono").focus()
        return;
        }

    //FORMATO DE DATOS
    name = name.trim().toUpperCase();
    id_area = parseInt( id_area);
    id_estado_usuario = parseInt( id_estado_usuario);
    id_rol = parseInt( id_rol);
    telefono = parseInt( telefono);
    id_turno = parseInt( id_turno);

    //SET API
    const metodo = "POST";
    const url = "http://127.0.0.1:8000/api/updateUsuarios";
    const datosSetUsuario = {
        "usuario": dataUsuario,
        "datos" : {
            "name":name,
            "id_area":id_area,
            "id_estado_usuario":id_estado_usuario,
            "id_rol":id_rol,
            "telefono":telefono,
            "id_turno":id_turno,
        }
    }
    await $.ajax(
    {
    url : `${url}`,
    type: `${metodo}`,
    data : datosSetUsuario ? datosSetUsuario  : null,
    })
    .done(async function(data) {
        console.log(data);
        if(data == 1){
            //Actualizamos los datos el usuario logeado
            await $.ajax(
                {
                url : `http://127.0.0.1:8000/api/getUsuarioLogeado`,
                type: `POST`,
                data: dataUsuario
                })
                .done(async function(data) {
                    console.log("Respuesta logeado: ", data, "enviar ", dataUsuario);
                    localStorage.removeItem("DataUser")
                    localStorage.setItem("DataUser", JSON.stringify(data))
                    location.reload();
                })
                .fail(function(error) {            
                    Toastify({
                        text: `Ocurrió un error! ${error}`,
                        duration: 3000,
                        backgroundColor: "#f7dc6f"
                    }).showToast();
                })
        //Fin actualizacion del usuario logeado

            Toastify({
                text: "El Usuario se agregó con éxito",
                duration: 3000,
                backgroundColor: "#28b463"
            }).showToast();
        }else{
            Toastify({
                text: `Ocurrió un error! ${data}`,
                duration: 3000,
                backgroundColor: "#f7dc6f"
            }).showToast();
        }
    })
    .fail(function(error) {
        console.log("ERROR AJAX", error);
        
        Toastify({
            text: `Ocurrió un error! ${error}`,
            duration: 3000,
            backgroundColor: "#f7dc6f"
        }).showToast();
    })
});

async function getUsuarios() {
    mostrarPreload()
    const dataUser = getUserLocal();
    const catalogos = getLocal('Catalogos');
    
    let infoUsuarios = [];
    const urlGetUsuarios = 'http://127.0.0.1:8000/api/getUsuariosEmpresa';
    const datos = dataUser;
    const respUsuarios = await manejadorAPI('POST',urlGetUsuarios, datos);
    
    if (!respUsuarios) {
    }else{
        for (const usuario of respUsuarios) {
            let contenido = `
                <div class="card bg-light mb-1">
                    <div class="card-header fw-bold colorApp text-white">${usuario.name}</div>
                    <div class="card-body">
                        <ul>
                            <li class="fw-bold p-0 m-0"><div class="row"><div class="col-6"><label class="fw-bold">Correo</label></div><div class="col-6"><h6>${usuario.email}</h6></div></li>
                            <li class="fw-bold p-0 m-0"><div class="row"><div class="col-6"><label class="fw-bold">Nombre</label></div><div class="col-6"><h6>${usuario.name}</h6></div></li>
                            <li class="fw-bold p-0 m-0"><div class="row"><div class="col-6"><label class="fw-bold">Telefono</label></div><div class="col-6"><h6>${usuario.telefono}</h6></div></></li>
                        </ul>
                    </div>
                </div>
            `;
            infoUsuarios.push([contenido])
        }
    }
    
    tablaUsuarios.clear();
    tablaUsuarios.rows.add(infoUsuarios);
    tablaUsuarios.draw();

    ocultarPreload()
}
