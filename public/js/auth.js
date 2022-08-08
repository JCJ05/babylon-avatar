const session = $.cookie("session")
const dnialumno = $.cookie("alumno")

const loginLi = document.getElementById("login-li");
const logoutLi = document.getElementById("logout-li");
const logoutButton = document.getElementById("logout-button");

//aqui aplica un stilo para ocultar los dos li
loginLi.style.display = "none";
logoutLi.style.display = "none";

if (!session && ["/carrera"].includes(window.location.pathname)) {
    const modal_container = document.getElementById("modal_container3");
    document.getElementById('window-blur').style.display="block"
    modal_container.classList.add('show')
    $('*').addClass('stop-scrolling')
}
if (!session && ["/iot"].includes(window.location.pathname)) {
    const modal_container = document.getElementById("modal_container3");
    document.getElementById('window-blur').style.display="block"
    modal_container.classList.add('show')
    $('*').addClass('stop-scrolling')
}
if (session) {
    loginLi.style.display = "none";
    logoutLi.style.display = "block";
} else {
    loginLi.style.display = "block";
    logoutLi.style.display = "none";
}

function logout() {
    $.removeCookie("session")
    setTimeout(100, () => {
        location.href = "/";
    });
}


logoutButton.addEventListener("click", logout);