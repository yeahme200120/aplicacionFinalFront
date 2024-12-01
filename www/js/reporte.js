//Imports
import { getUserLocal, getLocal, manejadorAPI, mostrarPreload, ocultarPreload, setNombreEmpresa, cerrarSesion } from "./general.js";
import { loadModal } from "./modal.js";
import { configTable } from "./dataTables/config-table.js";

// Variables globales
const $btnHome = $('#btn-menu-principal-home');
const btnConfirm = $("#btn-confirm-mov");

const $tabsUsuarios = $('#tabs-usuarios');

const $seccionAgregar = $('#section-agregarUsuarios');
const $seccionConsultar = $('#section-consultarUsuarios');
const $cuerpoTabla = $("#cuerpoTablaMovimiento");

//Campos a mostrar 
const $cardTotal = $("#cardTotal")
const $cardIngreso = $("#cardIngreso")
const $cardEgreso = $("#cardEgreso")


//Select´s
const $id_turno = $('#id_turno');
const $id_area = $('#id_area');
const $id_estado_usuario = $('#id_estado_usuario');
const $id_rol = $('#id_rol');

//Tables
const tablaUsuarios = $("#tablausuarios").DataTable(configTable);
$(document).ready(async function () {
    mostrarPreload()
    $('.table-movimientos').DataTable(
        {
            dom: 'Bfrtip',
            "info": false,
            searching: false,
            paging: false,
            buttons: [
                {
                    extend: 'excel',
                    footer: true,
                    title: 'Archivo',
                    filename: 'Export_File',

                    //Aquí es donde generas el botón personalizado
                    text: '<button class="btn btn-success"><i class="fas fa-file-excel"></i></button>'
                },
                {
                    extend: 'pdf',
                    footer: true,
                    title: 'Archivo PDF',
                    filename: 'Export_File_pdf',
                    text: '<a class="btn btn-danger bg-none" ><i class="far fa-file-pdf"></i></a>'
                }
            ],
            layout: {
                topStart: 'a'
            }

        },
    );
    //Setaemos el nombre de la empresa
    await setNombreEmpresa()

    const userData = getUserLocal();
    const metodo = 'POST';

    //Categorias
    const urlMovimientos = 'http://127.0.0.1:8000/api/getMovimientos';
    const datosMovimientos = {"usuario":userData};

    const respMovimientos = await manejadorAPI(metodo, urlMovimientos, datosMovimientos)
    localStorage.setItem('Turnos', JSON.stringify(respMovimientos));
    let sumaIngresos = 0
    let sumaEgresos = 0
    let total = 0
    let html = ''
    $cardTotal.empty()
    $cardIngreso.empty()
    $cardEgreso.empty()

    $.each(respMovimientos, function (index, item) {
        console.log("Index: ", index, " Item: ", item);

        
        if(item['tipo_movimiento'] == 1){
            sumaIngresos += item['cantidad']
        }
        
        if(item['tipo_movimiento'] == 2){
            sumaEgresos += item['cantidad']
        }

        $cuerpoTabla.empty()
        html += "<tr>"+
        "<td>"+item['movimiento']+"</td>"+
        "<td class='text-center'>"+item['cantidad']+"</td>"+
      "</tr>";
    });
    $cardIngreso.text(sumaIngresos)
    $cardEgreso.text(sumaEgresos)
    $cardTotal.text(total)

    $cuerpoTabla.append(html);

    ocultarPreload()
});

$btnHome.on('click', function () {
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

btnConfirm.on('click', async function () {
    //Obtenemos el usuario logueado
    const dataUsuario = getUserLocal();
    //Recoleccion de datos del formulario
    let movimiento = $("#movimiento").val()
    let descripcion = $("#descripcion").val()
    let tipo_movimiento = $("#tipo_movimiento").val()
    let cantidad = $("#cantidad").val()
    //Validamos que no vengan vacios los campos
    if (!movimiento || movimiento == '' || movimiento == null) { }
    if (!descripcion || descripcion == '' || descripcion == null) { }
    if (!tipo_movimiento || tipo_movimiento == '' || tipo_movimiento == null) { }
    if (!cantidad || cantidad == '' || cantidad == null) { }

    movimiento = movimiento.trim().toUpperCase()
    descripcion = descripcion.trim().toUpperCase()
    tipo_movimiento = parseInt(tipo_movimiento)
    cantidad = parseFloat(cantidad)
    //Definimos la configuracion de la peticion
    const metodo = "POST";
    const url = "http://127.0.0.1:8000/api/setMovimiento";
    const datosSetUsuario = {
        "usuario": dataUsuario,
        "movimiento": {
            "movimiento": movimiento,
            "descripcion": descripcion,
            "tipo_movimiento": tipo_movimiento,
            "cantidad": cantidad,
        }
    }
    //Ejecucion de la petion api
    await $.ajax(
        {
            url: `${url}`,
            type: `${metodo}`,
            data: datosSetUsuario ? datosSetUsuario : null,
        })
        .done(function (data) {
            console.log(data);

            if (data == 1) {
                Toastify({
                    text: "El Movimiento se registró con éxito",
                    duration: 3000,
                    backgroundColor: "#28b463"
                }).showToast(); 
                limpiarModal();
            } else {
                Toastify({
                    text: `Ocurrió un error! ${data}`,
                    duration: 3000,
                    backgroundColor: "#f7dc6f"
                }).showToast();
            }
        })
        .fail(function (error) {
            console.log("ERROR AJAX", error);

            Toastify({
                text: `Ocurrió un error! ${error}`,
                duration: 3000,
                backgroundColor: "#f7dc6f"
            }).showToast();
        })
});
async function limpiarModal() {
    $("#movimiento").val('')
    $("#descripcion").val('')
    $("#cantidad").val('')
}
