var query = getQueryParams(document.location.search);
var uuid = query.uuid;

if (!uuid) {
    // Check if an UUID has already been generated. If not, generate one and change current location to add it.
    uuid = newUUID();
    var newURL = window.location.href + "&uuid=" + uuid;
    window.location.replace(newURL);
} else {
    // Change current document's title to show the title you wnat in history (long tap on Previous button)
    document.title = query.from_title;

    if (readCookie(query.from_url) == uuid) {
         // If a cookie with this UUID exists, it means we are going back so let's go back to our app, but redirect again to the link in the same time.
        goToURL(query.from_url);
        goToURL(query.to_url);
    } else {
        // If there is no cookie with this UUID, it means we opened the page for the first time, so we need to redirect only to the desired ling.
        createCookie(query.from_url, uuid, 1);
        goToURL(query.to_url);
    }
}


function getQueryParams(qs) {
    qs = qs.split("+").join(" ");

    var params = {};
    var re = /[?&]?([^=]+)=([^&]*)/g;
    var tokens = re.exec(qs);

    while (tokens !== null) {
        params[decodeURIComponent(tokens[1])] = decodeURIComponent(tokens[2]);
        tokens = re.exec(qs);
    }
    return params;
}

function createCookie(name, value, days) {
    var expires;
    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toGMTString();
    } else {
        expires = "";
    }
    document.cookie = name + "=" + value + expires + "; path=/";
}

function readCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    var i, c;
    for (i = 0; i < ca.length; i++) {
        c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1, c.length);
        }
        if (c.indexOf(nameEQ) == 0) {
            return c.substring(nameEQ.length, c.length);
        }
    }
    return null;
}

function eraseCookie(name) {
    createCookie(name, "", -1);
}

function goToURL(url) {
    if (url) {
        var link = document.createElement('a');
        link.href = url;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
}

function newUUID() {
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
}
