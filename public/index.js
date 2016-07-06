var inputData = {};

function utf8_to_b64(str) {
    return window.btoa(unescape(encodeURIComponent(str)));
}

function b64_to_utf8(str) {
    return decodeURIComponent(escape(window.atob(str)));
}

$(document).ready(function() {

	var socket = io();

	$('#roomcreateform').submit(function(e) {
		e.preventDefault();
		
		// A JS object that is sent to the server - packages the input data
		var inputData = {
			host: myip
		};
		
		socket.emit('create-room', inputData);
		
		// Unhide status message
		$("#addingdbitem").removeClass("hide");
	});
	
	$('#redo-room').submit(function(e) {
		e.preventDefault();
		
		// A JS object that is sent to the server - packages the input data
		var inputData = {
			host: myip
		};
		
		socket.emit('redo-room', inputData);
	});

	$('#roomjoinform').submit(function(e) {
		e.preventDefault();
		window.location.href = "http://michaelmeluso.com";
	});
	
	//var bucketComplete = false;
	var dynamoComplete = false;
	//var chatQueueComplete = false;
	//var emailComplete = false;
	var roomID;
	
	socket.on("complete-db-add", function(response) {

		if (response.err) {
			$("#addingdbitem").text("Error creating dynamo entry - could not create room. Try again later");
		}
		else {
			$("#addingdbitem").text("Dynamo entry created successfully!");
			dynamoComplete = true;
			roomID = response.roomID;
		}

		checkForRoomCompletion();
	});
	
	socket.on("duplicate", function(response) {
		$("#addingdbitem").text("Another room already exists on this network. Why don't you join that one? If there's no room already there, click below:");
		
		checkForRoomCompletion();
	});
	
	function checkForRoomCompletion() {
		if (dynamoComplete) {
			$("#room-complete-notice").removeClass("hide");
			$("#host-enter-room").attr("href", "/room/" + roomID);
			$("#host-enter-room").removeClass("hide");
			$("#redo-room").addClass("hide");
		} else {
			$("#redo-room").removeClass("hide");
		}
	}
});

