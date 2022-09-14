const loginInput = document.querySelector(".login-input");
const passwordInput = document.querySelector(".password-input");
const paragraph = document.querySelector("p");

document.querySelector("button").addEventListener("click", async () => {
    if ((!loginInput.value) || (!passwordInput.value)) return paragraph.innerText = "Укажите корректные пароль и логин";

    paragraph.innerText = "";
    let answer = await fetch("http://localhost:3000/registerPost", {
        method: "POST",
        body: JSON.stringify({
            login: loginInput.value,
            password: passwordInput.value
        }),
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(response => response.json());
    if (answer.ok) { 
        paragraph.innerText = "Регистрация прошла успешно";
    } else {
        paragraph.innerText = "Аккаунт с данным логином уже существует";
    }
});