$(document).on('pageinit', '#home', function(){

});

var position, pushNotification;

document.addEventListener("deviceready", onDeviceReady, false);
function onDeviceReady() {
	console.log(navigator.camera);
    pushNotification = window.plugins.pushNotification;
}

/* Handle Location-Button click */
$(document).on('click', '#add-location-btn', function(){
    event.preventDefault();
    position = addLocation(true);

});

/* Search for the location and show it via alert */
function addLocation(showAlert){
    event.preventDefault();
    navigator.geolocation.getCurrentPosition(
        function(_position) {
            if(showAlert) {
                alert(_position.coords.latitude + ',' + _position.coords.longitude);
            }
        },
        function() {
            alert('Error getting location');
        });
    return false;
}

$(document).on('click', '#get-tasks-btn', function() {
    event.preventDefault();

    $.ajax({
        url: "http://imsdmo.lbs-logics.com/imswap/servlet/imsdroid?action=snc_jobs_with_branches&tokenid=29",
        type: "GET",
        dataType: "json",

        headers: {
           //Authorization: "Basic " + btoa("leanders:hermes007")
            Authorization: "Basic bGVhbmRlcnM6aGVybWVzMDA3"
        },

        success: function (response) {
            //alert(JSON.stringify(response.jobs[0].label));
           // var parsedJSON = jQuery.parseJSON(response);

            for (i=0; i < response.jobs.length; i++) {
                $('#task-list').append('<li><a href="#" id="task-list-btn" data-id="' + JSON.stringify(response.jobs[i].id) + '"><h3>' + JSON.stringify(response.jobs[i].name) + '</h3><p>' + JSON.stringify(response.jobs[i].id) + '</p></a></li>');
            }
            
           	//w$('#task-list').append('<li><a href="" data-id="' + row.id + '"><h3>' + row.title + '</h3><p>' + row.vote_average + '/10</p></a></li>');
        },

        error: function (xhr, status, errorThrown) {
            alert( "Sorry, there was a problem!" );
            alert( "Error: " + errorThrown );
            alert( "Status: " + status );
            alert( "Statuscode: " + xhr.status);
        },

        complete: function( xhr, status ) {
            //alert( "The request is complete!" );
        }
    });
});

/* Login to the LBS WildFly Server with given token-id and username/password */
$(document).on('click', '#http-GET-btn', function() {
//$('.http-GET-btn').live('tap', function() {
    event.preventDefault();
    
    $.ajax({
        url: "http://imsdmo.lbs-logics.com/imswap/servlet/imsdroid?action=snc_settings&tokenid=29",
        type: "GET",
        dataType: "json",


       headers: {
           //Authorization: "Basic " + btoa("leanders:hermes007")
            Authorization: "Basic bGVhbmRlcnM6aGVybWVzMDA3"
        },

        success: function (response) {
            alert("Success");
            alert(JSON.stringify(response));
           
        },

        error: function (xhr, status, errorThrown) {
            alert( "Sorry, there was a problem!" );
            alert( "Error: " + errorThrown );
            alert( "Status: " + status );
            alert( "Statuscode: " + xhr.status);
        },

        complete: function( xhr, status ) {
            alert( "The request is complete!" );
        }
    });
});


$(document).on('click', '#task-list li a', function() {
    var objId = $(this).attr('data-id');
    //$.mobile.changePage( "#headline", { transition: "slide", changeHash: false });

	var pic = getPhoto(1, objId);


});


/* Take a picture with the OS' own camera-program and save it */
$(document).on('click', '#change-pic-btn', function(){
    //event.preventDefault();
    if (!navigator.camera) {
        alert("Camera API not supported", "Error");
        //return;
    }
    var options =   {   quality: 50,
        destinationType: Camera.DestinationType.DATA_URL,
        sourceType: 1,      // 0:Photo Library, 1=Camera, 2=Saved Album
        encodingType: 0     // 0=JPG 1=PNG
    };

    navigator.camera.getPicture(
        function(imgData) {
            $('.media-object', this.$el).attr('src', "data:image/jpeg;base64,"+imgData);
        },
        function() {
            alert('Error taking picture', 'Error');
        },
        options);
});

/* Search for a picture an show it on the screen */
$(document).on('click', '#get-pic-btn', function() {
   
   getPhoto(0, 0);
    
}); 
   

function getPhoto(type, _id) {
    if (type == 0) {
        var options = {
            quality: 50,
            destinationType: Camera.DestinationType.FILE_URI,
            sourceType: 0,  // 0:Photo Library, 1=Camera, 2=Saved Album
            encodingType: 0,     // 0=JPG 1=PNG
            allowEdit: true,
            MediaType: 0        // 0=Picture, 1=Video, 2=all
        };
    } else {
        var options = {
            quality: 50,
            destinationType: Camera.DestinationType.DATA_URL,
            sourceType: 0,  // 0:Photo Library, 1=Camera, 2=Saved Album
            encodingType: 0,     // 0=JPG 1=PNG
            allowEdit: true,
            MediaType: 0        // 0=Picture, 1=Video, 2=all
        };
    }

    var pic;
    //alert("options done");
    navigator.camera.getPicture(
        function(imgData) {
            //alert (JSON.stringify(imgData));  //in case of FILE_URI
            //alert(imgData);                   //in case of DATA_URL !Attention! Takes forever to load

            if(type == 0) {

                movePic(imgData);
                document.getElementById("image").value = "data:image/jpeg;base64," + imgData;

            } else {

                var postUrl = "http://imsdmo.lbs-logics.com/imswap/servlet/imsdroid?action=61&pt=4&ts=";
                var date = new Date();
                var timestamp = date.getTime();
                //alert(timestamp);
                var curTs = "&curTs=";
                var edtTs = "&edtTs=0&actionkey=leanders";
                var appver = "&appversion=2015072100&tokenid=29";

                pic = imgData;

                addLocation(false);

                var randomId = Math.floor((Math.random() * 1000) + 1);

                var json = {
                    image: pic,
                    objId:_id,
                    objRef:"ims\/ServiceJob",
                    type:"PHOTODOC",
                    orientation:0,
                    arId:101,
                    id:randomId,
                    lat: position.coords.latitude,
                    lon:position.coords.longitude,
                    pos_acc:position.coords.accuracy,
                    pos_prov:"",
                    pos_time: position.timestamp
                }

                $.ajax({
                    url: postUrl + timestamp + curTs + timestamp + edtTs + timestamp + appver,
                    type: "POST",
                    //dataType: "text",

                    headers: {
                        //Authorization: "Basic " + btoa("leanders:hermes007")
                        Authorization: "Basic bGVhbmRlcnM6aGVybWVzMDA3"
                    },

                    data: JSON.stringify(json),


                    success: function (response) {
                        alert("Success");
                        alert(response);

                    },

                    error: function (xhr, status, errorThrown) {
                        alert( "Sorry, there was a problem!" );
                        alert( "Error: " + errorThrown );
                        alert( "Status: " + status );
                        alert( "Statuscode: " + xhr.status);
                    },

                    complete: function( xhr, status ) {
                        alert( "The request is complete!" );
                    }
                });
            }

        },
        function() {
            alert('Error getting picture', 'Error');
        },
        options
    );
	return pic;
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////  Push Handler    //////////////////////////////////////////////////
////////////////////////////// see https://github.com/phonegap-build/PushPlugin /////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// register Push Service on Button Click
$(document).on('click', '#register-push-btn', function() {
    event.preventDefault();

    $("#app-status-ul").append('<li>registering ' + device.platform + '</li>');
    if ( device.platform == 'android' || device.platform == 'Android' || device.platform == "amazon-fireos" ){
        pushNotification.register(
            successHandler,
            errorHandler,
            {
                "senderID":"replace_with_sender_id",
                "ecb":"onNotification"
            });
    } else if ( device.platform == 'blackberry10'){
        pushNotification.register(
            successHandler,
            errorHandler,
            {
                invokeTargetId : "replace_with_invoke_target_id",
                appId: "replace_with_app_id",
                ppgUrl:"replace_with_ppg_url", //remove for BES pushes
                ecb: "pushNotificationHandler",
                simChangeCallback: replace_with_simChange_callback,
                pushTransportReadyCallback: replace_with_pushTransportReady_callback,
                launchApplicationOnPush: true
            });
    } else {
        pushNotification.register(
            tokenHandler,
            errorHandler,
            {
                "badge":"true",
                "sound":"true",
                "alert":"true",
                "ecb":"onNotificationAPN"
            });
    }

});

// result contains any message sent from the plugin call
function successHandler (result) {
    alert('result = ' + result);
}

// result contains any error description text returned from the plugin call
function errorHandler (error) {
    alert('error = ' + error);
}

// iOS
function onNotificationAPN (event) {
    if ( event.alert )
    {
        navigator.notification.alert(event.alert);
    }

    if ( event.sound )
    {
        var snd = new Media(event.sound);
        snd.play();
    }

    if ( event.badge )
    {
        pushNotification.setApplicationIconBadgeNumber(successHandler, errorHandler, event.badge);
    }
}
//Android
function onNotification(e) {
    $("#app-status-ul").append('<li>EVENT -> RECEIVED:' + e.event + '</li>');

    switch( e.event )
    {
        case 'registered':
            if ( e.regid.length > 0 )
            {
                $("#app-status-ul").append('<li>REGISTERED -> REGID:' + e.regid + "</li>");
                // Your GCM push server needs to know the regID before it can push to this device
                // here is where you might want to send it the regID for later use.
                console.log("regID = " + e.regid);
            }
            break;

        case 'message':
            // if this flag is set, this notification happened while we were in the foreground.
            // you might want to play a sound to get the user's attention, throw up a dialog, etc.
            if ( e.foreground )
            {
                $("#app-status-ul").append('<li>--INLINE NOTIFICATION--' + '</li>');

                // on Android soundname is outside the payload.
                // On Amazon FireOS all custom attributes are contained within payload
                var soundfile = e.soundname || e.payload.sound;
                // if the notification contains a soundname, play it.
                var my_media = new Media("/android_asset/www/"+ soundfile);
                my_media.play();
            }
            else
            {  // otherwise we were launched because the user touched a notification in the notification tray.
                if ( e.coldstart )
                {
                    $("#app-status-ul").append('<li>--COLDSTART NOTIFICATION--' + '</li>');
                }
                else
                {
                    $("#app-status-ul").append('<li>--BACKGROUND NOTIFICATION--' + '</li>');
                }
            }

            $("#app-status-ul").append('<li>MESSAGE -> MSG: ' + e.payload.message + '</li>');
            //Only works for GCM
            $("#app-status-ul").append('<li>MESSAGE -> MSGCNT: ' + e.payload.msgcnt + '</li>');
            //Only works on Amazon Fire OS
            $status.append('<li>MESSAGE -> TIME: ' + e.payload.timeStamp + '</li>');
            break;

        case 'error':
            $("#app-status-ul").append('<li>ERROR -> MSG:' + e.msg + '</li>');
            break;

        default:
            $("#app-status-ul").append('<li>EVENT -> Unknown, an event was received and we do not know what it is</li>');
            break;
    }
}

function tokenHandler (result) {
    // Your iOS push server needs to know the token before it can push to this device
    // here is where you might want to send it the token for later use.
    alert('device token = ' + result);
}

/////////////////////////////////////////////// END ///////////////////////////////////////////////////

/* Helper Method for saving the picture to the right location */
function movePic(file){
   // alert(file);

    window.resolveLocalFileSystemURI(file, resolveOnSuccess, resOnError);

    var image = document.getElementById('image');
    // Unhide image elements
    image.style.display = 'block';

    image.src = /*"data:image/jpeg;base64," +*/ file;

    image.resize();
}

/* Callback function when the file system uri has been resolved */
function resolveOnSuccess(entry){
    var d = new Date();
    var n = d.getTime();
    //new file name
    var newFileName = n + ".jpg";
    var myFolderApp = "EasyPacking";
    window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function(fileSys) {
            //The folder is created if doesn't exist
            fileSys.root.getDirectory( myFolderApp,
                {create:true, exclusive: false},
                function(directory) {
                    entry.moveTo(directory, newFileName,  successMove, resOnError);
                },
                resOnError);
        },
        resOnError);
}

/* Callback function when the file has been moved successfully - inserting the complete path */
function successMove(entry) {
    //I do my insert with "entry.fullPath" as for the path
    localStorage.setItem('imagepath', entry.fullPath);
}

function resOnError(error) {
    alert(error.code);
}

/* Activate Barcode Scanner and show result via alert */
$(document).on('click', '#barcode-scan-btn', function() {

    cordova.plugins.barcodeScanner.scan(
        function (result) {
            alert("We got a barcode\n" +
                "Result: " + result.text + "\n" +
                "Format: " + result.format + "\n" +
                "Cancelled: " + result.cancelled);
        },
        function (error) {
            alert("Scanning failed: " + error);
        }
    );
});

/* start OS' navigation to a given Destination (switches to standard navigation app) */
$(document).on('click', '#nav-to-loc-btn', function() {
    var destLocation = document.getElementById("locationText").value;

    launchnavigator.navigate(destLocation, null, 
    function(){
    	alert("Plugin success");
  	},
	function(error){
	    alert("Plugin error: "+ error);
	});
});

/* Inits NFC and shows result via alert */
$(document).on('click', '#init-nfc-btn', function() {
    if (!navigator.nfc) {  //not sure if right
        alert("NFC API not supported", "Error");
       // return;
    }

    nfc.addNdefListener(
        function(result) {
            alert("result");
        })
});

/* add 100000 key-value pairs to local storage */
$(document).on('click', '#add-files-btn', function () {

    alert("start");
    var ix = 100000;
    for (var i = 0; i < ix; i++) {
        localStorage.setItem('key' + i, i * 2);
    }
    alert("All " + ix + " files saved");
});

/* searches value to given key in local storage */
$(document).on('click', '#search-file-btn', function() {
    var text = document.getElementById("searchIndex").value;
    //alert(text);
    document.getElementById("searchIndex").value = localStorage.getItem('key'+text);
});