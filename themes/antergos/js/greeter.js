var DEBUG = true;
var selectedUser = null;
var auth_pending = null;
var users_shown = null;

function buildUserList() {
// User list building
	var userList = document.getElementById('user-list2');
	for (var i in lightdm.users) {
		var user = lightdm.users[i];
		var tux = 'img/antergos-logo-user.png';
		var imageSrc = user.image.length > 0 ? user.image : tux;
		var lastSession = localStorage.getItem(user.name);
		if (lastSession == null || lastSession == undefined) {
			localStorage.setItem(user.name, lightdm.default_session);
			lastSession = localStorage.getItem(user.name);
		}
		log('Last Session (' + user.name + '): ' + lastSession);
		var li = '<a href="#' + user.name + '" class="list-group-item ' + user.name + '" onclick="startAuthentication(\'' + user.name + '\')" session="' + lastSession + '">' +
			'<img src="' + imageSrc + '" class="img-square" alt="' + user.display_name + '" onerror="imgNotFound(this)"/> ' +
			'<span>' + user.display_name + '</span>' +
			'<span class="badge"><i class="fa fa-check"></i></span>' +
			'</a>';
		$(userList).append(li);
	}
}
function buildSessionList() {
// Build Session List
	for (i in lightdm.sessions) {
		var session = lightdm.sessions[i];
		var btnGrp = document.getElementById('sessions');
		var theClass = session.name.replace(/ /g, '');
		var button = '\n<li><a href="#" id="' + session.key + '" onclick="sessionToggle(this)" class="' + theClass + '">' + session.name + '</a></li>';

		$(btnGrp).append(button);


	}
}
function show_users() {
	if ($('#collapseOne').hasClass('in')) {
		$('#trigger').trigger('click');
		users_shown = true;
	}
	if ($('#user-list2 a').length <= 1) $('#user-list2 a').trigger('click');

}
/**
 * UI Initialization.
 */
$(document).ready(function () {

	initialize_timer();
	get_hostname();

	buildUserList();
	buildSessionList();
	// Password submit when enter key is pressed

	$(document).keydown(function (e) {
		checkKey(e);
	});
	// Action buttons
	addActionLink("shutdown");
	addActionLink("hibernate");
	addActionLink("suspend");
	addActionLink("restart");

});

function get_hostname() {
	var hostname = lightdm.hostname;
	var hostname_span = document.getElementById('hostname');
	$(hostname_span).append(hostname);
}

/**
 * Actions management.
 *
 *
 */

function update_time() {
	var time = document.getElementById("current_time");
	var date = new Date();
	var twelveHr = [
		'sq-al',
		'zh-cn',
		'zh-tw',
		'en-au',
		'en-bz',
		'en-ca',
		'en-cb',
		'en-jm',
		'en-ng',
		'en-nz',
		'en-ph',
		'en-us',
		'en-tt',
		'en-zw',
		'es-us',
		'es-mx'];
	var userLang = window.navigator.language;
	var is_twelveHr = twelveHr.indexOf(userLang);
	var hh = date.getHours();
	var mm = date.getMinutes();
	var suffix = "AM";
	if (hh >= 12) {
		suffix = "PM";
		if (is_twelveHr !== -1 && is_twelveHr !== 12) {
			hh = hh - 12;
		}
	}
	if (mm < 10) {
		mm = "0" + mm;
	}
	if (hh === 0 && is_twelveHr !== -1) {
		hh = 12;
	}
	time.innerHTML = hh + ":" + mm + " " + suffix;
}

function initialize_timer() {
	var userLang = window.navigator.language;
	log(userLang);
	update_time();
	setInterval(update_time, 60000);
}

function checkKey(event) {
	var action;
	switch (event.which) {
		case 13:
			action = auth_pending ? submitPassword() : !users_shown ? show_users() : 0;
			log(action);
			break;
		case 27:
			action = auth_pending ? cancelAuthentication() : 0;
			log(action);
			break;
		case 32:
			action = !users_shown && !auth_pending ? show_users() : 0;
			log(action);
			break;
		default:
			break;
	}
}

function addActionLink(id) {
	if (eval("lightdm.can_" + id)) {
		var label = id.substr(0, 1).toUpperCase() + id.substr(1, id.length - 1);
		var id2;
		if (id == "shutdown") {
			id2 = "power-off"
		}
		if (id == "hibernate") {
			id2 = "asterisk"
		}
		if (id == "suspend") {
			id2 = "arrow-down"
		}
		if (id == "restart") {
			id2 = "refresh"
		}
		$("#actionsArea").append('\n<button type="button" class="btn btn-default ' + id + '" data-toggle="tooltip" data-placement="top" title="' + label + '" data-container="body" onclick="handleAction(\'' + id + '\')"><i class="fa fa-' + id2 + '"></i></button>');
	}
}

function capitalize(string) {
	return string.charAt(0).toUpperCase() + string.slice(1);
}

function handleAction(id) {
	log("handleAction(" + id + ")");
	eval("lightdm." + id + "()");
}

function getUserObj(username) {
	var user = null;
	for (var i = 0; i < lightdm.users.length; ++i) {
		if (lightdm.users[i].name == username) {
			user = lightdm.users[i];
			break;
		}
	}
	return user;
}

function getSessionObj(sessionname) {
	var session = null;
	for (var i = 0; i < lightdm.sessions.length; ++i) {
		if (lightdm.sessions[i].name == sessionname) {
			session = lightdm.sessions[i];
			break;
		}
	}
	return session;
}


function startAuthentication(userId) {
	log("startAuthentication(" + userId + ")");

	if (selectedUser !== null) {
		lightdm.cancel_authentication();
		localStorage.setItem('selUser', null);
		log("authentication cancelled for " + selectedUser);
	}
	localStorage.setItem('selUser', userId);
	selectedUser = '.' + userId;
	$(selectedUser).addClass('hovered');
	$(selectedUser).siblings().hide();
	$('.fa-toggle-down').hide();


	var usrSession = localStorage.getItem(userId);

	log("usrSession: " + usrSession);
	var usrSessionEl = "#" + usrSession;
	var usrSessionName = $(usrSessionEl).html();
	log("usrSessionName: " + usrSessionName);
	$('.selected').html(usrSessionName);
	$('.selected').attr('id', usrSession);
	$('#session-list').removeClass('hidden');
	$('#passwordArea').show();
	auth_pending = true;

	lightdm.start_authentication(userId);
}

function cancelAuthentication() {
	log("cancelAuthentication()");
	$('#statusArea').hide();
	$('#timerArea').hide();
	$('#passwordArea').hide();
	$('#session-list').hide();
	if (selectedUser != null) {
		lightdm.cancel_authentication();
		log("authentication cancelled for " + selectedUser);
		$('.list-group-item.hovered').removeClass('hovered').siblings().show();
		$('.fa-toggle-down').show();
		selectedUser = null;
		auth_pending = false;
	}
	return true;
}

function submitPassword() {
	log("provideSecret()");
	lightdm.provide_secret($('#passwordField').val());
	$('#passwordArea').hide();
	$('#timerArea').show();
	log("done");
}

/**
 * Image loading management.
 */

function imgNotFound(source) {
	source.src = 'img/antergos-logo-user.png';
	source.onerror = "";
	return true;
}

function sessionToggle(el) {
	var selText = $(el).text();
	var theID = $(el).attr('id');
	var selUser = localStorage.getItem('selUser');
	$(el).parents('.btn-group').find('.selected').attr('id', theID);
	$(el).parents('.btn-group').find('.selected').html(selText);
	localStorage.setItem(selUser, theID)
}

/**
 * Lightdm Callbacks
 */
function show_prompt(text) {
	log("show_prompt(" + text + ")");
	$('#passwordField').val("");
	$('#passwordArea').show();
	$('#passwordField').focus();
}

function authentication_complete() {
	log("authentication_complete()");
	auth_pending = false;
	$('#timerArea').hide();
	var selSession = $('.selected').attr('id');
	if (lightdm.is_authenticated) {
		log("authenticated !");
		lightdm.login(lightdm.authentication_user, selSession);
	} else {
		log("not authenticated !");
		$('#statusArea').show();
	}
}

function show_message(text) {
	msgWrap = document.getElementById('statusArea');
	showMsg = document.getElementById('showMsg');
	showMsg.innerHTML = text;
	if (text.length > 0) {
		$('#passwordArea').hide();
		$(msgWrap).show();
	}
}

function show_error(text) {
	show_message(text);
}

/**
 * Logs.
 */
function log(text) {
	if (DEBUG) {
		$('#logArea').append(text);
		$('#logArea').append('<br/>');
	}
}
