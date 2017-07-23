/**
 * Created by Ishan on 26/06/2017.
 */

refget = {
    setandrefresh: function (name, value) {
        if (supports_html5_storage()) {
            setvalue(name, value);
            location.reload();
        } else {
            console.log("Localstorage not supported");
            throw "Localstoragenotsupported";
        }
    },
    getvalue: function (name) {
        //TODO add check if value exists
        //TODO persitance or one time
        return localStorage.getItem(name);
    }
};
function setvalue(name, value) {
    localStorage.setItem(name, JSON.stringify(value));
}
function supports_html5_storage() {
    try {
        return 'localStorage' in window && window['localStorage'] !== null;
    } catch (e) {
        return false;
    }
}



