window.addEventListener("orientationchange", function(){
    window.screen.orientation
    .lock("landscape-primary")
    .then(
        success => console.log(success),
        failure => console.log(failure)
    ).catch(function(error) {
        console.log(error);
    });
});
