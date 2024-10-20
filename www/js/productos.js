//Imports
import { getUserLocal, getLocal, manejadorAPI } from "./general.js";
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

//Select´s
const $allSelect = $('.selectProductos');
const $selectUnidad = $('#unidad');
const $selectProvedor = $('#id_provedor');
const $selectCategorias = $('#id_categoria');
const $selectEstatusProducto = $('#id_estatus_producto');

//formulario
const $nombre_producto = $("#nombre_producto");
const $precio_compra = $("#precio_compra");
const $precio_venta = $("#precio_venta");
const $id_provedor = $("#id_provedor");
const $stock = $("#stock");
const $cantidad = $("#cantidad");
const $iva = $("#iva");
const $id_estatus_producto = $("#id_estatus_producto");
const $id_categoria = $("#id_categoria");
const $unidad = $("#unidad");

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

    //Provedores
    const urlProvedores = 'https://abonos.sipecem.com.mx/api/getProvedoresApi';
    const datosProvedores = userData;

    //EstatusProductos
    const urlEstatusProductos = 'https://abonos.sipecem.com.mx/api/getEstatusProducto';
    const datosEstatusProductos = userData;

    const respCatalogos = await manejadorAPI(metodo,urlCatalogos,datos)
    localStorage.setItem('Catalogos', JSON.stringify(respCatalogos));


    /* const respEstatusProductos = await manejadorAPI(metodo,urlEstatusProductos,datosEstatusProductos)
    localStorage.setItem('EstatusProductos', JSON.stringify(respEstatusProductos)); */

   /*  if(respEstatusProductos.EstatusProductos == false){
    }else{
        
        const estatusProductos = getLocal('EstatusProductos');
        // Opciones -> proveedores
        $.each(estatusProductos.EstatusProducto, function (index, item) {
            $selectEstatusProducto.append(
                $('<option></option>').val(item.id).text(item.estatus_producto)
            );
        });        
    } */

    const respAreas = await manejadorAPI(metodo,urlAreas, datosAreas)

    if (respCatalogos === false) {
    } else {
        //CATALOGOS
        const catalogo = getLocal('Catalogos');
        const unidades = catalogo.Unidades;
        const provedores = catalogo.Provedores;
        const categorias = catalogo.Categorias;

        //AREAS        
        //const areas = respAreas.Areas_Almacen;

        $allSelect.empty();

        // Agregar la opción inicial
        $allSelect.append('<option value="">Seleccione una opción</option>');
    

        // Opciones -> unidades
        $.each(unidades, function (index, item) {
            $selectUnidad.append(
                $('<option></option>').val(item.id).text(item.nombre_unidad)
            );
        });

        // Opciones -> proveedores
        $.each(provedores, function (index, item) {
            $selectProvedor.append(
                $('<option></option>').val(item.id).text(item.nombre_provedor)
            );
        });
        // Opciones -> categorias
        $.each(categorias, function (index, item) {
            $selectCategorias.append(
                $('<option></option>').val(item.id).text(item.categoria_producto)
            );
        });
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

    let nombre_producto =$nombre_producto.val();
    let precio_compra =$precio_compra.val();
    let precio_venta =$precio_venta.val();
    let id_provedor =$id_provedor.val();
    let cantidad =$cantidad.val();
    let iva =$iva.val();
    let id_estatus_producto =$id_estatus_producto.val();
    let id_categoria =$id_categoria.val();
    let unidad =$unidad.val();
    const empresa = dataUsuario.id_empresa;

    //VALIDACION: INFORMACIÓN COMPLETA
    if (
        nombre_producto == '' ||
        precio_compra == '' ||
        precio_venta == '' ||
        id_provedor == '' ||
        cantidad == '' ||
        iva == '' ||
        id_estatus_producto == '' ||
        id_categoria == '' ||
        unidad == '' 
    ) {
        Toastify({
            text: "Completa la información!",
            duration: 3000,
            backgroundColor: "#f4d03f"
        }).showToast();
        return
    }

    //FORMATO DE DATOS
    nombre_producto = nombre_producto.trim().toUpperCase();
    precio_compra = parseFloat(precio_compra);
    precio_venta = parseFloat(precio_venta);
    id_provedor = parseInt(id_provedor);
    cantidad = parseInt(cantidad);
    iva = parseInt(iva);
    id_estatus_producto = parseInt(id_estatus_producto);
    id_categoria = parseInt(id_categoria);
    unidad = parseInt(unidad);

    //SET API
    const metodo = "POST";
    const url = "https://abonos.sipecem.com.mx/api/setProducto";
    const datosSetProducto = {
        "nombre_producto":nombre_producto,
        "precio_compra":precio_compra,
        "precio_venta":precio_venta,
        "id_provedor":id_provedor,
        "cantidad":cantidad,
        "iva":iva,
        "id_estatus_producto":id_estatus_producto,
        "id_categoria":id_categoria,
        "unidad":unidad,
        "id_empresa": empresa,
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
    
    $('#agregarCategoriaProducto').modal('hide');
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
    const unidades = catalogos.Unidades;
    
    
   /*  let infoProductos = [];
    const urlGetProductos = 'https://abonos.sipecem.com.mx/api/getProductosApi';
    const datos = dataUser;
    const respProductos = await manejadorAPI('POST',urlGetProductos, datos);
    
    if (respProductos.Productos) {
        for (const producto of respProductos.Productos) {
            let contenido = `
                <div class="card bg-light mb-3">
                    <div class="card-header fw-bold cardProductos">${producto.nombre_producto}</div>
                    <div class="card-body">
                        <ul>
                            <li class="fw-bold"><div class="row"><div class="col-6"><label class="fw-bold">Cantidad</label></div><div class="col-6"><h6>${producto.stock}</h6></div></li>
                            <li class="fw-bold"><div class="row"><div class="col-6"><label class="fw-bold">Precio Compra</label></div><div class="col-6"><h6>${producto.precio_compra}</h6></div></li>
                            <li class=""><div class="row"><div class="col-6"><label class="fw-bold">Precio venta</label></div><div class="col-6"><h6>${producto.precio_venta}</h6></div></></li>
                            <li class="fw-bold"><div class="row"><div class="col-6"><label class="fw-bold">Id Provedor</label></div><div class="col-6"><h6>${producto.id_provedor}</h6></div></></li></li>
                        </ul>
                    </div>
                </div>
            `;
            infoProductos.push([contenido])
        }
    }
    else {
        
    } */

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
async function getAreaAlmacen(){
    let almacen = $('#almacen');
    const $allSelect = $('.selectInsumos');
    const urlAreas = 'https://abonos.sipecem.com.mx/api/getAreaAlmacenApi';
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
$btn_userLogin.click(()=>{ 
    $modal_cerrarSesion.modal('show');
});

$btn_cerrarSesion.click(()=>{
    cerrarSesion()
})
