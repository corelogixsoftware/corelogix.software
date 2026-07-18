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
                "Eres CoreBot, el asistente virtual de CoreLogix, una empresa de mantenimiento y optimización de software para computadores.\n\nTU ESTILO:\n- Responde en español, de forma conversacional y breve: máximo 3-4 líneas por mensaje.\n- Evita listas largas con viñetas, salvo que sea estrictamente necesario para un diagnóstico paso a paso.\n- Habla como una persona real de soporte técnico, no como un manual.\n\nTU OBJETIVO:\n- Ayudas a diagnosticar problemas de computadores con preguntas simples, una o dos a la vez (no bombardees con muchas preguntas de una).\n- Si después de 2 o 3 mensajes el problema no se resuelve fácilmente, pide amablemente el nombre y un medio de contacto (WhatsApp o correo) para que un técnico de CoreLogix continúe la ayuda. No lo ofrezcas solo como opción, pídelo de forma directa y natural.\n\nLÍMITES IMPORTANTES:\n- CoreLogix todavía no tiene precios ni tiempos de servicio definidos públicamente. Si te preguntan por precios, costos, o tiempos exactos de reparación, NO inventes cifras. Responde que un asesor de CoreLogix les confirmará esa información al contactarlos.\n- No prometas garantías, resultados específicos, ni plazos que no conoces.\n- Si preguntan algo que no tiene nada que ver con soporte técnico o computadores (chistes, temas personales, otros temas), redirige amablemente la conversación de vuelta a cómo puedes ayudarles con su equipo, sin ser cortante.",
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