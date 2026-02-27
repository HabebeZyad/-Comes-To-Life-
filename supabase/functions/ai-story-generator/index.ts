const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req: Request) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { period, theme, characters, style } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");

    if (!LOVABLE_API_KEY) {
      console.error("LOVABLE_API_KEY is not configured");
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    console.log("Generating story for period:", period, "theme:", theme);

    const systemPrompt = `You are an expert historian and storyteller specializing in ancient Egyptian history. You create immersive, historically accurate stories that bring the past to life. Your stories should:
- Be engaging and educational
- Include authentic Egyptian names, places, and cultural details
- Reflect the specific time period accurately
- Include vivid descriptions of architecture, clothing, daily life
- Weave in real historical events when appropriate
- Use a realistic historical illustration style in descriptions`;

    const userPrompt = `Create a short, immersive story set in ancient Egypt during the ${period} period.

Theme: ${theme || "Daily life and adventures"}
Main characters: ${characters || "A young scribe and their mentor"}
Style: ${style || "Realistic historical narrative"}

The story should be 3-4 paragraphs long, suitable for educational purposes, and include:
1. A compelling opening that sets the scene
2. Historical details about the period
3. Character interactions that reveal Egyptian culture
4. An ending that leaves the reader wanting more

Format the response as JSON with the following structure:
{
  "title": "Story title",
  "period": "${period}",
  "synopsis": "One-sentence summary",
  "content": ["paragraph1", "paragraph2", "paragraph3"],
  "historicalNotes": ["note1", "note2"],
  "characters": [{"name": "Name", "role": "Role"}]
}`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);

      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again later." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted. Please add credits to continue." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    console.log("Story generated successfully");

    // Try to parse JSON from the response
    let storyData;
    try {
      // Extract JSON from potential markdown code blocks
      const jsonMatch = content.match(/```json\n?([\s\S]*?)\n?```/) || content.match(/\{[\s\S]*\}/);
      const jsonStr = jsonMatch ? (jsonMatch[1] || jsonMatch[0]) : content;
      storyData = JSON.parse(jsonStr);
    } catch (parseError) {
      console.log("Could not parse as JSON, returning raw content");
      storyData = {
        title: "Generated Story",
        content: [content],
        period: period
      };
    }

    return new Response(JSON.stringify(storyData), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("Error in ai-story-generator:", error);
    return new Response(JSON.stringify({
      error: error instanceof Error ? error.message : "Unknown error"
    }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});