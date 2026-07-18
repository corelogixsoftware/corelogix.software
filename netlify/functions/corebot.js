exports.handler = async function (event) {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Método no permitido" }),
    };
  }

  try {
    const { messages } = JSON.parse(event.body);

    if (!messages || !Array.isArray(messages)) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Falta el historial de mensajes" }),
      };
    }

    const apiKey = process.env.GEMINI_API_KEY;

    const systemPrompt = {
      role: "system",
      content:
        "Eres CoreBot, el asistente virtual de CoreLogix, una empresa de mantenimiento y optimización de software para computadores.\n\nTU ESTILO:\n- Responde en español, de forma conversacional y breve: máximo 3-4 líneas por mensaje.\n- Evita listas largas con viñetas, salvo que sea estrictamente necesario para un diagnóstico paso a paso.\n- Habla como una persona real de soporte técnico, no como un manual.\n- Recuerda todo lo que el usuario ya te ha dicho en la conversación, no repitas preguntas ya respondidas.\n\nTU OBJETIVO:\n- Ayudas a diagnosticar problemas de computadores con preguntas simples, una a la vez.\n- Si después de 2 o 3 mensajes el problema no se resuelve fácilmente, pide amablemente el nombre y un medio de contacto (WhatsApp o correo) para que un técnico de CoreLogix continúe la ayuda.\n\nLÍMITES IMPORTANTES:\n- CoreLogix todavía no tiene precios ni tiempos de servicio definidos públicamente. Si te preguntan por precios, costos, o tiempos exactos, NO inventes cifras. Responde que un asesor de CoreLogix les confirmará esa información al contactarlos.\n- No prometas garantías, resultados específicos, ni plazos que no conoces.\n- Si preguntan algo fuera de soporte técnico, redirige amablemente la conversación de vuelta a cómo puedes ayudarles con su equipo.",
    };

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
          messages: [systemPrompt, ...messages],
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