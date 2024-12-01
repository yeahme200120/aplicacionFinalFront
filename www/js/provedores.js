//Imports
import { getUserLocal, getLocal, manejadorAPI, mostrarPreload, ocultarPreload, setNombreEmpresa } from "./general.js";
import { loadModal } from "./modal.js";
import { configTable } from "./dataTables/config-table.js";

// Variables globales
const $btnHome = $('#btn-menu-principal-home');

const $tabsProvedores = $('#tabs-provedores');

const $seccionAgregar = $('#section-agregarProvedores');
const $seccionConsultar = $('#section-consultarProvedores');

const $btnAgregarProvedor = $('#btn-agregarProvedor');
const $alertaAgregarProvedor = $('#alerta-agregarProvedor');

const $loadSystem = $('.loadSystem');

//Select´s
const $allSelect = $('.selectProvedores');
const $selectUnidad = $('#unidad');
const $selectProvedor = $('#proveedor');

//formulario
const $almacen = $('#id_categoria');
const $descripcion = $('#descripcion');
const $precioU = $('#precioU');
const $iva = $('#iva');
const $unidad = $('#unidad');
const $cantidad = $('#cantidad');
const $proveedor = $('#proveedor');

//Tables
const tablaProvedores = $("#tablaProvedores").DataTable(configTable);
$(document).ready(async function () {
    
    //Setaemos el nombre de la empresa
    await setNombreEmpresa()    

    const userData = getUserLocal();
    const metodo = 'POST';
    
    //Categorias
    const urlCategorias = 'http://127.0.0.1:8000/api/getCategoriasApi';
    const datosCategorias = userData;
    
    const respCategorias = await manejadorAPI(metodo,urlCategorias, datosCategorias)
    localStorage.setItem('Categorias', JSON.stringify(respCategorias.Categorias));

    //Categorias        
    const categorias = respCategorias;
    $allSelect.empty();

    // Agregar la opción inicial
    $allSelect.append('<option value="">Seleccione una opción</option>');
    

    // Opciones -> areas    
    $.each(categorias.Categorias, function (index, item) {
        $almacen.append(
            $('<option></option>').val(item.id).text(item.categoria_producto)
        );
    });
    ocultarPreload();
});

$btnHome.on('click', function() {
    window.location.href = "home.html"
});

$tabsProvedores.on('click', 'li a', async (e) => {
    const btnEvent = e.currentTarget.innerText
    if (btnEvent == "Agregar") {
        $seccionConsultar.addClass('d-none');
        $seccionAgregar.removeClass('d-none');
    } else if (btnEvent == "Consultar") {
        $seccionAgregar.addClass('d-none');
        $seccionConsultar.removeClass('d-none');
        await getProvedores()
    }
})

$btnAgregarProvedor.on('click', async function () {
    const dataUsuario = getUserLocal();
    
    //OBTENER FORMULARIO
    let nombre_provedor = $("#nombre_provedor").val()
    let direccion = $("#direccion").val()
    let correo = $("#correo").val()
    let id_categoria = $("#id_categoria").val()
    let razon_social = $("#razon_social").val()
    let telefono = $("#telefono").val()

    if(nombre_provedor == null || nombre_provedor == '' || nombre_provedor == undefined)
        {
            Toastify({
            text: "Ingresa el nombre del proveedor",
            duration: 3000,
            backgroundColor: "#ec851f"
        }).showToast();
        $("#nombre_provedor").focus()
        return;
        }
    if(direccion == null || direccion == '' || direccion == undefined)
        {
            Toastify({
            text: "Ingresa la direccion del provedor!",
            duration: 3000,
            backgroundColor: "#ec851f"
        }).showToast();
        $("#direccion").focus()
        return;
        }
    if(correo == null || correo == '' || correo == undefined)
        {
            Toastify({
            text: "Ingresa el correo del proveedor!",
            duration: 3000,
            backgroundColor: "#ec851f"
        }).showToast();
        $("#correo").focus()
        return;
        }
    if(id_categoria == null || id_categoria == '' || id_categoria == undefined)
        {
            Toastify({
            text: "Selecciona la categoria!",
            duration: 3000,
            backgroundColor: "#ec851f"
        }).showToast();
        $("#id_categoria").focus()
        return;
        }
    
    if(razon_social == null || razon_social == '' || razon_social == undefined)
        {
            Toastify({
            text: "Ingresa la razon social!",
            duration: 3000,
            backgroundColor: "#ec851f"
        }).showToast();
        $("#razon_social").focus()
        return;
        }
    if(telefono == null || telefono == '' || telefono == undefined)
        {
            Toastify({
            text: "Ingresa el telefono!",
            duration: 3000,
            backgroundColor: "#ec851f"
        }).showToast();
        $("#telefono").focus()
        return;
        }

    
    const empresa = dataUsuario.id_empresa;

    //FORMATO DE DATOS
    nombre_provedor = nombre_provedor.trim().toUpperCase();
    direccion = nombre_provedor.trim().toUpperCase();
    correo = nombre_provedor.trim().toLowerCase();
    id_categoria = parseInt(id_categoria);
    razon_social = razon_social.trim().toUpperCase();
    telefono = parseInt(telefono);

    //SET API
    const metodo = "POST";
    const url = "http://127.0.0.1:8000/api/setProvedor";
    const datosSetProvedor = {
        "usuario" : dataUsuario,
        "provedor" : {
            "nombre_provedor" : nombre_provedor,
            "direccion" : direccion,
            "correo" : correo,
            "id_categoria" : id_categoria,
            "razon_social" : razon_social,
            "telefono" : telefono
        }
    }
    await $.ajax(
    {
    url : `${url}`,
    type: `${metodo}`,
    data : datosSetProvedor ? datosSetProvedor  : null,
    })
    .done(function(data) {
        if(data == 1){
            Toastify({
                text: "El provedor se agregó con éxito",
                duration: 3000,
                backgroundColor: "#28b463"
            }).showToast();
        }else{
            Toastify({
                text: `Ocurrió un error! ${respuesta}`,
                duration: 3000,
                backgroundColor: "#f7dc6f"
            }).showToast();
        }
    })
    .fail(function(error) {
        Toastify({
            text: `Ocurrió un error! ${respuesta}`,
            duration: 3000,
            backgroundColor: "#f7dc6f"
        }).showToast();
    })
});

async function getProvedores() {
    mostrarPreload()
    const dataUser = getUserLocal();
    const catalogos = getLocal('Catalogos');
    const unidades = catalogos.Unidades;
    
    let infoProvedores = [];
    const urlGetProvedores = 'http://127.0.0.1:8000/api/getProvedoresApi';
    const datos = dataUser;
    const respProvedores = await manejadorAPI('POST',urlGetProvedores, datos);
    console.log("respProvedores", respProvedores);
    
    if (respProvedores.Provedores) {
        for (const Provedor of respProvedores.Provedores) {

            let contenido = `
                <div class="card bg-light mb-1">
                    <div class="card-header fw-bold colorApp text-white">${Provedor.nombre_provedor}</div>
                    <div class="card-body">
                        <ul>
                            <li class="fw-bold p-0 m-0"><div class="row"><div class="col-6"><label class="fw-bold">Empresa</label></div><div class="col-6"><h6>${Provedor.nombre_empresa}</h6></div></li>
                            <li class="fw-bold p-0 m-0"><div class="row"><div class="col-6"><label class="fw-bold">Correo</label></div><div class="col-6"><h6>${Provedor.correo}</h6></div></li>
                            <li class="fw-bold p-0 m-0"><div class="row"><div class="col-6"><label class="fw-bold">Dirección</label></div><div class="col-6"><h6>${Provedor.direccion}</h6></div></></li>
                            <li class="fw-bold p-0 m-0"><div class="row"><div class="col-6"><label class="fw-bold">Razon Social</label></div><div class="col-6"><h6>${Provedor.razon_social}</h6></div></></li></li>
                            <li class="fw-bold p-0 m-0"><div class="row"><div class="col-6"><label class="fw-bold">Telefono</label></div><div class="col-6"><h6>${Provedor.telefono}</h6></div></></li>
                        </ul>
                    </div>
                </div>
            `;
            infoProvedores.push([contenido])
        }
    }
    else {
        
    }

    tablaProvedores.clear();
    tablaProvedores.rows.add(infoProvedores);
    tablaProvedores.draw();

    ocultarPreload()
}



async function getAreaAlmacen(){
    let almacen = $('#almacen');
    const $allSelect = $('.selectInsumos');
    const urlAreas = 'http://127.0.0.1:8000/api/getAreaAlmacenApi';
    const respAreas = await manejadorAPI(metodo,urlAreas, datosAreas)
    console.log("Respuesta de las areas", respAreas);
    
    const areas = respAreas.Areas_Almacen;
    almacen.empty();
     // Opciones -> areas
    $.each(areas, function (index, item) {
        almacen.append(
            $('<option></option>').val(item.id).text(item.nombre_area)
        );
    });
}
