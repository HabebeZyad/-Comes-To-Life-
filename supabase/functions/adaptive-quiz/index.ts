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
    const { topic, difficulty, previousAnswers, focusAreas } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");

    if (!LOVABLE_API_KEY) {
      console.error("LOVABLE_API_KEY is not configured");
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    console.log("Generating adaptive quiz for topic:", topic, "difficulty:", difficulty);

    // Analyze previous answers to determine strengths and weaknesses
    const performanceContext = previousAnswers?.length > 0
      ? `The student has answered ${previousAnswers.filter((a: { correct: boolean }) => a.correct).length} out of ${previousAnswers.length} questions correctly. Focus areas needing improvement: ${focusAreas?.join(', ') || 'general knowledge'}.`
      : "This is the student's first quiz session.";

    const systemPrompt = `You are an expert educator specializing in ancient Egyptian history. You create adaptive quiz questions that adjust to the student's level and learning needs. Your questions should:
- Be historically accurate and educational
- Match the specified difficulty level
- Focus on areas where the student needs improvement
- Include interesting facts that enhance learning
- Provide helpful explanations for each answer`;

    const userPrompt = `Create 5 quiz questions about ancient Egyptian ${topic || "history"}.

Difficulty level: ${difficulty || "medium"}
${performanceContext}

Generate questions in JSON format:
{
  "questions": [
    {
      "id": "q1",
      "question": "Question text",
      "type": "multiple_choice",
      "options": ["A", "B", "C", "D"],
      "correctAnswer": "A",
      "explanation": "Why this is correct",
      "difficulty": "easy|medium|hard|expert",
      "category": "hieroglyphs|pharaohs|culture|architecture|mythology",
      "hint": "A helpful hint"
    }
  ],
  "adaptiveNotes": "Notes about the quiz adaptation",
  "nextFocusAreas": ["suggested focus areas for next quiz"]
}

Include a mix of question types focusing on the topic and the student's weaker areas.`;

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

    console.log("Adaptive quiz generated successfully");

    // Try to parse JSON from the response
    let quizData;
    try {
      const jsonMatch = content.match(/```json\n?([\s\S]*?)\n?```/) || content.match(/\{[\s\S]*\}/);
      const jsonStr = jsonMatch ? (jsonMatch[1] || jsonMatch[0]) : content;
      quizData = JSON.parse(jsonStr);
    } catch (parseError) {
      console.log("Could not parse as JSON, returning structured response");
      quizData = {
        questions: [],
        error: "Failed to generate structured quiz",
        rawContent: content
      };
    }

    return new Response(JSON.stringify(quizData), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("Error in adaptive-quiz:", error);
    return new Response(JSON.stringify({
      error: error instanceof Error ? error.message : "Unknown error"
    }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});