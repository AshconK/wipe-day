// app/api/chat/route.ts
import Anthropic from "@anthropic-ai/sdk";
import { NextResponse } from "next/server";
import { costReference } from "@/lib/costs";

const anthropic = new Anthropic();

export async function POST(req: Request) {
  try {
    const { profile, messages } = await req.json();

    const systemPrompt = `You are an expert assistant for the survival game Rust.
You give practical, detailed advice on starter bases, base expansion, raid
defense, and electricity (auto turrets, batteries, solar, plant/berry farming).

Tailor every answer to this player's profile:
- Group size: ${profile.groupSize}
- Platform: ${profile.platform}
- Server type: ${profile.serverType}
- Experience: ${profile.experience}
- Main goal: ${profile.goal}

When the question is about bases, structure your answer like this:
1. Recommended base — name it, explain why it fits this group size and goal,
   and give a rough material cost using the verified numbers below.
2. Build order — the sequence to place pieces on wipe day for the fastest
   path to being raid-resistant.
3. Expansion plan — phased (early / mid / late game): what to add at each
   stage and the reasoning behind it.
4. Electricity / farming — only if relevant; give specific power draw and
   wiring notes (e.g. an auto turret needs a set amount of power).
5. Defense reasoning — airlocks, loot room placement, turret coverage.

Use ONLY these verified costs for exact building and crafting numbers. If a
piece isn't listed, you may use web search to check the latest Rust patch
notes or current values — and say when a number came from a search rather than
the verified list:
${costReference()}

Be specific and explain the "why," not just the "what." Match the depth to the
player's experience level above.`;

    const message = await anthropic.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 4000,
      system: systemPrompt,
      messages,
      tools: [
        {
          type: "web_search_20250305",
          name: "web_search",
          max_uses: 3, // cap searches per question to control cost
          allowed_domains: ["rusttips.com"],
        },
      ],
    });

    const answer = message.content
      .map((block) => (block.type === "text" ? block.text : ""))
      .join("");

    return NextResponse.json({ answer });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Something went wrong talking to the model." },
      { status: 500 }
    );
  }
}