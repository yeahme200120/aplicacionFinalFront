//Imports
import { getUserLocal } from "./general.js";

document.getElementById('btnComenzar').addEventListener('click', () => {
    console.log("existe user local -> ",);
    if (getUserLocal() === false) {
        location.href = "login.html";
    } else {
        setTimeout(function () { $(window).attr('location', 'views/home.html') }, 500);
    }
});
