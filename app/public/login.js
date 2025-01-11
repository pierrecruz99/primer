
const mensajeError = document.getElementsByClassName("error")[0];

document.getElementById("login-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    const user = e.target.children.user.value;
    const password = e.target.children.password.value;

    const res = await fetch("http://127.0.0.1:4000/api/login", {
        method: "POST",
        headers: {
            "Content-Type" : "Application/json"
        },
        body : JSON.stringify({
            user : e.target.children.user.value,
            password : e.target.children.password.value
        })
    }) 
    if(!res.ok) return mensajeError.classList.toggle("escondido", false);

    const resJson = await res.json();
    if(resJson.redirect) window.location.href = resJson.redirect;
})