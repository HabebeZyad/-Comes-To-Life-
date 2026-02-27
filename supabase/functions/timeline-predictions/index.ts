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
    const { period, event, question } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");

    if (!LOVABLE_API_KEY) {
      console.error("LOVABLE_API_KEY is not configured");
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    console.log("Generating timeline analysis for period:", period, "event:", event);

    const systemPrompt = `You are an expert historian and data analyst specializing in ancient Egyptian chronology. You analyze historical patterns, predict outcomes based on historical data, and explain the relationships between events across different periods. Your responses should:
- Be based on historical evidence and archaeological findings
- Acknowledge uncertainties in ancient Egyptian chronology
- Draw connections between events and their consequences
- Provide probability assessments for historical interpretations
- Be educational and engaging`;

    const userPrompt = question || `Analyze the historical timeline for the ${period || "ancient Egyptian"} period.

${event ? `Focus on the event: ${event}` : "Provide a comprehensive analysis of key events."}

Generate an analysis in JSON format:
{
  "period": "${period}",
  "analysis": {
    "overview": "Period overview",
    "keyEvents": [
      {
        "date": "approximate date",
        "event": "event name",
        "significance": "why it matters",
        "connections": ["connected events"],
        "confidence": "high|medium|low"
      }
    ],
    "patterns": ["observed historical patterns"],
    "predictions": [
      {
        "prediction": "historical interpretation or prediction",
        "basedOn": "evidence supporting this",
        "probability": "high|medium|low",
        "alternativeViews": "other scholarly opinions"
      }
    ],
    "uncertainties": ["areas of historical debate"]
  },
  "sources": ["suggested reading for further learning"]
}`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-pro",
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

    console.log("Timeline analysis completed");

    // Try to parse JSON from the response
    let analysisData;
    try {
      const jsonMatch = content.match(/```json\n?([\s\S]*?)\n?```/) || content.match(/\{[\s\S]*\}/);
      const jsonStr = jsonMatch ? (jsonMatch[1] || jsonMatch[0]) : content;
      analysisData = JSON.parse(jsonStr);
    } catch (parseError) {
      console.log("Could not parse as JSON, returning structured response");
      analysisData = {
        analysis: content,
        period: period
      };
    }

    return new Response(JSON.stringify(analysisData), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("Error in timeline-predictions:", error);
    return new Response(JSON.stringify({
      error: error instanceof Error ? error.message : "Unknown error"
    }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});