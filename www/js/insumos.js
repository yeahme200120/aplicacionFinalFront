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

const $btnAddCatInsumo = $('#addCatInsumo');
const $btnAddUnidadInsumo = $('#addUnidadInsumo');

//Select´s
const $allSelect = $('.selectInsumos');
const $allSelectCat = $('.selectCategorias');
const $catInsumos = $('#categoria_insumo');
const $selectUnidad = $('#unidad');
const $selectProvedor = $('#proveedor');

//formulario
const $categoria_insumo = $('#categoria_insumo');
const $nombre = $('#nombre');
const $clave = $('#clave');
const $unidad = $('#unidad');
const $stock = $('#stock');
const $cantidad = $('#cantidad');
const $tipo = $('#tipo');

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
        const unidades = catalogo.UnidadesInsumos;
        const provedores = catalogo.Provedores;
        const categorias = catalogo.CategoriasInsumos

        //AREAS        
        const areas = respAreas.Areas_Almacen;

        $allSelect.empty();

        // Agregar la opción inicial
        $allSelect.append('<option value="">Seleccione una opción</option>');
        $allSelectCat.append('<option value="">Seleccione una opción</option>');
        // Opciones -> unidades insumos
        $.each(unidades, function (index, item) {
            $selectUnidad.append(
                $('<option></option>').val(item.id).text(item.unidad)
            );
        });

        // Opciones -> categorias insumos
        $.each(categorias, function (index, item) {
            $catInsumos.append(
                $('<option></option>').val(item.id).text(item.categoria)
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
    let categoria_insumo = $categoria_insumo.val()
    let nombre = $nombre.val()
    let clave = $clave.val()
    let unidad = parseInt($unidad.val())
    let stock = parseInt($stock.val())
    let cantidad = parseInt($cantidad.val())
    let tipo = $tipo.val()

    //VALIDACION: INFORMACIÓN COMPLETA
    if (categoria_insumo == "" ||
        nombre == "" ||
        clave == "" ||
        unidad == "" ||
        stock == "" ||
        cantidad == "" ||
        tipo == "" 
    ) {
        Toastify({
            text: "Completa la información!",
            duration: 3000,
            backgroundColor: "#f4d03f"
        }).showToast();
        return
    }

    //FORMATO DE DATOS
    categoria_insumo = parseInt(categoria_insumo)
    nombre = nombre.trim().toUpperCase()
    clave = clave.trim().toUpperCase()
    unidad = parseInt(unidad)
    stock = parseInt(stock)
    cantidad = parseInt(cantidad)
    tipo = parseInt(tipo)

    //SET API
    const metodo = "POST";
    const url = "https://abonos.sipecem.com.mx/api/setInsumo";
    const datosSetInsumo = {
        "id_categoria_insumo": categoria_insumo,
        "nombre": nombre,
        "clave": clave,
        "id_unidad": unidad,
        "stock": stock,
        "cantidad": cantidad,
        "tipo": tipo,
        "id_empresa":dataUsuario.id_empresa
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

$btnAddCatInsumo.on('click', async function() {
    //Mostrar modal de agregar categoria Insumo
    $("#agregarCategoriaInsumo").modal("show");  
});
$btnAddUnidadInsumo.on('click', async function() {
    //Mostrar modal de agregar categoria Insumo
    $("#agregarUnidadInsumo").modal("show");  
});

//Evento de Modal Add Almacen
$(document).on('click', '#btnSetCategoriaInsumo', async function() {
    mostrarPreload();
    const $newCategoriaInsumo = $('#nombreCategoriaInsumo');
    const newCategoriaInsumo = $newCategoriaInsumo.val().trim().toUpperCase();
    const dataUser = getUserLocal()
    const urlSetAlmacen = 'https://abonos.sipecem.com.mx/api/setCategoriaInsumo';
    const datosSetAlmacen = {
        usuario: dataUser,
        categoria: newCategoriaInsumo
    }
    console.log("datos a enviar:", datosSetAlmacen);
    
    const respSetAlmacen = await manejadorAPI('POST', urlSetAlmacen, datosSetAlmacen);
    console.log("Respuesta de la insercion:", respSetAlmacen);
    //Ocultar modal de agregar categoria insumo
    $('#agregarCategoriaInsumo').modal('hide');
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
$(document).on('click', '#btnSetUnidadInsumo', async function() {
    mostrarPreload();
    const $newCategoriaInsumo = $('#nombreUnidadInsumo');
    const newCategoriaInsumo = $newCategoriaInsumo.val().trim().toUpperCase();
    const dataUser = getUserLocal()
    const urlSetAlmacen = 'https://abonos.sipecem.com.mx/api/setUnidadInsumo';
    const datosSetAlmacen = {
        usuario: dataUser,
        categoria: newCategoriaInsumo
    }

    const respSetAlmacen = await manejadorAPI('POST', urlSetAlmacen, datosSetAlmacen);
    console.log("Respuesta de la insercion:", respSetAlmacen);
    //Ocultar modal de agregar categoria insumo
    $('#agregarUnidadInsumo').modal('hide');
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
    let semaforo = ''
    if (respInsumos.Insumos) {
        for (const insumo of respInsumos.Insumos) {
            console.log("Data Insumos: ", insumo);
            let nombreUnidad = unidades.filter(item => item.id == insumo.id_unidad)[0]['nombre_unidad']
            if(insumo.stock >= (insumo.cantidad + ( (insumo.cantidad*0.50) + 1 ) )){
                semaforo = 'text-success';
            } else if(insumo.stock > insumo.cantidad && insumo.stock <= (insumo.cantidad + ( (insumo.cantidad*0.50) ) )){
                semaforo = 'text-warning';
            } else {
                semaforo = 'text-danger';
            }
            let contenido = `
                <div class="card bg-light mb-3">
                    <div class="card-header fw-bold cardInsumo">${insumo.nombre}</div>
                    <div class="card-body">
                        <div class="row justify-content-end"> <div class="col-2"> <i class="bi bi-circle-fill ${semaforo}" style="font-size:2rem"></i> </div> </div>
                        <ul>
                            <li class="fw-bold"><div class="row"><div class="col-8"><label class="fw-bold">Clave</label></div><div class="col-4"><h6>${insumo.clave}</h6></div></li>
                            <li class="fw-bold"><div class="row"><div class="col-8"><label class="fw-bold">Stock Minimo</label></div><div class="col-4"><h6>${insumo.stock}</h6></div></li>
                            <li class=""><div class="row"><div class="col-8"><label class="fw-bold">Cantidad</label></div><div class="col-4"><h6>${insumo.cantidad}</h6></div></></li>
                        </ul>
                    </div>
                </div>
            `;
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