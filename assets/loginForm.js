$(document).ready(function () {
    $("#submitForm").click(function () {
        sendForm();
        return false;
    });
    $('#password').keydown(function(e) {
        if(e.keyCode === 13) {sendForm()}
    });
});

function sendForm() {
    
    var credentials = {
        username: $("#login").val(),
        passwd: $("#password").val(),
        NotTrustedDevice: $("#checkbox").prop('checked')
    };

    var jsonString = JSON.stringify(credentials);
    var hashCode = getCookie('sessionKey');
    
    var charge = CryptoJS.AES.encrypt(jsonString, hashCode).toString();
    
    var postData = {
        action: "auth",
        date: Date.now(),
        charge: charge
    };

    $.ajax({
        url: window.location.origin + '/login',
        type: "POST",
        dataType: "json",
        data: postData,
        success: function (response) {
            if (response.logged) {document.location.reload()} 
            else {
                $("#login").css("border","#D54541 solid 2px");
                $("#password").css("border","#D54541 solid 2px");
                $("#errorMessage").css("display","block");
                shake("gateway");
            }
        },
        error: function (response) {
            $("#login").css("border","#D54541 solid 2px");
            $("#password").css("border","#D54541 solid 2px");
            $("#errorMessage").css("display","block");
            shake("gateway");
        }
    });
}

function getCookie(name) {
    let matches = document.cookie.match(new RegExp(
        "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
    ));
    return matches ? decodeURIComponent(matches[1]) : undefined;
}

function shake(elementId) {
    var div = document.getElementById(elementId);
    var interval = 20;
    var distance = 5;
    var times = 6;

    $(div).css('position', 'relative');

    for (var iter = 0; iter < (times + 1) ; iter++) {
        $(div).animate({
            left: ((iter % 2 == 0 ? distance : distance * -1))
        }, interval);
    }                                                                                                          
    $(div).animate({ left: 0 }, interval);
}