/**
 * Part of the Inforex project
 * Copyright (C) 2013 Michał Marcińczuk, Jan Kocoń, Marcin Ptak
 * Wrocław University of Technology
 */

/**
 * Set of functions used to handle dynamic log in.
 */

function login(){
	loginForm(true, null);	
}

/**
 * Display a login form.
 * @param reload -- if set true, after successful login the page will be reloaded
 * @param loginCallback(loggedin) -- function that will be executed after closing login form;
 *                                   if user has logged in the `loggedin` will be set true.
 * @return
 */
function loginForm(reload, loginCallback){

	$("body").append(''+
			'<div id="dialog-form-login" title="Login to Inforex" style="">'+
			'	<form>'+
			'	<fieldset style="border-width: 0px">'+
			'		<label for="username">Login:</label>'+
			'		<input type="text" name="username" id="username" class="text ui-widget-content ui-corner-all"/>'+
			'		<label for="password">Password:</label>'+
			'		<input type="password" name="password" id="password" value="" class="text ui-widget-content ui-corner-all"/>'+
			'	</fieldset>'+
			'	</form>'+
			'   <span style="color: red; margin-left: 70px" id="dialog-form-login-error"></span>'+	
			'</div>');

	$("#dialog-form-login").dialog({
		autoOpen: true,
		width: 280,
		modal: true,
		buttons: {
			'Login': function() {
                $("button:contains('Login')").attr("disabled", true);
                login_callback($(this), reload, loginCallback);
			},
			'Cancel': function() {
				if ( loginCallback != null )
					loginCallback(false);
				$(this).dialog('close');
			}
		},
		close: function() {
			$("#dialog-form-login").remove();
			
		}
	});

	$("#password").keypress(function(event){
		if (event.keyCode==13)
			login_callback($(this), reload, loginCallback);
	});

	$("#dialog-form-login input[name=username]").focus();
}

/**
 * Obiekt okna dialogowego jQuery UI.
 * @param dialog
 * @param reload
 * @param loginCallback
 * @return
 */
function login_callback(dialog, reload, loginCallback){

	var username = $("#username").val();
	var password = $("#password").val();
	
	var params = {
		username: username,
		password: password		
	};
	
	var success = function(data){
		if (loginCallback != null)
			loginCallback(true);
		if (reload)
			window.location.reload();
		else{
			dialog.dialog('destroy');
			$("#dialog-form-login").remove();
		}
	};
	
	var error = function(error_code){
		if (error_code == "ERROR_AUTHORIZATION"){
			$("#dialog-form-login-error").html("Niepoprawny login i/lub hasło");
            $("button:contains('Login')").attr("disabled", false);
		}
	};
	console.log("Ajax");
	doAjax("user_login", params, success, error);
}

$(function(){
	$("#login_link, .login_link").click(function(){
		login();
		return false;
	});
	$("#logout_link").click(function(){
		$.post("index.php", {logout: 1}, function(){ window.location.reload(); });
		return false;
	});

	$("#loginForm button[type=submit]").click(function(){
        $("#loginForm .modal-content").LoadingOverlay("show");
        var username = $("#username").val();
        var password = $("#password").val();
        var urlParams = "";

        var params = {
            username: username,
            password: password,
			ajax: "user_login"
        };

        if(params['url']){
            urlParams = "?"+params['url'];
            params['url'] = null;
        }

        console.log(urlParams);

        $.ajax({
            async:  true,
            type: 	'POST',
            url: 	"index.php" + urlParams,
            data:	params,
            success: function(data){
            	if ( data['error_msg'] ){
                    $("#dialog-form-login-error").html("Niepoprawny login i/lub hasło");
				} else {
                    window.location.reload();
				}
            },
            error: function(request, textStatus, errorThrown){
            },
            complete: function(){
                $("#loginForm .modal-content").LoadingOverlay("hide");
            },
            dataType:"json"
        });

		return false;
	});

	/* After showing the login dialog set the focus on the username field */
	if ($().on) {
        $('#loginForm').on('shown.bs.modal', function () {
            $('#username').focus();
        })
    }


    // var getCookie = function (name) {
    //     var value = "; " + document.cookie;
    //     var parts = value.split("; " + name + "=");
    //     if (parts.length == 2) return parts.pop().split(";").shift();
    // };
    //
    // /*
    //  * Showing login to clarin option
    //  */
    // function initClarinLogin(){
    //     var showClarinLoginData = function(data){
    //         console.log(data);
    //         $('#loginClarin').prepend('<h5>You are logged in as '+ data.fullname +'.</h5>');
    //     };
    //
    //     var showClarinErrorData = function(data){
    //         console.log('error', data);
    //     };
    //
    //     $.ajax({
    //         url: 'https://clarin-pl.eu/rest/validate-token/' + getCookie('clarin-pl-token'),
    //         type: "POST",
    //         contentType: 'application/json',
    //         success: showClarinLoginData,
    //         error: showClarinErrorData
    //     });
    //
    //
    //     $('#loginClarin').find('button').click(function () {
    //
    //     });
    // }
    // initClarinLogin();
    //
});
