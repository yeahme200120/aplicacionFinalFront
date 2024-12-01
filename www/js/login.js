//Imports
import { manejadorAPI, getEmpresa } from '../js/general.js'
import { loadModal } from "../js/modal.js";

//Variables
const $email = document.getElementById('email');
const $password = document.getElementById('password');
const $loadSystem = $('.loadSystem');
// const $modalSystem = $('#exampleModal');

document.getElementById('btnLogin').addEventListener('click', async () => {
    if ($("#email").hasClass('is-invalid') || $("#password").hasClass('is-invalid')) {
        return
    }
    else if (!$email.value || !$password.value ) {
        $email.classList.add('is-invalid');
        $password.classList.add('is-invalid');
        return
    }
    mostrarPreload()
        
    
        try {
            const metodo = "POST";
            const url = "http://127.0.0.1:8000/api/logIn";
            const datos = { email: $email.value, password: $password.value }
    
            const respLogin = await manejadorAPI(metodo, url, datos);
            
           
    
            if (respLogin.msg == "Usuario no registrado" || respLogin.msg == "Credenciales incorrectas") {
                $email.classList.add('is-invalid');
                $password.classList.add('is-invalid');  
                ocultarPreload()
            }
            else if(respLogin.msg == "Licencia inactiva") {
                // console.log("Licencia inactiva");
                loadModal('modalDinamico', './components/modal.html', 'Lo sentimos 🥺, Tú licencia ha vencido...');
                $(".modalDinamico").addClass("bg-btn-primario");    
                ocultarPreload()
            }
            else if(respLogin.msg == "Estas fuera de tu horario") {
                // console.log("Estas fuera de tu horario");
                loadModal('modalDinamico', './components/modal.html','Lo sentimos 🥺, Estás fuera del turno laboral.');
                $(".modalDinamico").addClass("bg-btn-primario");
                
                ocultarPreload()
            }else {
                //Obtenemos los catalogos            
                try {
                    let data = { usuario: respLogin.id }
                    const urlCatalogos = 'http://127.0.0.1:8000/api/getCatalogos';
                    const respCatalogos = await manejadorAPI("POST",urlCatalogos,data)
                    
                    localStorage.removeItem("Catalogos")
                    localStorage.setItem('Catalogos', JSON.stringify(respCatalogos));
                } catch (error) {
                    console.log("Error al traer los catalogos: ", error);
                    return 
                    
                }
    
                const dataUser = JSON.stringify(respLogin)
                localStorage.setItem("DataUser", dataUser)
                respLogin.contra_update++
                getEmpresa();
                switch (respLogin.id_rol) {
                    case 0:
                        //Master
                        setTimeout(function () { $(window).attr('location', 'views/home.html') }, 500);
                    break;
                    case 2:
                        //Administrador
                        setTimeout(function () { $(window).attr('location', 'views/home.html') }, 500);
                    break;
                    case 3:
                        //Mesero
                        setTimeout(function () { $(window).attr('location', 'views/meseros/mesero.html') }, 500);
                    break;
                    case 4:
                        //Cajero
                        setTimeout(function () { $(window).attr('location', 'views/cajeros/cajero.html') }, 500);
                    break;
                    default:
                        break;
                }
            }
            
        } catch (error) {
            console.log("Ocurrió un error -> ", error);
            ocultarPreload()
        }
    
});

$('#email, #password').click(() => {
    $email.classList.remove('is-invalid');
    $password.classList.remove('is-invalid');
});

$('#muestra-password').click(() => {
    if ($("#showPassword").hasClass('bi-eye-slash')) {
        $("#password").attr('type', 'text').focus();
        $("#showPassword").removeClass('bi-eye-slash').addClass('bi-eye');
    } else if ($("#showPassword").hasClass('bi-eye')) {
        $("#password").attr('type', 'password').focus();
        $("#showPassword").removeClass('bi-eye').addClass('bi-eye-slash');
    }
});

/* $('#password').keypress(function (e) {
    if (e.keyCode == 13) {        
        $('#btnLogin').click();
    }
}); */
async function mostrarPreload(){
    $(".loadSystem").removeClass('d-none');
    $(".loadSystem").css('display',"block");
}
async function ocultarPreload(){
    $loadSystem.fadeToggle(1000);
    $(".loadSystem").addClass('d-none');
}