
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
    const { imageBase64, imageUrl, description } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");

    if (!LOVABLE_API_KEY) {
      console.error("LOVABLE_API_KEY is not configured");
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    console.log("Analyzing hieroglyphs from:", imageUrl ? "URL" : description ? "description" : "base64 image");

    // Extract raw base64 data - strip any data URL prefix (handles double-prefixing)
    function extractRawBase64(input: string | undefined): { raw: string; mime: string } {
      const result = { raw: '', mime: 'image/jpeg' };
      if (!input || typeof input !== 'string') return result;
      let s = input.trim();
      while (s.startsWith('data:')) {
        const commaIdx = s.indexOf(',');
        if (commaIdx === -1) return { ...result, raw: s };
        const mimeMatch = s.substring(0, commaIdx).match(/data:([^;]+);/);
        if (mimeMatch) result.mime = mimeMatch[1];
        s = s.substring(commaIdx + 1);
      }
      result.raw = s;
      return result;
    }
    const { raw: cleanBase64, mime: mimeType } = extractRawBase64(imageBase64);

    const systemPrompt = `You are an expert Egyptologist specializing in hieroglyphic analysis, the Gardiner sign list, and royal cartouches. Cartouches are oval frames containing pharaonic names. When analyzing hieroglyphs (including those inside cartouches), provide:
- Unicode symbol (𓀀–𓏿 range when possible, or a representative character)
- Gardiner codes (e.g., A1, G17, N5)
- Phonetic values and transliterations
- Meanings and symbolism
- Historical context and usage

Be precise and educational. Always return valid JSON.`;

    let userContent: Array<{ type: string; text?: string; image_url?: { url: string } }>;

    if (imageUrl || (imageBase64 && cleanBase64)) {
      userContent = [
        {
          type: "text",
          text: `Analyze the hieroglyphs in this image. It may be a cartouche (oval frame with royal name) or other inscription. Identify each symbol. Return ONLY valid JSON with this exact structure (no markdown):
{"symbols":[{"symbol":"𓏏","gardinerCode":"X1","name":"bread loaf","meaning":"bread loaf; used phonetically for 't'","phonetic":"t","confidence":"high"}],"translation":"possible translation if readable","historicalContext":"brief context","period":"e.g. Old Kingdom"}

Each symbol must have: symbol (Unicode hieroglyph or 𓂀 if unknown), gardinerCode, name, meaning, phonetic (if applicable), confidence (high/medium/low).`
        },
        {
          type: "image_url",
          image_url: {
            url: imageUrl || `data:${mimeType};base64,${cleanBase64}`
          }
        }
      ];
    } else if (description) {
      userContent = [
        {
          type: "text",
          text: `Based on this description of hieroglyphs: "${description}"

Identify the symbols described and provide:
1. Gardiner codes for each symbol
2. Phonetic values
3. Meanings and symbolism
4. How they might be combined in ancient Egyptian

Format your response as JSON with the structure:
{
  "symbols": [{ "gardinerCode": "X1", "phonetic": "t", "meaning": "bread loaf", "category": "category", "notes": "additional info" }],
  "interpretation": "interpretation of the described symbols",
  "suggestions": ["related hieroglyphs to explore"]
}`
        }
      ];
    } else {
      throw new Error("Either imageBase64, imageUrl, or description is required");
    }

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userContent }
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

    if (!content) {
      console.error("No content received from AI service");
      throw new Error("No content received from AI service");
    }

    console.log("Hieroglyph analysis completed");

    // Try to parse JSON from the response
    let analysisData: Record<string, unknown>;
    try {
      const jsonMatch = content.match(/```json\n?([\s\S]*?)\n?```/) || content.match(/\{[\s\S]*\}/);
      const jsonStr = jsonMatch ? (jsonMatch[1] || jsonMatch[0]) : content;
      analysisData = JSON.parse(jsonStr);
    } catch (parseError) {
      console.log("Could not parse as JSON, returning structured response");
      analysisData = {
        analysis: content,
        symbols: []
      };
    }

    // Normalize response to match frontend expected format
    const symbols = Array.isArray(analysisData.symbols) ? analysisData.symbols : [];
    const normalizedSymbols = symbols.map((s: Record<string, unknown>) => ({
      symbol: s.symbol ?? "𓂀",
      gardinerCode: s.gardinerCode ?? undefined,
      name: s.name ?? s.meaning ?? String(s.gardinerCode ?? "Unknown"),
      meaning: s.meaning ?? "",
      phonetic: s.phonetic ?? undefined,
      confidence: s.confidence ?? "medium"
    }));
    const normalized = {
      ...analysisData,
      symbols: normalizedSymbols,
      historicalContext: analysisData.historicalContext ?? analysisData.context ?? undefined,
    };
    delete (normalized as Record<string, unknown>).context;

    return new Response(JSON.stringify(normalized), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("Error in hieroglyph-recognition:", error);
    return new Response(JSON.stringify({
      error: error instanceof Error ? error.message : "Unknown error"
    }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});