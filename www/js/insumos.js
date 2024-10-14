//Imports
import { getUserLocal, getLocal, manejadorAPI } from "./general.js";
import { loadModal } from "./modal.js";
import { configTable } from "./dataTables/config-table.js";

// Variables globales
const $btnHome = $('#btn-menu-principal-home');

const $tabsInsumos = $('#tabs-insumos');

const $seccionAgregar = $('#section-agregarInsumos');
const $seccionConsultar = $('#section-consultarInsumos');

const $btnAgregarInsumo = $('#btn-agregarInsumo');
const $alertaAgregarInsumo = $('#alerta-agregarInsumo');

const $loadSystem = $('.loadSystem');

const $btnAddAlmacen = $('#addAlmacen');

//Select´s
const $allSelect = $('.selectInsumos');
const $selectUnidad = $('#unidad');
const $selectProvedor = $('#proveedor');

//formulario
const $almacen = $('#almacen');
const $descripcion = $('#descripcion');
const $precioU = $('#precioU');
const $iva = $('#iva');
const $unidad = $('#unidad');
const $cantidad = $('#cantidad');
const $stock = $('#stock');
const $proveedor = $('#proveedor');

//Tables
const tablaInsumos = $("#tablaInsumos").DataTable(configTable);

const $btn_userLogin = $('#btn-userLogin');
const $btn_cerrarSesion = $('#btn-cerrarSesion');
const $modal_cerrarSesion = $('#modal-cerrarSesion');

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
    
    const respCatalogos = await manejadorAPI(metodo,urlCatalogos,datos)
    localStorage.setItem('Catalogos', JSON.stringify(respCatalogos));

    const respAreas = await manejadorAPI(metodo,urlAreas, datosAreas)

    if (respCatalogos === false) {
    } else {
        //CATALOGOS
        const catalogo = getLocal('Catalogos');
        const unidades = catalogo.Unidades;
        const provedores = catalogo.Provedores;

        //AREAS        
        const areas = respAreas.Areas_Almacen;

        $allSelect.empty();

        // Agregar la opción inicial
        $allSelect.append('<option value="">Seleccione una opción</option>');
        

        // Opciones -> areas
        $.each(areas, function (index, item) {
            $almacen.append(
                $('<option></option>').val(item.id).text(item.nombre_area)
            );
        });

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
    }

    $loadSystem.fadeToggle(1000);
    $loadSystem.addClass('d-none');
});

$btnHome.on('click', function() {
    window.location.href = "home.html"
});


$tabsInsumos.on('click', 'li a', async (e) => {
    const btnEvent = e.currentTarget.innerText
    if (btnEvent == "Agregar") {
        $seccionConsultar.addClass('d-none');
        $seccionAgregar.removeClass('d-none');
    } else if (btnEvent == "Consultar") {
        $seccionAgregar.addClass('d-none');
        $seccionConsultar.removeClass('d-none');
        await getInsumos()
    }
})

$btnAgregarInsumo.on('click', async function () {
    const dataUsuario = getUserLocal();
    
    //OBTENER FORMULARIO
    let almacen = $almacen.val();
    let descripcion = $descripcion.val();
    let precioU = $precioU.val();
    let iva = $iva.val();
    let unidad = $unidad.val();
    let cantidad = $cantidad.val();
    let stock = parseInt(0);
    //let proveedor = $proveedor.val();
    const empresa = dataUsuario.id_empresa;

    //VALIDACION: INFORMACIÓN COMPLETA
    if (almacen == "" ||
        descripcion == "" ||
        precioU == "" ||
        iva == "" ||
        cantidad == "" 
        /* proveedor == "" */
    ) {
        Toastify({
            text: "Completa la información!",
            duration: 3000,
            backgroundColor: "#f4d03f"
        }).showToast();
        return
    }

    //FORMATO DE DATOS
    descripcion = descripcion.trim().toUpperCase();
    precioU = parseFloat(precioU);
    almacen = parseInt(almacen);
    iva = parseInt(iva);
    unidad = parseInt(unidad);
    cantidad = parseInt(cantidad);
    stock = parseInt(0);
    proveedor = parseInt(0);

    //SET API
    const metodo = "POST";
    const url = "https://abonos.sipecem.com.mx/api/setInsumo";
    const datosSetInsumo = {
        "descripcion": descripcion,
        "id_area_almacen": almacen,
        "precio_unitario": precioU,
        "iva": iva,
        "id_unidad": unidad,
        "cantidad": cantidad,
        "stock": parseInt(0),
        "id_empresa": empresa,
        "id_provedor": proveedor
    }
    console.log("data del insumo: ", datosSetInsumo);
    
    await $.ajax(
    {
    url : `${url}`,
    type: `${metodo}`,
    data : datosSetInsumo ? datosSetInsumo  : null,
    })
    .done(function(data) {
        console.log("Respuesta ok:", data);
        if(data == 1){
            Toastify({
                text: "Se agregó con éxito",
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
        console.log("Respuesta fail: ",error);
        Toastify({
            text: `Ocurrió un error! ${respuesta}`,
            duration: 3000,
            backgroundColor: "#f7dc6f"
        }).showToast();
    })
});

$btnAddAlmacen.on('click', async function() {
    loadModal('agregarAlmacen', '../components/addAlmacen.html','');    
});

//Evento de Modal Add Almacen
$(document).on('click', '#btnSetAlmacen', async function() {
    mostrarPreload();
    const $newAlmacen = $('#nombreAlmacen');
    const newAlmacen = $newAlmacen.val().trim().toUpperCase();
    const dataUser = getUserLocal()
    const urlSetAlmacen = 'https://abonos.sipecem.com.mx/api/setAreaAlmacenApi';
    const datosSetAlmacen = {
        usuario: JSON.stringify(dataUser),
        nombre_area: newAlmacen
    }

    const respSetAlmacen = await manejadorAPI('POST', urlSetAlmacen, datosSetAlmacen);
    console.log("Respuesta de la insercion:", respSetAlmacen);
    
    $('#agregarAlmacen').modal('hide');
    if (respSetAlmacen === 1) {
        await getAreaAlmacen()
        loadModal('modalDinamico', '../components/modal.html', 'Agregado con éxito')
    }
    else if(respSetAlmacen === 0) {
        loadModal('modalDinamico', '../components/modal.html', 'Ups! Ocurrió un error 🙉')
    }
    else {
        loadModal('modalDinamico', '../components/modal.html', respSetAlmacen.msg)
    }
    ocultarPreload()
});

async function getInsumos() {
    mostrarPreload()
    const dataUser = getUserLocal();
    const catalogos = getLocal('Catalogos');
    const unidades = catalogos.Unidades;
    
    let infoInsumos = [];
    const urlGetInsumos = 'https://abonos.sipecem.com.mx/api/getInsumosApi';
    const datos = dataUser;
    const respInsumos = await manejadorAPI('POST',urlGetInsumos, datos);
    
    if (respInsumos.Insumos) {
        for (const insumo of respInsumos.Insumos) {
            console.log("Data Insumos: ", insumo);
            let nombreUnidad = unidades.filter(item => item.id == insumo.id_unidad)[0]['nombre_unidad']
            let contenido = `
                <div class="card bg-light mb-3">
                    <div class="card-header fw-bold cardInsumo">${insumo.descripcion}</div>
                    <div class="card-body">
                        <ul>
                            <li class="fw-bold"><div class="row"><div class="col-8"><label class="fw-bold">Cantidad Minima</label></div><div class="col-4"><h6>${insumo.cantidad}</h6></div></li>
                            <li class="fw-bold"><div class="row"><div class="col-8"><label class="fw-bold">Unidad</label></div><div class="col-4"><h6>${insumo.nombre_unidad}</h6></div></li>
                            <li class=""><div class="row"><div class="col-8"><label class="fw-bold">Área</label></div><div class="col-4"><h6>${insumo.nombre_area}</h6></div></></li>
                        </ul>
                    </div>
                </div>
            `;
            /* <li class=""><div class="row"><div class="col-6"><label class="fw-bold">Empresa</label></div><div class="col-6"><h6>${insumo.nombre_Empresa}</h6></div></></li> */
                                        /* <li class="fw-bold"><div class="row"><div class="col-6"><label class="fw-bold">Provedor</label></div><div class="col-6"><h6>${insumo.nombre_provedor}</h6></div></></li></li> */
            
            infoInsumos.push([contenido])
        }
    }
    else {
        
    }

    tablaInsumos.clear();
    tablaInsumos.rows.add(infoInsumos);
    tablaInsumos.draw();
    $(".cardInsumo").addClass("bg-btn-primario");
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
    let arrayInsumos = []
    let arrayAreas=[]
    let almacen = $('#almacen');
    const $allSelect = $('.selectInsumos');
    const urlAreas = 'https://abonos.sipecem.com.mx/api/getAreaAlmacenApi';
    const respAreas = await manejadorAPI(metodo,urlAreas, datosAreas)
    console.log("Respuesta de las areas", respAreas);
    
    const areas = respAreas.Areas_Almacen;
    almacen.empty();
     // Opciones -> areas
    $.each(areas, function (index, item) {
        arrayInsumos.push(item)
        almacen.append(
            $('<option></option>').val(item.id).text(item.nombre_area)
        );
    });
    console.log("Insumos: ", arrayInsumos);
    const busqueda = arrayInsumos.reduce((acc, insumo) => {
        const clave = JSON.stringify(insumo)
        console.log("Clave: ", clave);
        
        acc[descripcion] = acc[descripcion] || 0
        return acc;
    })
    console.log(busqueda);
    
}
$btn_userLogin.click(()=>{ 
    $modal_cerrarSesion.modal('show');
});

$btn_cerrarSesion.click(()=>{
    cerrarSesion()
});