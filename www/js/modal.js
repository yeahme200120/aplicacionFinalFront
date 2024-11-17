export function loadModal(modalId, contentUrl, contenido_msg) {
    // Cargar el contenido del archivo HTML
    fetch(contentUrl)
        .then(response => response.text())
        .then(html => {
            // Verificar si la modal ya está en el DOM
            if (!document.querySelector(`#${modalId}`)) {
                // Agregar la modal al body
                document.body.insertAdjacentHTML('beforeend', html);
            }

            //Agregar mensaje dinamico modal
            $('.modal-msg').text(contenido_msg);

            // Mostrar la modal usando Bootstrap
            $(`#${modalId}`).modal('show');
        })
        .catch(error => console.error('Error al cargar la modal:', error));
}

export function showLoad(loadId, contentUrl, opcion) {
    // Cargar el contenido del archivo HTML
    fetch(contentUrl)
        .then(response => response.text())
        .then(html => {
            // Verificar si la modal ya está en el DOM
            if (!document.querySelector(`.${loadId}`)) {
                // Agregar la modal al body
                document.body.insertAdjacentHTML('beforeend', html);
            }

            if (opcion == "show") {
                //Mostrar load
                $(`.${loadId}`).removeClass('d-none');
            } else if(opcion == "hide") {
                $(`.${loadId}`).fadeToggle(1000);
            }

            
        })
        .catch(error => console.error('Error al cargar la modal:', error));
}