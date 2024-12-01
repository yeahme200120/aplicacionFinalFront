//imports
import { getUserLocal, manejadorAPI } from "./general.js";

//Variables
const $newPassword = $('#newPasword');
const $confirmaPassword = $('#confirmaPasword');

$('#cambiarAcceso').click(async () => {

    const newPass = $newPassword.val();
    const confirmaPass = $confirmaPassword.val();

    if (newPass == "" || confirmaPass == "") {
        Toastify({
            text: "Completa la información!",
            duration: 3000,
            backgroundColor: "#f4d03f"
        }).showToast();
        return
    }

    if (newPass === confirmaPass) {
        const dataUser = getUserLocal();
        console.log("dataUser -> ", dataUser);
        console.log("dataUser 2 -> ", JSON.stringify(dataUser));
        
        const metodo = 'POST';
        const url = 'http://127.0.0.1:8000/api/changePasswordApi';
        const datos = {
            usuario: JSON.stringify(dataUser),
            new_password: newPass
        }

        const respApi = await manejadorAPI(metodo, url, datos);
        if (respApi === 1) {
            Toastify({
                text: "¡Contraseña actualizada!",
                duration: 3000,
                backgroundColor: "#28b463"
            }).showToast();

            setTimeout(function () { $(window).attr('location', './home.html') }, 500);
        } else {
            Toastify({
                text: "Ocurrió un error!",
                duration: 3000,
                backgroundColor: "#f7dc6f"
            }).showToast();
        }
    } else {
        Toastify({
            text: "Las contraseñas no coinciden!",
            duration: 3000,
            backgroundColor: "#f7dc6f"
        }).showToast();
    }
});

$('#muestraNewPassword').click(() => {
    if ($("#showNewPassword").hasClass('bi-eye-slash')) {
        $("#newPasword").attr('type', 'text').focus();
        $("#showNewPassword").removeClass('bi-eye-slash').addClass('bi-eye');
    } else if ($("#showNewPassword").hasClass('bi-eye')) {
        $("#newPasword").attr('type', 'password').focus();
        $("#showNewPassword").removeClass('bi-eye').addClass('bi-eye-slash');
    }
});

$('#muestraConfirmPassword').click(() => {
    if ($("#showConfirmPassword").hasClass('bi-eye-slash')) {
        $("#confirmaPasword").attr('type', 'text').focus();
        $("#showConfirmPassword").removeClass('bi-eye-slash').addClass('bi-eye');
    } else if ($("#showConfirmPassword").hasClass('bi-eye')) {
        $("#confirmaPasword").attr('type', 'password').focus();
        $("#showConfirmPassword").removeClass('bi-eye').addClass('bi-eye-slash');
    }
});