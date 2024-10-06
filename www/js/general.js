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
export async function mostrarModalPreload(){
    $(".loadSystem").modal('show');
}
export async function ocultarModalPreload(){
    $(".loadSystem").modal('hide');
}

export async function setNombreEmpresa(){
    const empresa = localStorage.getItem("Empresa");
    let nombre = empresa.replace(/["']/g, "")
    let mayus = nombre.toUpperCase(nombre);
    $("#nombreEmpresa").text(mayus);
}
export function cerrarSesion(){
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

//***********************   Funciones Bluethooth    ***********************

//********************   Fin Funciones Bluethooth    ***********************
//***********************   Funciones de la impresora   ********************
export function mostrarDispositivos(){
    //Muestra el listado de los dispositivos bluethooth vunculados
    try {
        window.BluetoothPrinter.list(function (data) {
           alert("Success");
           alert(data);
          },function (err) {
           alert("Error");
           alert(err);
          })
    } catch (error) {
        alert(error)
    }
}
export function comprobarStatusBluethooth(){
    //Comprueba el estatus del bluethooth
    try {
        window.BluetoothPrinter.status(function(data){
           alert("Success");
           alert(data)
          },function(err){
           alert("Error");
           alert(err)
          })        
    } catch (error) {
        alert(error)
    }
}
export function conectarImpresora(){
    //Conecta la impresora
    try {
        window.BluetoothPrinter.connect("PrinterName", function(data){
           alert("Success");
           alert(data)
          },function(err){
           alert("Error");
           alert(err)
          })
    } catch (error) {
        alert(error)
    }
}
export function impresoraConectada(){
    //Comprueba si la impresora esta conectada
    try {
        window.BluetoothPrinter.isConnected(function(data){
           alert("Success");
           alert(data)
          },function(err){
           alert("Error");
           alert(err);
          })
    } catch (error) {
        alert(error)
    }
} 
export function desconectarImpresora(){
    //Desconecta la improra despues de 1.5 segundos
    try {
        setTimeout(function(){
            window.BluetoothPrinter.disconnect("PrinterName", function(data){
             alert("Success");
             alert(data)
            },function(err){
             alert("Error");
             alert(err)
            });
          }, 1500);
    } catch (error) {
        alert(error)
    }
}
export function codificacionTexto(){
    try {
        window.BluetoothPrinter.setEncoding("ISO-8859-1", function(data){
           alert("Success");
           alert(data)
          },function(err){
           alert("Error");
           alert(err)
          })
    } catch (error) {
        alert(error)
    }
}
export function imprimirSimple(){
    try {
        window.BluetoothPrinter.printText("String to Print", function(data){
           alert("Success");
           alert(texto)
          },function(err){
           alert("Error");
           alert(err)
          })
    } catch (error) {
        alert()
    }
}
export function imprimirSeparador(){
    try {
        window.BluetoothPrinter.printText("--------------------------------", function(data){
            alert("Success");
            alert(texto)
           },function(err){
            alert("Error");
            alert(err)
           })
    } catch (error) {
        alert(error)
    }
}
export function formatTexto(){
    window.BluetoothPrinter.printTextSizeAlign("String to Print", 0, 0, function(textoFormat){
       alert("Success");
       alert(textoFormat)
      },function(err){
       alert("Error");
       alert(err)
      })
}
export function imprimirImgen64(){
    try {
        window.BluetoothPrinter.printBase64("Image Base64 String", '0', function(imagen){
           alert("Success");
           alert(imagen);
          },function(err){
           alert("Error");
           alert(err);
          })
    } catch (error) {
        alert(error)
    }
}
export function tituloFormat(){
    try {
        window.BluetoothPrinter.printTitle("String text", 0, 0, function(titulo){
           alert("Success");
           alert(titulo);
          },function(err){
           alert("Error");
           alert(err);
          })
    } catch (error) {
        alert(error)
    }
}
export function impresioPV(){
    try {
        window.BluetoothPrinter.printPOSCommand("0C", function(data){
           alert("Success");
           alert(data)
          },function(err){
           alert("Error");
           alert(err)
          })
    } catch (error) {
        alert(error)
    }
}
export function imprimirQR(){
    try {
        var data = "https://github.com/CesarBalzer/Cordova-Plugin-window.BluetoothPrinter";
        var align = 1; /* 0, 1, 2 */
        var model = 49; /* https://reference.epson-biz.com/modules/ref_escpos/index.php?content_id=140 */
        var size = 32; /* https://reference.epson-biz.com/modules/ref_escpos/index.php?content_id=141 */
        var eclevel = 50; /* https://reference.epson-biz.com/modules/ref_escpos/index.php?content_id=142 */
    
        window.BluetoothPrinter.printQRCode(data, align, model, size, eclevel, function(data){
       alert("Success");
       alert(data);
        },function(err){
       alert("Error");
       alert(err);
        })
    } catch (error) {
        alert(error)
    }
}
export function imprimirBarras(){
    try {
        var system = 0; /* Barcode system, defined as "m" at https://reference.epson-biz.com/modules/ref_escpos/index.php?content_id=128 */
        var data = "012345678901"; /* Barcode data, according to barcode system */
        var align = 1; /* 0, 1, 2 */
        var position = 2; /* Text position: https://reference.epson-biz.com/modules/ref_escpos/index.php?content_id=125 */;
        var font = 0; /* Font for HRI characters: https://reference.epson-biz.com/modules/ref_escpos/index.php?content_id=126 */
        var height = 64; /* Set barcode height: https://reference.epson-biz.com/modules/ref_escpos/index.php?content_id=127*/
    
        window.BluetoothPrinter.printBarcode(system, data, align, position, font, height, function(data) {
       alert("Success");
       alert(data);
        }, function(err){
       alert("Error");
       alert(err);
        })
    } catch (error) {
        alert(error)
    }
}
//***********************   Fin Funciones de la impresora   ****************