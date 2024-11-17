//Imports
import { getUserLocal, getLocal, manejadorAPI, getCatalogosGlobal } from "./general.js";
import { loadModal } from "./modal.js";
import { configTable } from "./dataTables/config-table.js";

// Variables globales
const $btnHome = $('#btn-menu-principal-home');
const $tabsProductos = $('#tabs-productos');
const $seccionAgregar = $('#section-agregarProductos');
const $seccionConsultar = $('#section-consultarProductos');
const $btnAgregarProducto = $('#btn-agregarProducto');
const $loadSystem = $('.loadSystem');
const $btnAddAlmacen = $('#addCatProducto');
const $btnAddUnidad = $('#addUnidadProducto');

//Select´s
const $allSelect = $('.selectProductos');
const $selectUnidad = $('#id_unidad_producto');
const $selectCategorias = $('#id_categoria_producto');
const $selectEstatusProducto = $('#id_estatus_producto');

//formulario
const $id_categoria_producto = $("#id_categoria_producto");
const $nombre = $("#nombre");
const $clave = $("#clave");
const $precio_venta1 = $("#precio_venta1");
const $precio_venta2 = $("#precio_venta2");
const $precio_venta3 = $("#precio_venta3");
const $tipo = $("#tipo");
const $id_unidad_producto = $("#id_unidad_producto");

//Tables
const $tablaProductos = $("#tablaProductos").DataTable(configTable);

const $btn_userLogin = $('#btn-userLogin');
const $btn_cerrarSesion = $('#btn-cerrarSesion');
const $modal_cerrarSesion = $('#modal-cerrarSesion');
const $btn_addCatProducto = $("#id_categoria_producto")

$(document).ready(async function () {

    //Setaemos el nombre de la empresa
    const empresa = localStorage.getItem("Empresa");
    let nombre = empresa.replace(/["']/g, "")
    let mayus = nombre.toUpperCase(nombre);
    $("#nombreEmpresa").text(mayus);

    $loadSystem.removeClass('d-none');
    const userData = getUserLocal();
    const metodo = 'POST';
    //Catalogos
    const datos = { usuario: userData.id };
    const urlCatalogos = 'https://abonos.sipecem.com.mx/api/getCatalogos';
    
    //Areas
    const urlAreas = 'https://abonos.sipecem.com.mx/api/getAreaAlmacenApi';
    const datosAreas = userData;

    //EstatusProductos
    const urlEstatusProductos = 'https://abonos.sipecem.com.mx/api/getEstatusProducto';
    const datosEstatusProductos = userData;

    const respCatalogos = await manejadorAPI(metodo,urlCatalogos,datos)
    localStorage.setItem('Catalogos', JSON.stringify(respCatalogos));

    const respAreas = await manejadorAPI(metodo,urlAreas, datosAreas)

    if (respCatalogos === false) {
    } else {
        //CATALOGOS
        const catalogo = getLocal('Catalogos');
        const unidades = catalogo.UnidadesProductos;

        //AREAS        
        //const areas = respAreas.Areas_Almacen;

        $allSelect.empty();

        // Agregar la opción inicial
        $allSelect.append('<option value="">Seleccione una opción</option>');
    

        await getUnidades()

        await getCategorias()
    }

    $loadSystem.fadeToggle(1000);
    $loadSystem.addClass('d-none');
});

$btnHome.on('click', function() {
    window.location.href = "home.html"
});

$tabsProductos.on('click', 'li a', async (e) => {
    const btnEvent = e.currentTarget.innerText
    if (btnEvent == "Agregar") {
        $seccionConsultar.addClass('d-none');
        $seccionAgregar.removeClass('d-none');
    } else if (btnEvent == "Consultar") {
        $seccionAgregar.addClass('d-none');
        $seccionConsultar.removeClass('d-none');
        await getProductos()
    }
})

$btnAgregarProducto.on('click', async function () {
    const dataUsuario = getUserLocal();
    
    //OBTENER FORMULARIO
    let id_categoria_producto = $id_categoria_producto.val()
    let nombre = $nombre.val()
    let clave = $clave.val()
    let precio_venta1 = $precio_venta1.val()
    let precio_venta2 = $precio_venta2.val()
    let precio_venta3 = $precio_venta3.val()
    let tipo = $tipo.val()
    let id_unidad_producto = $id_unidad_producto.val()

    const empresa = dataUsuario.id_empresa;

    //VALIDACION: INFORMACIÓN COMPLETA
    if (
        id_categoria_producto == '' || id_categoria_producto == undefined,
        nombre == '' || nombre == undefined,
        clave == '' || clave == undefined,
        precio_venta1 == '' || precio_venta1 == undefined,
        tipo == '' || tipo == undefined,
        id_unidad_producto == '' || id_unidad_producto == undefined
    ) {
        Toastify({
            text: "Completa la información!",
            duration: 3000,
            backgroundColor: "#f4d03f"
        }).showToast();
        return
    }

    //FORMATO DE DATOS
    id_categoria_producto = parseInt(id_categoria_producto)
    nombre = nombre.trim().toUpperCase();
    clave = clave.trim().toUpperCase();
    precio_venta1 = parseInt(precio_venta1);
    precio_venta2 = parseInt(precio_venta2 ? precio_venta2 : 0);
    precio_venta3 = parseInt(precio_venta3 ? precio_venta3 : 0);
    tipo = parseInt(tipo);
    id_unidad_producto = parseInt(id_unidad_producto);

    //SET API
    const metodo = "POST";
    const url = "https://abonos.sipecem.com.mx/api/setProducto";
    const datosSetProducto = {
        "id_categoria_producto" : id_categoria_producto,
        "nombre" : nombre,
        "clave" : clave,
        "precio_venta1" : precio_venta1,
        "precio_venta2" : precio_venta2,
        "precio_venta3" : precio_venta3,
        "tipo" : tipo,
        "id_unidad_producto" : id_unidad_producto,
        "id_empresa" : parseInt(empresa),
        "iva" : parseInt(0),
        "estatus" : parseInt(1)
    }

    await $.ajax(
    {
    url : `${url}`,
    type: `${metodo}`,
    data : datosSetProducto ? datosSetProducto  : null,
    })
    .done(function(data) {
        console.log("Respuesta ok:", data);
        Toastify({
            text: "Se agregó con éxito",
            duration: 3000,
            backgroundColor: "#28b463"
        }).showToast();
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

$btnAddAlmacen.on('click', async function() {
    $("#agregarCategoriaProducto").modal("show")   
});
$btnAddUnidad.on('click', async function() {
    $("#agregarUnidadProducto").modal("show")   
});

$btn_addCatProducto.on('click', async function() {
});

//Evento de Modal Add Almacen
$(document).on('click', '#btnSetCategoriaProducto', async function() {
    mostrarPreload();
    const $newCatProd = $('#nombreCategoriaProducto');
    const newCatProd = $newCatProd.val().trim().toUpperCase();
    const dataUser = getUserLocal()
    const urlSetAlmacen = 'https://abonos.sipecem.com.mx/api/setCategoriaProducto';
    const datosSetAlmacen = {
        usuario: dataUser,
        categoria: newCatProd
    }

    const respSetAlmacen = await manejadorAPI('POST', urlSetAlmacen, datosSetAlmacen);
    console.log("Respuesta de la insercion:", respSetAlmacen);
    await getCatalogosGlobal(dataUser.id)
    $('#agregarCategoriaProducto').modal('hide');
    await getCategorias()
    if (respSetAlmacen == 1) {
        await getAreaAlmacen()
        loadModal('modalDinamico', '../components/modal.html', 'Agregado con éxito')
    }
    else if(respSetAlmacen == 0) {
        loadModal('modalDinamico', '../components/modal.html', 'Ups! Ocurrió un error 🙉')
    }
    else {
        loadModal('modalDinamico', '../components/modal.html', respSetAlmacen.msg ? respSetAlmacen.msg : respSetAlmacen)
    }
    ocultarPreload()
});
//Evento de Modal Add Unidad
$(document).on('click', '#btnSetUnidadProducto', async function() {
    mostrarPreload();
    const $newUnidadProd = $('#unidad');
    const newUnidadProd = $newUnidadProd.val().trim().toUpperCase();
    const dataUser = getUserLocal()
    const urlSetAlmacen = 'https://abonos.sipecem.com.mx/api/setUnidadProducto';
    const datosSetAlmacen = {
        usuario: dataUser,
        unidad: newUnidadProd
    }

    const respSetAlmacen = await manejadorAPI('POST', urlSetAlmacen, datosSetAlmacen);
    console.log("Respuesta de la insercion:", respSetAlmacen);
    $('#agregarUnidadProducto').modal('hide');
    await getUnidades()
    if (respSetAlmacen == 1) {
        await getAreaAlmacen()
        loadModal('modalDinamico', '../components/modal.html', 'Agregado con éxito')
    }
    else if(respSetAlmacen == 0) {
        loadModal('modalDinamico', '../components/modal.html', 'Ups! Ocurrió un error 🙉')
    }
    else {
        loadModal('modalDinamico', '../components/modal.html', respSetAlmacen.msg ? respSetAlmacen.msg : respSetAlmacen)
    }
    ocultarPreload()
});

async function getProductos() {
    mostrarPreload()
    const dataUser = getUserLocal();
    const catalogos = getLocal('Catalogos');
    
    let infoProductos = [];
    const urlGetProductos = 'https://abonos.sipecem.com.mx/api/getProductos';
    const datos = {"usuario":dataUser};
    const respProductos = await manejadorAPI('POST',urlGetProductos, datos);
    let semaforo = ''
    if (respProductos) {
        for (const producto of respProductos) {
            let contenido = `
                <div class="card bg-light mb-3">
                    <div class="card-header fw-bold cardInsumo">${producto.nombre}</div>
                    <div class="card-body">
                        <ul>
                            <li class="fw-bold"><div class="row"><div class="col-6"><label class="fw-bold">Clave</label></div><div class="col-6"><h6>${producto.clave}</h6></div></li>
                            <li class="fw-bold"><div class="row"><div class="col-6"><label class="fw-bold">Precio Precio 1</label></div><div class="col-6"><h6>${producto.precio_venta1}</h6></div></li>
                            <li class="fw-bold"><div class="row"><div class="col-6"><label class="fw-bold">Precio Precio 2</label></div><div class="col-6"><h6>${producto.precio_venta2}</h6></div></li>
                            <li class="fw-bold"><div class="row"><div class="col-6"><label class="fw-bold">Precio Precio 3</label></div><div class="col-6"><h6>${producto.precio_venta3}</h6></div></li>
                            <li class="fw-bold"><div class="row"><div class="col-6"><label class="fw-bold">Categoria</label></div><div class="col-6"><h6>${producto.categoria}</h6></div></li>
                            <li class="fw-bold"><div class="row"><div class="col-6"><label class="fw-bold">Unidad</label></div><div class="col-6"><h6>${producto.unidad}</h6></div></li>
                        </ul>
                    </div>
                </div>
            `;
            infoProductos.push([contenido])
        }
    }
    else {
        
    }
    console.log(infoProductos);
    
    $tablaProductos.clear();
    $tablaProductos.rows.add(infoProductos);
    $tablaProductos.draw();
    $(".cardProductos").addClass("bg-btn-primario");
    ocultarPreload()
}
async function mostrarPreload(){
    $(".loadSystem").removeClass('d-none');
    $(".loadSystem").css('display',"block");
}
async function ocultarPreload(){
    $loadSystem.fadeToggle(1000);
    $(".loadSystem").addClass('d-none');
}
async function getCategorias() {
    try {
        const dataUser = getUserLocal();
        const datos = { "usuario": dataUser };

        $selectCategorias.empty(); // Limpia las opciones actuales del select

        const urlCategoria = 'https://abonos.sipecem.com.mx/api/getCategoriaProductos';
        const respCategoria = await manejadorAPI("POST", urlCategoria, datos);

        if (!Array.isArray(respCategoria) || respCategoria.length === 0) {
            console.warn("No se encontraron categorías.");
            return; // Salir si no hay categorías
        }

        // Crear opciones en memoria
        const opciones = respCategoria.map(item => 
            $('<option></option>').val(item.id).text(item.categoria)
        );

        // Agregar opciones al select
        $selectCategorias.append(opciones);
    } catch (error) {
        console.error("Error al obtener las categorías:", error);
    }
}
async function getUnidades() {
    try {
        const dataUser = getUserLocal();
        const datos = { "usuario": dataUser };

        $selectUnidad.empty(); // Limpia las opciones actuales del select

        const urlUnidad = 'https://abonos.sipecem.com.mx/api/getUnidadProductos';
        const respUnidad = await manejadorAPI("POST", urlUnidad, datos);
        console.log(respUnidad);
        
        if (!Array.isArray(respUnidad) || respUnidad.length === 0) {
            console.warn("No se encontraron unidades.");
            return; // Salir si no hay categorías
        }

        // Crear opciones en memoria
        const opciones = respUnidad.map(item => 
            $('<option></option>').val(item.id).text(item.unidad)
        );

        // Agregar opciones al select
        $selectUnidad.append(opciones);
    } catch (error) {
        console.error("Error al obtener las categorías:", error);
    }
}
$btn_userLogin.click(()=>{ 
    $modal_cerrarSesion.modal('show');
});

$btn_cerrarSesion.click(()=>{
    cerrarSesion()
})
