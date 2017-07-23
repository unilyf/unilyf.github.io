function setvalue(t, o) {
    localStorage.setItem(t, JSON.stringify(o))
}
function supports_html5_storage() {
    try {
        return "localStorage" in window && null !== window.localStorage
    } catch (t) {
        return !1
    }
}
refget = {
    setandrefresh: function (t, o) {
        if (!supports_html5_storage())throw console.log("Localstorage not supported"), "Localstoragenotsupported"
        setvalue(t, o), location.reload()
    }, getvalue: function (t) {
        return localStorage.getItem(t)
    }
}