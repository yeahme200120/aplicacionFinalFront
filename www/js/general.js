const $loadSystem = $('.loadSystem');
export function manejadorAPI(metodo, url, datos) {
    return new Promise((resolve, reject) => {
        $.ajax({
        url: url,
        method: metodo,
        data: datos,
        dataType: 'json',
        success: function(data) {
            resolve(data);
        },
        error: function(jqXHR, textStatus, errorThrown) {
            let error = {"Error jqXHR" : jqXHR, "Error textStatus" : textStatus, "Error errorThrown" : errorThrown }; 
            reject(new Error(`Error en la solicitud: ${textStatus}`));
        }
        });
    });
}

export function getUserLocal() {    
    try {
        const dataUser = localStorage.getItem('DataUser')
        if (dataUser) {
            const userData = JSON.parse(dataUser)
            return userData;
        } else {
            return false
        }
    } catch (error) {
        console.log("Ocurrió un error -> ", error);
        return false
    }
}

export function getLocal(key) {
    try {
        const data = localStorage.getItem(key)
        const respData = JSON.parse(data)
        return respData;
    } catch (error) {
        return false
    }
}

export function removeLocal(key) {
    try {
        localStorage.removeItem(key);
        return true
    } catch (error) {
        return false
    }
}
export async function getEmpresa(){
    //Obtenemos el usuario logeado
    const usuario = localStorage.getItem("DataUser");
    
    const urlEmpresa = 'https://abonos.sipecem.com.mx/api/getEmpresaName';
    const datosEmpresa = usuario;
    
    const metodo = "POST";

    await $.ajax(
        {
        url : `${urlEmpresa}`,
        type: `${metodo}`,
        data : usuario ? usuario  : null,
        "headers": { "Content-Type": "application/json"}
        })
        .done(function(data) {
            if(data.Empresa){
                localStorage.setItem('Empresa', JSON.stringify(data.Empresa.nombre_empresa));
            }else{
                Toastify({
                    text: "No se pudo acceder a el nomre de la empresa",
                    duration: 3000,
                    backgroundColor: "#28b463"
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
}
export async function mostrarPreload(){
    $(".loadSystem").removeClass('d-none');
    $(".loadSystem").css('display',"block");
}
export async function ocultarPreload(){
    $loadSystem.fadeToggle(1000);
    $(".loadSystem").addClass('d-none');
}

export async function setNombreEmpresa(){
    const empresa = localStorage.getItem("Empresa");
    let nombre = empresa.replace(/["']/g, "")
    let mayus = nombre.toUpperCase(nombre);
    $("#nombreEmpresa").text(mayus);
}
export function cerrarSesion(){
    console.log("Cerrar sesion");
    removeLocal('DataUser');
    removeLocal('Catalogos');
    removeLocal('Provedores');
    removeLocal('EstatusProductos');
    removeLocal('Empresa');
    removeLocal('Estados_usuarios');
    removeLocal('Estatus_usuarios');
    removeLocal('Roles_usuarios');
    removeLocal('Areas_usuario');
    removeLocal('Categorias');
    removeLocal('Turnos');
    removeLocal('Rol_Usuario');
    window.location.href = '../index.html';
}
