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
        const url = "https://abonos.sipecem.com.mx/api/logIn";
        const datos = { email: $email.value, password: $password.value }

        const respLogin = await manejadorAPI(metodo, url, datos);
        
        $loadSystem.fadeToggle(1000);

        setTimeout(function () { $loadSystem.addClass('d-none'); }, 500);

        if (respLogin.msg == "Usuario no registrado" || respLogin.msg == "Credenciales incorrectas") {
            ocultarPreload()
            $email.classList.add('is-invalid');
            $password.classList.add('is-invalid');
        }
        else if(respLogin.msg == "Licencia inactiva") {
            ocultarPreload()
            // console.log("Licencia inactiva");
            loadModal('modalDinamico', './components/modal.html', 'Lo sentimos 🥺, Tú licencia ha vencido...');
            $(".modalDinamico").addClass("bg-btn-primario");
        }
        else if(respLogin.msg == "Estas fuera de tu horario") {
            ocultarPreload()
            // console.log("Estas fuera de tu horario");
            loadModal('modalDinamico', './components/modal.html','Lo sentimos 🥺, Estás fuera del turno laboral.');
            $(".modalDinamico").addClass("bg-btn-primario");

        }else {
            //Obtenemos los catalogos            
            try {
                let data = { usuario: respLogin.id }
                const urlCatalogos = 'https://abonos.sipecem.com.mx/api/getCatalogos';
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
            if (respLogin.contra_update == 0) {
                setTimeout(function () { $(window).attr('location', 'views/cambiarAcceso.html') }, 500);
            } else {
                setTimeout(function () { $(window).attr('location', 'views/home.html') }, 500);
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

$('#password').keypress(function (e) {
    if (e.keyCode == 13) {        
        $('#btnLogin').click();
    }
});
async function mostrarPreload(){
    $(".loadSystem").removeClass('d-none');
    $(".loadSystem").css('display',"block");
}
async function ocultarPreload(){
    $loadSystem.fadeToggle(1000);
    $(".loadSystem").addClass('d-none');
}