//Imports
import { getUserLocal, getLocal, manejadorAPI, mostrarPreload, ocultarPreload, setNombreEmpresa } from "./general.js";
import { loadModal } from "./modal.js";
import { configTable } from "./dataTables/config-table.js";

// Variables globales
const $btnHome = $('#btn-menu-principal-home');
const $btnBack = $('#btn-menu-principal-back');

const $tabsUsuarios = $('#tabs-usuarios');

const $seccionAgregar = $('#section-agregarUsuarios');
const $seccionConsultar = $('#section-consultarUsuarios');

const $btnAgregarUsuario = $('#btn-agregarUsuario');

const $loadSystem = $('.loadSystem');

//Select´s
const $id_turno = $('#id_turno');
const $id_area = $('#id_area');
const $id_estado_usuario = $('#id_estado_usuario');
const $id_rol = $('#id_rol');

//Tables
const tablaUsuarios = $("#tablausuarios").DataTable(configTable);
$(document).ready(async function () {
    mostrarPreload();
    //Setaemos el nombre de la empresa
    await setNombreEmpresa()    

    const userData = getUserLocal();
    const metodo = 'POST';
    
    //Categorias
    const urlTurno = 'https://abonos.sipecem.com.mx/api/getTurnoUsuario';
    const datosTurno = userData;
    
    const respTurno = await manejadorAPI(metodo,urlTurno, datosTurno)
    localStorage.setItem('Turnos', JSON.stringify(respTurno));

    $.each(respTurno, function (index, item) {
        $id_turno.append(
            $('<option></option>').val(item.id).text(item.turno)
        );
    });

    const urlAreas = 'https://abonos.sipecem.com.mx/api/getAreasApi';
    const datosAreas = userData;
    
    const respAreas = await manejadorAPI(metodo,urlAreas, datosAreas)
    localStorage.setItem('Areas_usuario', JSON.stringify(respAreas.Areas));

    $.each(respAreas.Areas, function (index, item) {
        $id_area.append(
            $('<option></option>').val(item.id).text(item.nombre_area)
        );
    });

    const urlEstados = 'https://abonos.sipecem.com.mx/api/getEstatusUsuarios';
    const datosEstados = userData;
    
    const respEstados = await manejadorAPI(metodo,urlEstados, datosEstados)
    localStorage.setItem('Estados_usuarios', JSON.stringify(respEstados));
    
    $.each(respEstados, function (index, item) {
        $id_estado_usuario.append(
            $('<option></option>').val(item.id).text(item.estado_usuario)
        );
    });

    const urlRol = 'https://abonos.sipecem.com.mx/api/getRolUsuarios';
    const datosRol = userData;
    
    const respRol = await manejadorAPI("GET",urlRol, datosRol)
    localStorage.setItem('Roles_usuarios', JSON.stringify(respRol));

    $.each(respRol, function (index, item) {
        $id_rol.append(
            $('<option></option>').val(item.id).text(item.rol_usuario)
        );
    });
    
    ocultarPreload();
});

$btnHome.on('click', function() {
    window.location.href = "home.html"
});

$btnBack.on('click', function() {
    history.back()
});

$tabsUsuarios.on('click', 'li a', async (e) => {
    mostrarPreload()
    const btnEvent = e.currentTarget.innerText
    if (btnEvent == "Agregar") {
        $seccionConsultar.addClass('d-none');
        $seccionAgregar.removeClass('d-none');
        ocultarPreload()
    } else if (btnEvent == "Consultar") {
            $seccionAgregar.addClass('d-none');
            $seccionConsultar.removeClass('d-none');
        await getUsuarios()
    }
})

$btnAgregarUsuario.on('click', async function () {
    const dataUsuario = getUserLocal();
    
    //OBTENER FORMULARIO
    let name = $("#name").val();
    let correo = $("#correo").val();
    let password = $("#password").val();
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
    if(correo == null || correo == '' || correo == undefined)
        {
            Toastify({
            text: "Ingresa el correo!",
            duration: 3000,
            backgroundColor: "#ec851f"
        }).showToast();
        $("#correo").focus()
        return;
        }
    if(password == null || password == '' || password == undefined)
        {
            Toastify({
            text: "Ingresa la contraseña!",
            duration: 3000,
            backgroundColor: "#ec851f"
        }).showToast();
        $("#password").focus()
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

    
    const empresa = dataUsuario.id_empresa;

    //FORMATO DE DATOS
    name = name.trim().toUpperCase();
    correo = correo.trim().toLowerCase();
    id_area = parseInt( id_area);
    id_estado_usuario = parseInt( id_estado_usuario);
    id_rol = parseInt( id_rol);
    telefono = parseInt( telefono);
    id_turno = parseInt( id_turno);

    //SET API
    const metodo = "POST";
    const url = "https://abonos.sipecem.com.mx/api/registraUsuario";
    const datosSetUsuario = {
        "usuario": dataUsuario,
        "datos" : {
            "name":name,
            "correo":correo,
            "password":password,
            "id_area":id_area,
            "id_estado_usuario":id_estado_usuario,
            "id_rol":id_rol,
            "telefono":telefono,
            "id_turno":id_turno,
        }
    }
    console.log(datosSetUsuario);
    
    await $.ajax(
    {
    url : `${url}`,
    type: `${metodo}`,
    data : datosSetUsuario ? datosSetUsuario  : null,
    })
    .done(function(data) {
        console.log(data);
        
        if(data == 1){
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
    const urlGetUsuarios = 'https://abonos.sipecem.com.mx/api/getUsuariosEmpresa';
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
