// ===== Animación al hacer scroll =====
const sections = document.querySelectorAll('.animate-on-scroll');

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
});

sections.forEach(section => {
    observer.observe(section);
});

// ===== CoreBot: lógica del chat con IA =====
async function sendMessage() {
    let input = document.getElementById("user-message");
    let message = input.value.trim();

    if (message === "") return;

    let chat = document.getElementById("chat-body");

    chat.innerHTML += "<p><b>Tú:</b> " + message + "</p>";
    input.value = "";
    chat.scrollTop = chat.scrollHeight;

    chat.innerHTML += `<p id="typing-indicator"><b>CoreBot:</b> escribiendo...</p>`;
    chat.scrollTop = chat.scrollHeight;

    try {
        const response = await fetch("/.netlify/functions/corebot", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ message }),
        });

        const data = await response.json();

        document.getElementById("typing-indicator")?.remove();

        const reply = data.reply || "Lo siento, hubo un error. Intenta de nuevo.";
        chat.innerHTML += "<p><b>CoreBot:</b> " + reply + "</p>";
        chat.scrollTop = chat.scrollHeight;
    } catch (error) {
        document.getElementById("typing-indicator")?.remove();
        chat.innerHTML += "<p><b>CoreBot:</b> Ocurrió un error de conexión. Intenta de nuevo.</p>";
        chat.scrollTop = chat.scrollHeight;
        console.error(error);
    }
}