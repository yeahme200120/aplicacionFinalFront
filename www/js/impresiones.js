const $loadSystem = $('.loadSystem');
moment.locale('es');
document.addEventListener('deviceready', onDeviceReady, false);
moment.locale('es-MX');

// Desconectar la impresora
export function desconectDeviceMoment() {
    printerSIPREF = JSON.parse(localStorage.getItem("PrinterSIPREF"));
    BTPrinter.disconnect(function (data) {
    }, function (err) {
    }, printerSIPREF.device);
}

export function onDeviceReady() {
    $("#display-device").empty();
    BTPrinter.status(function (data) {
        if (localStorage.getItem("PrinterSIPREF") === null) {
            $("#display-device").append("<button class='btn btn-block btn-xl btn-light-primary font-bold mt-3' onclick='onDevicePrinter();'>Vincular Impresora</button>");
        } else {
            $("#display-device").append("<button class='btn btn-block btn-xl btn-light-primary font-bold mt-3' onclick='desconectDevice();'>Quitar Impresora</button>");
            printerSIPREF = JSON.parse(localStorage.getItem("PrinterSIPREF"));
        }
    }, function (err) {
         //console.log(err)
    })
}

export function onDevicePrinter() {
    BTPrinter.status(function (data) {
        if (localStorage.getItem("PrinterSIPREF") === null) {
            listDeviceBluetooth();
        } else {
            printerSIPREF = JSON.parse(localStorage.getItem("PrinterSIPREF"));
            conectDevice(printerSIPREF.device);
        }
    }, function (err) {
        // console.log(err)
    })
}

export function listDeviceBluetooth() {
    const $select = $("#conectionDevice").empty().append('<option value="" selected>Seleccionar...</option>');
    $("#btnConectDevice").prop("disabled", true);
    BTPrinter.list(function (data) {
        $("#selectDevice").modal("show");
        for (let i = 0; i < data.length; i += 3) {
            $select.append($("<option>", {
                value: data[i],
                text: data[i]
            }));
        }
    }, function (err) {
        // console.log(err);
    })
}

export function activaBtnConectDevice() {
    if ($("#conectionDevice").val() != '') {
        $("#btnConectDevice").prop("disabled", false);
    } else {
        $("#btnConectDevice").prop("disabled", true);
    }
}

$("#btnConectDevice").click(function () {
    document.getElementById("textBtnConectDevice").textContent = "Conectando"
    $("#spinerBtnConectDevice").css("display","block");
    setTimeout(() => {
        conectDevice($("#conectionDevice").val())
    }, 150);
});

// Conectar la impresora
export function conectDevice(device) {
    window.BTPrinter.connect(function (data) {
        timerPrinter();
        document.getElementById("textBtnConectDevice").textContent = "Seleccionar Dispositivo"
        $("#spinerBtnConectDevice").css("display","none");

        $("#display-device").empty();
        $("#display-device").append("<button class='btn btn-block btn-xl btn-light-primary font-bold mt-3' onclick='desconectDevice();'>Quitar Impresora</button>");
        if (localStorage.getItem("PrinterSIPREF") === null) {
            var dataInf = { device: device, data: data }
            localStorage.setItem('PrinterSIPREF', JSON.stringify(dataInf));
        }
        $("#selectDevice").modal("hide");

        $("#conectionDevice").empty();
        $("#conectionDevice").append($("<option>", {
            value: '',
            text: 'Seleccionar...'
        }));
    }, function (err) {
        //alert(Fallo Conexion ${err})
        $(".printer-device").css("display", "none");
        $(".printer-device-error").css("display", "block");
        document.getElementById("textBtnConectDevice").textContent = "Seleccionar Dispositivo"
        $("#spinerBtnConectDevice").css("display","none");
    }, device);
}

// Conectar la impresora
export function conectDeviceMoment() {
    var device;
    if (localStorage.getItem("PrinterSIPREF") === null) {
        listDeviceBluetooth();
    } else {
        var printerSIPREF = JSON.parse(localStorage.getItem("PrinterSIPREF"));
        device = printerSIPREF.device;
        window.BTPrinter.connect(function (data) {
            if (localStorage.getItem("PrinterSIPREF") === null) {
                listDeviceBluetooth();
            } else {
                device = printerSIPREF.device;
            }
        }, function (err) {
            // console.log(err);
        }, device)
    }
}

// Desconectar la impresora
export function desconectDevice() {
    try {
        printerSIPREF = JSON.parse(localStorage.getItem("PrinterSIPREF"));        
    } catch (error) {
        console.log(error);
    }

    window.BTPrinter.disconnect(function (data) {
        $("#display-device").empty();
        $("#display-device").append("<button class='btn btn-block btn-xl btn-light-primary font-bold mt-3' onclick='onDevicePrinter();'>Vincular Impresora</button>");
        localStorage.removeItem("PrinterSIPREF");
    }, function (err) {
        $("#display-device").empty();
        $("#display-device").append("<button class='btn btn-block btn-xl btn-light-primary font-bold mt-3' onclick='onDevicePrinter();'>Vincular Impresora</button>");
        localStorage.removeItem("PrinterSIPREF");
    }, printerSIPREF.device);
}

// Imprimir el ticket
export function imprimir(op, tipoTicket) {
    telefonosContacto = localStorage.getItem("contactos");
    window.BTPrinter.setEncoding(function (data) {
    }, function (err) {
    }, "ISO-8859-1")

    switch (logo){
        case 'RegionDesarrrolloSistemas':
            window.BTPrinter.printBase64(function (data) {
                titleTicket(op, tipoTicket)
            }, function (err) {
                console.log(err)
            }, SIPREFJaliscoB64, '1')
            break;

        case 'RegionCentroMorelos':
            window.BTPrinter.printBase64(function (data) {
                titleTicket(op, tipoTicket)
            }, function (err) {
                console.log(err)
            }, SIPREFMorelosB64, '1')
            break;
        
        case 'RegionJalisco':
            window.BTPrinter.printBase64(function (data) {
                titleTicket(op, tipoTicket)
            }, function (err) {
                console.log(err)
            }, SIPREFJaliscoB64, '1')
            break;

            case 'RegionQueretaro':
                window.BTPrinter.printBase64(function (data) {
                    titleTicket(op, tipoTicket)
                }, function (err) {
                    console.log(err)
                }, SIPREFTepicB64, '1')
                break;
            
            case 'RegionTepicJocotepec':
                window.BTPrinter.printBase64(function (data) {
                    titleTicket(op, tipoTicket)
                }, function (err) {
                    console.log(err)
                }, SIPREFTepicB64, '1')
                break;
    }
    
}

export function titleTicket(op, tipoTicket) {
    var titulo = "";
    switch (op) {
        case 'pago':
            tipoTicket == "original" ? titulo = titleTicketString : titulo = titleTicketStringCOPY;
            break;

        case 'gestion':
            tipoTicket == "original" ? titulo = titleTicketString : titulo = titleTicketStringCOPY;
            break;

        case 'checkListMoto':
            titulo = titleTicketCheckListMoto;
            break;

        case 'ActivacionContrato':
            titulo = titleTicketCheckListEntregaContrato;
            break;

        case 'historico':
            titulo = titleTicketCheckListHistorico;
            break;
        
        case 'reimprimir':
            titulo = titleTicketString;
            break;

        default:
            break;
    }

    window.BTPrinter.printTextSizeAlign(function (data) {
        subTitleTicket(op)
    }, function (err) {
        alert('Error 1: ' + err);
    }, titulo, '8', '1')
}

//Subtitulo: Tipo de Operacion
export function subTitleTicket(op) {
    switch (op) {
        case 'pago':
            window.BTPrinter.printText(function (data) {
                window.BTPrinter.printTextSizeAlign(function (data) {
                    bodyUno(op)
                }, function (err) {
                    console.log(err);
                }, 'Aportacion', '10', '1')
            }, function (err) {
                console.log(err);
            }, "--------------------------------\n")
            break;

        case 'gestion':
            const Gestion = localStorage.getItem("gestionActual")?JSON.parse(localStorage.getItem("gestionActual")):"/";
            //Codigo anterior
            //var tipoGestion = $('#tipoGestion').text();
            var tipoGestion = Gestion.Gestion;
            if (tipoGestion == 'Cancelación Solicitada') {
                tipoGestion = 'Cancelacion Solicitada';
            }
            window.BTPrinter.printText(function (data) {
                window.BTPrinter.printTextSizeAlign(function (data) {
                    bodyUno(op);
                }, function (err) {
                    // alert(err);
                }, 'Gestion: ' + tipoGestion, '10', '1')
            }, function (err) {
                alert(err);
            }, "--------------------------------\n")
            break;

        case 'checkListMoto':
            window.BTPrinter.printText(function (data) {
                window.BTPrinter.printTextSizeAlign(function (data) {
                    bodyTicket(op);
                }, function (err) {
                    alert(err);
                }, 'Inicio Operativo', '10', '1')
            }, function (err) {
                alert(err);
            }, "--------------------------------\n")
            break;

        case 'ActivacionContrato':
            window.BTPrinter.printText(function (data) {
                window.BTPrinter.printTextSizeAlign(function (data) {
                    bodyTicket(op);
                }, function (err) {
                    alert(err);
                }, 'Entrega de contrato: ' + $("#numeroCEliteEntrega").text(), '10', '1')
            }, function (err) {
                alert(err);
            }, "--------------------------------\n")
            break;

        case 'historico':
            window.BTPrinter.printText(function (data) {
                window.BTPrinter.printTextSizeAlign(function (data) {
                    bodyTicket(op);
                }, function (err) {
                    alert(err);
                }, 'Operaciones del dia', '1', '1')
            }, function (err) {
                alert(err);
            }, "--------------------------------\n")
            break;
        
        case 'reimprimir':
            BTPrinter.printText(function (data) {
                BTPrinter.printTextSizeAlign(function (data) {
                    bodyUno(op);
                }, function (err) {
                    console.log(err);
                }, 'Aportacion', '10', '1')
            }, function (err) {
                console.log(err);
            }, "--------------------------------\n")
            break;
        default:
            break;
    }
}

export function textNegrita(op){
    const actual = localStorage.getItem("ticketSeleccionado")?JSON.parse(localStorage.getItem("ticketSeleccionado")):"/";
    let inversionista = ''
    switch(op){
        case 'pago':
            //inversionista = $("#InverT").text()
            inversionista = actual.Inversionista
            //let lastTicket2 = JSON.parse(localStorage.getItem("lastTicket"));
            codigoContrato = actual.RefCuenta.substring(-8)
            break;
        case 'gestion':
            //inversionista = $('#inversionista').text()
            inversionista = actual.Inversionista
            break;
        case 'reimprimir': 
            let lastTicket = JSON.parse(localStorage.getItem("lastTicket"));
            inversionista = lastTicket.Inversionista
            codigoContrato = actual.RefCuenta.substring(-8)
            break;
    }

    BTPrinter.printTextSizeAlign(function (data) {
        numberContrato(op)
    }, function (err) {
        //alert("Error textNegrita")
    }, inversionista, '10', '1')
}

export function numberContrato(op) {
    const actual = localStorage.getItem("ticketSeleccionado")?JSON.parse(localStorage.getItem("ticketSeleccionado")):"/";
    let bodyText = `NO. CONTRATO: `
    
    switch(op){
        case 'pago':
            //bodyText += $("#NContratoP").text()
            bodyText += actual.Numero?actual.Numero:actual.Contrato
            break;
        case 'gestion':
            //bodyText += $('#NContratoG').text()
            bodyText += actual.Numero?actual.Numero:actual.Contrato
            break;
        case 'reimprimir':
            let lastTicket = JSON.parse(localStorage.getItem("lastTicket"));
            bodyText += lastTicket.Contrato;
            break;
    }

    BTPrinter.printTextSizeAlign(function (data) {
        bodyTicket(op)
    }, function (err) {
        //alert('Error numberContrato: ' + err);
    }, bodyText, '0', '1')
}

//Imprime Folio y Fecha
function bodyUno(op){
    const actual = localStorage.getItem("ticketSeleccionado")?JSON.parse(localStorage.getItem("ticketSeleccionado")):"/";
    let sizeText = '0'
    let folio = ''
    let texto = ''
    const FECHA = moment(new Date())
    let fechaFormat = 'd'
    switch (op) {
        case 'pago':
            //folio = $('#FolioTicket').text()
            folio=actual.FolioTicket
            texto = `
            FOLIO: ${folio}
            FECHA: ${fechaFormat}\n`
            break;

        case 'gestion':
            texto = `
FECHA: ${fechaFormat}\n`
            break;
        
        case 'reimprimir':
            let lastTicket = JSON.parse(localStorage.getItem("lastTicket"));
            folio = lastTicket.FolioTicket;
            texto = `
FOLIO: ${folio}
FECHA: ${fechaFormat}\n`
            break;
    }
    BTPrinter.printTextSizeAlign(function (data) {
        textNegrita(op)
    }, function (err) {
    }, texto, sizeText, '1');
}

function bodyTicket(op) {
    const actual = localStorage.getItem("ticketSeleccionado")?JSON.parse(localStorage.getItem("ticketSeleccionado")):"/";
    let sizeText = '0',
    bodyText = '',
    aportacion = '',
    restante = '',
    fecha_Ul = '',
    ultima_A = '',
    representante = ''
    let res=0; 
    try {
        let lastTicketPago = JSON.parse(localStorage.getItem("lastTicket"));
        res=lastTicketPago.RestantePlan?lastTicketPago.RestantePlan:'';
    } catch (error) {
        
    }

    switch (op) {
        case 'pago':
            aportacion = "$" + $("#MontoT").text()?$("#MontoT").text():actual.Monto,
            restante = res,
            fecha_Ul = $("#UltimaA").text(),
            ultima_A = fecha_Ul == "Sin Aportaciones" ? "Sin Aportaciones" : moment($("#UltimaA").text()).format('LLL'),
            representante = $("#RIST").text();
            
            bodyText = `
            APORTACION: ${aportacion}
            SALDO RESTANTE: $${restante}
            APORTACION ANTERIOR:
            ${ultima_A}
            --------------------------------
            Representante de Inversion:
            ${representante}
            --------------------------------`
            break;

        case 'reimprimir':
            let lastTicket = JSON.parse(localStorage.getItem("lastTicket"));
            let Aultima = lastTicket.UltimaA == "Sin Aportaciones" ? "Sin Aportaciones" : moment(new Date(lastTicket.UltimaA)).format('LLL');

            bodyText = `
APORTACION: $${lastTicket.Monto}
SALDO RESTANTE: $${lastTicket.RestantePlan}
APORTACION ANTERIOR:
${Aultima}
--------------------------------
Representante de Inversion:
${lastTicket.Colaborador}
--------------------------------`
            break;

        case 'gestion':
            const gestion = localStorage.getItem("gestionActual")?JSON.parse(localStorage.getItem("gestionActual")):"/";
            let descripcion=gestion.Descripcion
            bodyText = `
DESCRIPCION:
${descripcion}
--------------------------------
Representante de Inversion:
${dataUserSIPREF.Nombre} ${dataUserSIPREF.Apellido}
--------------------------------`
            break;

        case 'checkListMoto':
            var nombreCheckList = $('.nombreCheckList').text();
            var fechaCheckList = $('.fechaCheckList').text();
            var fecha = moment(fechaCheckList).format('DD/MM/YYYY');
            var hora = moment(fechaCheckList).format('LTS');
            var kmSalidaCheckList = $('.kmSalidaCheckList').text();
            var gasilinaCheckList = $('.gasilinaCheckList').text();
            var latitudCheckList = $('.latitudCheckList').text();
            var longitudCheckList = $('.longitudCheckList').text();
            bodyText = `
RIS/ELITE: 
${nombreCheckList}\n
FECHA: ${fecha} - ${hora}\n
KM SALIDA: ${kmSalidaCheckList}\n
GASOLINA: ${gasilinaCheckList}\n
LATITUD: ${latitudCheckList}\n
LONGITUD: ${longitudCheckList}\n
--------------------------------`
            break;

        case 'ActivacionContrato':
            var fechaCheckList = new Date();
            var fecha = moment(fechaCheckList).format('DD/MM/YYYY');
            var hora = moment(fechaCheckList).format('LTS');
            var NombreIner = $('#NombreICEliteEntrega').text();
            var NombrePlan = $('#PlanCEliteEntrega').text();
            bodyText = `
ELITE: 
${dataUserSIPREF.Nombre + " " + dataUserSIPREF.Apellido}\n
FECHA: ${fecha} - ${hora}\n
INVERSIONISTA: ${NombreIner}\n
PLAN: ${NombrePlan}\n    
--------------------------------`
            break;

        case 'historico':
            bodyText = $(".dataALLData").text();
            sizeText = '1';
            break;

        default:
            break;
    }

    BTPrinter.printTextSizeAlign(function (data) {
        footerTicket(op)
    }, function (err) {
        //alert('Error bodyTicket: ' + err);
    }, bodyText, sizeText, '1')
}


function titleTicketEstadoC(Info, inversionista, numeroc, restante) {
    BTPrinter.printTextSizeAlign(function (data) {
        bodyTicketEstadoC(Info, inversionista, numeroc, restante);
    }, function (err) {
        console.log(err)
    }, titleTicketString, '8', '1')
}

function bodyTicketEstadoC(Info, inversionista, numeroc, restante) {
    var fecha = moment(new Date()).format('LLL');
    var bodyTicketString = `--------------------------------\n
Fecha:
${fecha}\n
INVERSIONISTA:
${inversionista}\n
No. CONTRATO: ${numeroc}\n
SALDO RESTANTE: ${restante}\n
ESTADO DE CUENTA:\n
${Info}
--------------------------------\n
Representante de Inversion:
${dataUserSIPREF.Nombre + " " + dataUserSIPREF.Apellido}\n`
    BTPrinter.printTextSizeAlign(function (data) {
        timerPrinter();
        footerTicket(op);
    }, function (err) {
        alert(err)
    }, bodyTicketString, '8', '1')
}

function footerTicket(op) {
    var footerTicketString =
    "SIEMPRE A TU LADO\n"+
    "Dudas o comentarios sobre tus "+
    "inversiones\n"+
    "TELEFONOS DE CONTACTO:\n" + telefonosContacto;

    BTPrinter.printTextSizeAlign(function (data) { }, function (err) {
        alert("Error 4:" + err)
    }, footerTicketString, '0', '1');

    BTPrinter.printBase64(function (data) { }, function (err) {
        console.log(err)
    }, imageFooter, '0');


    //Promoción: Código de Sistema para Promociones
    if (logo == "") {
        if (op == "pago" || op == "reimprimir") {
            BTPrinter.printTextSizeAlign(function (data) {
            }, function (err) {
            }, "--------------------------------", '0', '1');
    
            BTPrinter.printTextSizeAlign(function (data) { }, function (err) {
            }, 'Id.Inversionista', '0', '1');
    
            BTPrinter.printTextSizeAlign(function (data) {
            }, function (err) {
            }, codigoContrato + '\n', '12', '1')

            BTPrinter.printTextSizeAlign(function (data) {
            }, function (err) {
            }, "--------------------------------" + '\n', '0', '1');
            
        } else {
            BTPrinter.printTextSizeAlign(function (data) {
            }, function (err) {
            }, "\n", '0', '1');
        }
    } else {
        BTPrinter.printTextSizeAlign(function (data) {
        }, function (err) {
        }, "\n", '0', '1');
    }
}
