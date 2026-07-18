exports.handler = async function (event) {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Método no permitido" }),
    };
  }

  try {
    const { message } = JSON.parse(event.body);

    if (!message) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Falta el mensaje" }),
      };
    }

    const apiKey = process.env.GEMINI_API_KEY;

    const response = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          messages: [
            {
              role: "system",
              content:
                "Eres CoreBot, el asistente virtual de CoreLogix, una empresa de mantenimiento y optimización de software. Ayudas a diagnosticar problemas de computadores de forma breve y amigable, y si es un problema serio, invitas al usuario a dejar sus datos de contacto. Responde en español, de forma corta y clara.",
            },
            {
              role: "user",
              content: message,
            },
          ],
        }),
      }
    );

    const data = await response.json();
    console.log("Respuesta de Groq:", JSON.stringify(data));

    const reply =
      data.choices?.[0]?.message?.content ||
      "Lo siento, no pude procesar tu mensaje. ¿Puedes intentar de nuevo?";

    return {
      statusCode: 200,
      body: JSON.stringify({ reply }),
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Error interno del servidor" }),
    };
  }
};