export default {
  async fetch(request, env) {

    const url = new URL(request.url);

    const text = url.searchParams.get("text");
    const source = url.searchParams.get("source") || "auto";
    const target = url.searchParams.get("target") || "en";

    if (!text) {
      return new Response("Missing text", { status: 400 });
    }

    let prompt;

    if (source === "auto") {
      prompt = `Detect the source language and translate the following text to ${target}.

Text:
${text}

Return ONLY the translation.`;
    } else {
      prompt = `Translate the following text from ${source} to ${target}.

Text:
${text}

Return ONLY the translation.`;
    }

    const result = await env.AI.run(
      "@cf/meta/llama-3.1-8b-instruct",
      {
        messages: [
          {
            role: "user",
            content: prompt
          }
        ]
      }
    );

    return new Response(
      result.response || JSON.stringify(result),
      {
        headers: {
          "Content-Type": "text/plain; charset=utf-8",
          "Access-Control-Allow-Origin": "*"
        }
      }
    );
  }
}
