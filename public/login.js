function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
};

const loginInput = document.querySelector(".login-input");
const passwordInput = document.querySelector(".password-input");
const paragraph = document.querySelector("p");

(async () => {
    if (getCookie("user")) {
        const cookieAnswer = await fetch("/cookieCheck", {
            method: "POST",
            body: JSON.stringify({
                cookie: getCookie("user")
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(response => response.json());
        if (cookieAnswer.ok) {
            paragraph.innerText = `Вы уже авторизировались раньше, ${cookieAnswer.login}.`; 
        }
    }
})();

document.querySelector("button").addEventListener("click", async () => {
    if ((!loginInput.value) || (!passwordInput.value)) return paragraph.innerText = "Укажите корректные пароль и логин";

    paragraph.innerText = "";
    let answer = await fetch("http://localhost:3000/loginPost", {
        method: "POST",
        body: JSON.stringify({
            login: loginInput.value,
            password: passwordInput.value
        }),
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(response => response.json());
    if (!answer.ok) {
        paragraph.innerText = "Неверно указан логин или пароль";
    } else {
        document.cookie = `user=${answer.cookie}`;
        paragraph.innerText = `Вход прошел успешно. Добро пожаловать, ${answer.login}.`;
    }
});