//Imports
import { getUserLocal, getLocal, manejadorAPI, mostrarPreload, ocultarPreload, setNombreEmpresa, cerrarSesion, removeLocal } from "./general.js";
import { loadModal } from "./modal.js";
import { configTable } from "./dataTables/config-table.js";

// Variables globales
const $btnHome = $('#btn-menu-principal-home');

const $tabsTurnos = $('#tabs-turnos');

const $seccionAgregar = $('#section-agregarTurnos');
const $seccionConsultar = $('#section-consultarTurnos');

const $btnAgregarTurno = $('#btn-agregarTurno');

const $loadSystem = $('.loadSystem');
//Flojo cerrar sesion
const $btn_userLogin = $('#btn-userLogin');
const $btn_cerrarSesion = $('#btn-cerrarSesion');
const $modal_cerrarSesion = $('#modal-cerrarSesion');
const $opciones = $("#opcionsPagos");

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


    //Validamos si existe un turno abierto 
    const urlTurno = 'http://127.0.0.1:8000/api/validaTurno';
    const datosTurno = userData;
    console.log("Datos del usuario: ", datosTurno);
    
    const respTurno = await manejadorAPI(metodo,urlTurno, datosTurno)
    removeLocal('turnoActivo');
    localStorage.setItem('turnoActivo', JSON.stringify(respTurno));
    
    $opciones.empty()
    let op = ''
    let activo = ""
    $.each(respTurno, function (index, item) {

        if(item.estatus == 1){
            activo = "checked"
        }else{
            activo = ""
        }
        console.log(index, item, item.tipo_pago, item.estatus, activo);
        
        op += `<div class="col-4">
                    <div class="form-check">
                        <input class="form-check-input" type="checkbox" value="${item.id}" ${activo} onchange="actualizaOpcion(${item.id})">
                        <label class="form-check-label" for="defaultCheck1">
                            ${item.tipo_pago}
                        </label>
                    </div>
                </div>`;
    });
    $opciones.append(op);
    ocultarPreload();
});

$btnHome.on('click', function() {
    window.location.href = "home.html"
});

$tabsTurnos.on('click', 'li a', async (e) => {
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
        await getTurnos()
        ocultarPreload()
    }
})

$btnAgregarTurno.on('click', async function () {
    const dataUsuario = getUserLocal();
    
    //OBTENER FORMULARIO
    let turno = $("#turno").val();
    let hora_inicio = $("#hora_inicio").val();
    let hora_fin = $("#hora_fin").val();
    
    if(turno == null || turno == '' || turno == undefined)
        {
            Toastify({
            text: "Ingresa el nombre del Turno",
            duration: 3000,
            backgroundColor: "#ec851f"
        }).showToast();
        $("#name").focus()
        return;
        }
    if(hora_inicio == null || hora_inicio == '' || hora_inicio == undefined)
        {
            Toastify({
            text: "Ingresa la hora de inicio!",
            duration: 3000,
            backgroundColor: "#ec851f"
        }).showToast();
        $("#correo").focus()
        return;
        }
    if(hora_fin == null || hora_fin == '' || hora_fin == undefined)
        {
            Toastify({
            text: "Ingresa la hora e fin!",
            duration: 3000,
            backgroundColor: "#ec851f"
        }).showToast();
        $("#password").focus()
        return;
        }
        

    //FORMATO DE DATOS
    turno = turno.trim().toUpperCase();

    //SET API
    const metodo = "POST";
    const url = "http://127.0.0.1:8000/api/setTurnos";
    const datosSetTurno = {
        "usuario": dataUsuario,
        "turno" : {
            "turno":turno,
            "hora_inicio":hora_inicio,
            "hora_fin":hora_fin,
        }
    }
    console.log("datos: ", datosSetTurno);
    
    await $.ajax(
    {
    url : `${url}`,
    type: `${metodo}`,
    data : datosSetTurno ? datosSetTurno  : null,
    })
    .done(function(data) {        
        if(data == 1){
            Toastify({
                text: "El Turno se agregó con éxito",
                duration: 3000,
                backgroundColor: "#28b463"
            }).showToast();

            $("#turno").val("");
            $("#hora_inicio").val("");
            $("#hora_fin").val("");

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

async function getTurnos() {
    mostrarPreload()
    const dataUser = getUserLocal();
    let infoTurnos = [];
    const urlGetTurnos = 'http://127.0.0.1:8000/api/getTurnoUsuario';
    const datos = dataUser;
    const respTurnos = await manejadorAPI('POST',urlGetTurnos, datos);
    
    if (!respTurnos) {
    }else{
        for (const turnos of respTurnos) {
            let contenido = `
                <div class="card bg-light mb-1">
                    <div class="card-header fw-bold cardTurnos">${turnos.turno}</div>
                    <div class="card-body">
                        <ul>
                            <li class="fw-bold p-0 m-0"><div class="row"><div class="col-6"><label class="fw-bold">Fecha Inicio</label></div><div class="col-6"><h6>${turnos.hora_inicio}</h6></div></li>
                            <li class="fw-bold p-0 m-0"><div class="row"><div class="col-6"><label class="fw-bold">Fecha Fin</label></div><div class="col-6"><h6>${turnos.hora_fin}</h6></div></li>
                        </ul>
                    </div>
                </div>
            `;
            infoTurnos.push([contenido])
        }
    }
    
    tablaTurnos.clear();
    tablaTurnos.rows.add(infoTurnos);
    tablaTurnos.draw();
    $(".cardTurnos").addClass("bg-btn-primario");
    ocultarPreload()
}
$btn_userLogin.click(()=>{ 
    $modal_cerrarSesion.modal('show');
});

$btn_cerrarSesion.click(()=>{
    cerrarSesion()
});
