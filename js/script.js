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

// ===== CoreBot: lógica del chat =====
function sendMessage() {
    let input = document.getElementById("user-message");
    let message = input.value.trim();

    if (message === "") return; // no hacer nada si está vacío

    let chat = document.getElementById("chat-body");

    // Mostrar mensaje del usuario
    chat.innerHTML += "<p><b>Tú:</b> " + message + "</p>";

    // Limpiar el input
    input.value = "";

    // Generar respuesta del bot
    let response = getBotResponse(message);

    // Mostrar respuesta del bot
    chat.innerHTML += "<p><b>CoreBot:</b> " + response + "</p>";

    // Scroll automático hacia el último mensaje
    chat.scrollTop = chat.scrollHeight;
}

function getBotResponse(message) {
    message = message.toLowerCase();

    if (message.includes("hola")) {
        return "¡Hola! Soy CoreBot 🤖 ¿En qué puedo ayudarte hoy?";
    } else if (message.includes("precio") || message.includes("costo")) {
        return "Nuestros precios varían según el servicio que necesites. ¿Quieres que te contacte alguien de CoreLogix?";
    } else if (message.includes("mantenimiento")) {
        return "Ofrecemos mantenimiento de software para que tus sistemas funcionen sin interrupciones. ¿Qué problema estás teniendo?";
    } else if (message.includes("gracias")) {
        return "¡Con gusto! Estoy aquí para ayudarte 😊";
    } else {
        return "No estoy seguro de entender bien tu problema. ¿Puedes darme más detalles?";
    }
}