(function () {
    "use strict";

    document.addEventListener( 'deviceready', onDeviceReady.bind( this ), false );

    function onDeviceReady() {
        // Handle the Cordova pause and resume events
        document.addEventListener( 'pause', onPause.bind( this ), false );
        document.addEventListener('resume', onResume.bind(this), false);
        document.addEventListener("deviceready", setIpFirstTime, false);
        document.addEventListener("deviceready", setNameFirstTime, false);
        document.addEventListener("deviceready", updateEverything, false);
        document.addEventListener("deviceready", initializeControls, false);
        
        
        // TODO: Cordova has been loaded. Perform any initialization that requires Cordova here.
        var parentElement = document.getElementById('deviceready');
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');
        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');
    };

    function onPause() {
        
    };

    function onResume() {

    };
})();

var configuracionList = window.localStorage;

function initializeControls() {
    
    $("body").on("swiperight", function () {

        openMenu();

    });

    $("body").on("swipeleft", function () {

        closeMenu();

    });

    $("#customBody").on("touchstart", function () {

        closeMenu();

    });

    $("#buttonIngresar").click(function () {

        ingresarComanda();
        
    });

    $("#buttonBuscar").click(function () {

        buscarComandaEditar();

    });

    $("#buttonCambiarIp").click(function () {

        changeIp();

    });

    $("#buttonCambiarNombre").click(function () {

        changeName();

    });

    $("#linkIngresar").click(function () {

        loadPageIngresar();

    });

    $("#linkActualizar").click(function () {

        loadPageActualizar();

    });

    $("#linkEditar").click(function () {

        loadPageEditar();

    });

    $("#linkConfig").click(function () {

        loadPageConfig();

    });

    $("#linkInfo").click(function () {

        loadPageInfo();

    });

    $("#txtNombreAlimento").focus();

    $('#txtNombreAlimento').on('keypress', function (e) {
        if (e.keyCode == 13) {
            $("#txtNombreBebida").focus();
        }
    });

    $('#txtNombreBebida').on('keypress', function (e) {
        if (e.keyCode == 13) {
            $("#txtNumMesa").focus();
        }
    });

    $('#txtNumMesa').on('keypress', function (e) {
        if (e.keyCode == 13) {
            $("#txtNumPuesto").focus();
        }
    });

    $('#txtNumPuesto').on('keypress', function (e) {
        if (e.keyCode == 13) {

            ingresarComanda();

        }
    });

}

function updateEverything() {

    var fechaIngresoFormatted = $(".spanFecha").html();

    $.ajax({
        type: "POST",
        url: "http://" + configuracionList.getItem("IpServer") + "/Comandapp/BackendFolder/consultarComandas.php",
        data: {

            fechaIngresoFormatted: fechaIngresoFormatted

        },
        cache: false,
        success: function (data) {

            $(".spanNombre").html(configuracionList.getItem("NombreMesero"));
            $(".spanFecha").html(setDate());
            $(".spanIp").html(configuracionList.getItem("IpServer"));
            $(".spanStatus").html("Online");


            $(".divStatus").css("background-color", "#006600");
            StatusBar.backgroundColorByHexString("#006600");

            $("#tableComandas").replaceWith(data);

        },
        error: function () {

            $(".spanNombre").html("");
            $(".spanFecha").html("");
            $(".spanIp").html(configuracionList.getItem("IpServer"));
            $(".spanStatus").html("Offline");


            $(".divStatus").css("background-color", "#990000");
            StatusBar.backgroundColorByHexString("#990000");

            $("#tableComandas").replaceWith("<p id='tableComandas'> No hay conexion con la base de datos </p>");

        }
    })

    setTimeout(updateEverything, 1000);

}

function ingresarComanda() {

    var fechaIngresoFormatted = $(".spanFecha").html();
    var nombreMesero = $(".spanNombre").html();
    var nombreAlimento = $("#txtNombreAlimento").val();
    var nombreBebida = $("#txtNombreBebida").val();
    var numMesa = $("#txtNumMesa").val();
    var numPuesto = $("#txtNumPuesto").val();

    if ($(".spanFecha").html() == "" || $(".spanNombre").html() == "" || $("#txtNombreBebida").val() == "" || $("#txtNumMesa").val() == "" || $("#txtNumPuesto").val() == "") {

        window.plugins.toast.showWithOptions({
            message: "Faltan datos!",
            duration: "short",
            position: "center",
            styling: {
                opacity: 0.5,
                backgroundColor: '#cc0000',
                textColor: '#ffffff'
            }

        });

    }

    else {

        $.ajax({
            type: "POST",
            url: "http://" + configuracionList.getItem("IpServer") + "/Comandapp/BackendFolder/ingresarComanda.php",
            data: {
                fechaIngresoFormatted: fechaIngresoFormatted,
                nombreMesero: nombreMesero,
                nombreAlimento: nombreAlimento,
                nombreBebida: nombreBebida,
                numMesa: numMesa,
                numPuesto: numPuesto
            },
            cache: false,
            success: function (data) {

                window.plugins.toast.showWithOptions({
                    message: "Comanda Ingresada!",
                    duration: "short",
                    position: "center",
                    styling: {
                        opacity: 0.5,
                        backgroundColor: '#009933',
                        textColor: '#ffffff'
                    }

                });
                
                $("#txtNombreAlimento").val("");
                $("#txtNombreBebida").val("");
                $("#txtNumMesa").val("");
                $("#txtNumPuesto").val("");
                $("#txtNombreAlimento").focus();
            },
            error: function () {
                showConnectionErrorOnEnter();
            }
        })

    }

}

function buscarComandaEditar() {

    var idComandaEditar = $("#idComandaEditar").val();

    if ($("#idComandaEditar").val() == "") {

        window.plugins.toast.showWithOptions({
            message: "Ingresa un id de comanda para buscar y editar",
            duration: "short",
            position: "center",
            styling: {
                opacity: 0.5,
                backgroundColor: '#cc0000',
                textColor: '#ffffff'
            }

        });

    }

    else {

        $.ajax({
            type: "POST",
            url: "http://" + configuracionList.getItem("IpServer") + "/Comandapp/BackendFolder/buscarComandaEditar.php",
            data: {
                idComandaEditar: idComandaEditar
            },
            cache: false,
            success: function (data) {
                window.plugins.toast.showWithOptions({
                    message: "Encontrada",
                    duration: "short",
                    position: "center",
                    styling: {
                        opacity: 0.5,
                        backgroundColor: '#009933',
                        textColor: '#ffffff'
                    }

                });
                $("#divCamposEditar").replaceWith(data);

            },
            error: function () {

                var message = "No hay conexion con el servidor!";
                var title = "Error al buscar comanda";
                var buttonLabels = "OK";
                navigator.notification.confirm(message, confirmCallback, title, buttonLabels);

                function confirmCallback(buttonIndex) {


                }

            }
        })

    }

}

function editarComanda() {

    var idComandaEditar = $("#idComandaEditar").val();
    var newNombreMesero = $("#txtNewNombreMesero").val();
    var newNombreAlimento = $("#txtNewComida").val();
    var newNombreBebida = $("#txtNewBebida").val();
    var newNumMesa = $("#txtNewNumMesa").val();
    var newNumPuesto = $("#txtNewNumPuesto").val();

    if ($("#idComandaEditar").val() == "" || $("#txtNewNombreMesero").val() == "" || $("#txtNewComida").val() == "" || $("#txtNewBebida").val() == "" || $("#txtNewNumMesa").val() == "" || $("#txtNewNumPuesto").val() == "") {

        var message = "Faltan datos!";
        var title = "Error al ingresar datos!";
        var buttonLabels = "OK";
        navigator.notification.confirm(message, confirmCallback, title, buttonLabels);

        function confirmCallback(buttonIndex) {


        }

    }

    else {

        $.ajax({
            type: "POST",
            url: "http://" + configuracionList.getItem("IpServer") + "/Comandapp/BackendFolder/editarComanda.php",
            data: {
                idComandaEditar: idComandaEditar,
                newNombreMesero: newNombreMesero,
                newNombreAlimento: newNombreAlimento,
                newNombreBebida: newNombreBebida,
                newNumMesa: newNumMesa,
                newNumPuesto: newNumPuesto
            },
            cache: false,
            success: function (data) {
                var message = "Comanda Editada!";
                var title = "Exito!";
                var buttonLabels = "OK";
                navigator.notification.confirm(message, confirmCallback, title, buttonLabels);

                function confirmCallback(buttonIndex) {

                }

                $("#idComandaEditar").val("");
                $("#txtNewNombreMesero").val("");
                $("#txtNewComida").val("");
                $("#txtNewBebida").val("");
                $("#txtNewNumMesa").val("");
                $("#txtNewNumPuesto").val("");
            },
            error: function () {
                var message = "Algo erroneo paso en el proceso de editacion de la comanda";
                var title = "Error";
                var buttonLabels = "OK";
                navigator.notification.confirm(message, confirmCallback, title, buttonLabels);

                function confirmCallback(buttonIndex) {

                }
            }
        })

    }

}

function transformMonth(month) {
    if (month < 10) {
        return "0" + (month + 1);
    }

    else {
        return (month + 1);
    }
}

function setDate() {
    var fechaMala = new Date();

    var fechaBuena = fechaMala.getFullYear() + "-" + transformMonth(fechaMala.getMonth()) + "-" + ("0" + fechaMala.getDate()).slice(-2);

    return fechaBuena;

}

function setName() {

    $(".spanNombre").html(configuracionList.getItem("NombreMesero"));

}

function showKeyboard() {
    Keyboard.show();
}

function showConnectionErrorOnEnter() {
    var message = "No hay conexion con el servidor!";
    var title = "Error al ingresar datos!";
    var buttonLabels = "Salir,Intentar de nuevo";
    navigator.notification.confirm(message, confirmCallback, title, buttonLabels);

    function confirmCallback(buttonIndex) {

        if (buttonIndex == 2) {
            ingresarComanda();
        }
    }
}

function showConnectionErrorOnUpdate() {
    var message = "No hay conexion con el servidor!";
    var title = "Error al actualizar la tabla!";
    var buttonLabels = "Salir,Intentar de nuevo";
    navigator.notification.confirm(message, confirmCallback, title, buttonLabels);

    function confirmCallback(buttonIndex) {

        if (buttonIndex == 2) {
            updateEverything();
        }
    }
}

function setNameFirstTime() {

    if (configuracionList.length == 0) {

        var message = "Por favor, ingresa tu nombre";
        var title = "Configuración";
        var buttonLabels = ["Ok"];
        var defaultText = "Nombre Apellido"
        navigator.notification.prompt(message, promptCallback,
            title, buttonLabels, defaultText);

        function promptCallback(result) {
            configuracionList.setItem("NombreMesero", result.input1);
        }

    }

}

function setIpFirstTime() {

    if (configuracionList.length == 0) {

        var message = "Por favor, ingresa la dirección ip del servidor";
        var title = "Configuración";
        var buttonLabels = ["Ok"];
        var defaultText = "0.0.0.0"
        navigator.notification.prompt(message, promptCallback,
            title, buttonLabels, defaultText);

        function promptCallback(result) {
            configuracionList.setItem("IpServer", result.input1);
        }
        
    }

}

function changeIp() {

    if ($("#txtIpServer").val() == "") {

        window.plugins.toast.showWithOptions({
            message: "Dirección IP no puede estar vacia",
            duration: "short",
            position: "center",
            styling: {
                opacity: 0.5,
                backgroundColor: '#cc0000',
                textColor: '#ffffff'
            }

        });

    } 

    else {

        configuracionList.setItem("IpServer", $("#txtIpServer").val());

    }

}

function changeName() {

    if ($("#txtNombre").val() == "") {

        window.plugins.toast.showWithOptions({
            message: "Nombre del mesero no puede estar vacio",
            duration: "short",
            position: "center",
            styling: {
                opacity: 0.5,
                backgroundColor: '#cc0000',
                textColor: '#ffffff'
            }

        });

    }

    else {

        configuracionList.setItem("NombreMesero", $("#txtNombre").val());

    }

}

function openMenu() {

    $("#panelGlobal").animate({
        width: "show"
    }, 180);

}

function closeMenu() {

    $("#panelGlobal").animate({
        width: "hide"
    }, 180);

}

function loadPageIngresar() {

    $("#pageInicio").hide();
    $("#pageIngresar").show();
    $("#pageActualizar").hide();
    $("#pageEditar").hide();
    $("#pageConfig").hide();
    $("#pageInfo").hide();

    closeMenu();

}

function loadPageActualizar() {

    $("#pageInicio").hide();
    $("#pageIngresar").hide();
    $("#pageActualizar").show();
    $("#pageEditar").hide();
    $("#pageConfig").hide();
    $("#pageInfo").hide();

    closeMenu();

}

function loadPageEditar() {

    $("#pageInicio").hide();
    $("#pageIngresar").hide();
    $("#pageActualizar").hide();
    $("#pageEditar").show();
    $("#pageConfig").hide();
    $("#pageInfo").hide();

    closeMenu();

}

function loadPageConfig() {

    $("#pageInicio").hide();
    $("#pageIngresar").hide();
    $("#pageActualizar").hide();
    $("#pageEditar").hide();
    $("#pageConfig").show();
    $("#pageInfo").hide();

    closeMenu();

}

function loadPageInfo() {

    $("#pageInicio").hide();
    $("#pageIngresar").hide();
    $("#pageActualizar").hide();
    $("#pageEditar").hide();
    $("#pageConfig").hide();
    $("#pageInfo").show();

    closeMenu();

}

//function scan() {
//    cordova.plugins.barcodeScanner.scan(
//        function (result) {
//            if (!result.cancelled) {
//                if (result.format == "QR_CODE") {
//                    navigator.notification.prompt("Please enter name of data", function (input) {
//                        var name = input.input1;
//                        var value = result.text;

//                        var data = localStorage.getItem("LocalData");
//                        console.log(data);
//                        data = JSON.parse(data);
//                        data[data.length] = [name, value];

//                        localStorage.setItem("LocalData", JSON.stringify(data));

//                        alert("Done");
//                    });
//                }
//            }
//        },
//        function (error) {
//            alert("Scanning failed: " + error);
//        }
//    );
//}