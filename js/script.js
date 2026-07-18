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

// ===== CoreBot: lógica del chat con IA (con memoria + captura de leads) =====
let chatHistory = [];

async function sendMessage() {
    let input = document.getElementById("user-message");
    let message = input.value.trim();

    if (message === "") return;

    let chat = document.getElementById("chat-body");

    chat.innerHTML += "<p><b>Tú:</b> " + message + "</p>";
    input.value = "";
    chat.scrollTop = chat.scrollHeight;

    chatHistory.push({ role: "user", content: message });

    chat.innerHTML += `<p id="typing-indicator"><b>CoreBot:</b> escribiendo...</p>`;
    chat.scrollTop = chat.scrollHeight;

    try {
        const response = await fetch("/.netlify/functions/corebot", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ messages: chatHistory }),
        });

        const data = await response.json();

        document.getElementById("typing-indicator")?.remove();

        let reply = data.reply || "Lo siento, hubo un error. Intenta de nuevo.";

        const leadMatch = reply.match(/\[LEAD:(.*?)\|(.*?)\|(.*?)\]/);
        if (leadMatch) {
            const [, nombre, contacto, resumen] = leadMatch;
            reply = reply.replace(/\[LEAD:(.*?)\]/, "").trim();
            enviarLead(nombre.trim(), contacto.trim(), resumen.trim());
        }

        chatHistory.push({ role: "assistant", content: reply });

        chat.innerHTML += "<p><b>CoreBot:</b> " + reply + "</p>";
        chat.scrollTop = chat.scrollHeight;
    } catch (error) {
        document.getElementById("typing-indicator")?.remove();
        chat.innerHTML += "<p><b>CoreBot:</b> Ocurrió un error de conexión. Intenta de nuevo.</p>";
        chat.scrollTop = chat.scrollHeight;
        console.error(error);
    }
}

async function enviarLead(nombre, contacto, resumen) {
    try {
        await fetch("https://formspree.io/f/mojooepw", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                nombre: nombre,
                contacto: contacto,
                mensaje: "Lead capturado por CoreBot. Problema: " + resumen,
            }),
        });
    } catch (error) {
        console.error("Error al enviar lead:", error);
    }
}