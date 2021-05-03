document.getElementById("startForm").addEventListener("submit", (event) => {
    event.preventDefault();
    let playerName = document.getElementById("playerName").value;
    let data = {
        playerName,
    };
    localStorage.setItem("unoPlayer", JSON.stringify(data));
    window.location = "/game.html";
});
