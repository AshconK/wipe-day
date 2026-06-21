// app/api/chat/route.ts
import Anthropic from "@anthropic-ai/sdk";
import { NextResponse } from "next/server";
import { costReference } from "@/lib/costs";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { consumeBaseRequest } from "@/lib/usage";

const anthropic = new Anthropic();

export async function POST(req: Request) {
  try {
    const { profile, messages } = await req.json();

    // Is this user asking for a base design? (simple intent check)
    const lastMsg = messages[messages.length - 1]?.content?.toLowerCase() ?? "";
    const wantsBase = /\bbase\b/.test(lastMsg) && /(give|show|provide|another|design|build|starter|good|recommend|suggest|need|want|some|a base)/.test(lastMsg);

    if (wantsBase) {
      const { userId } = await auth();
      const user = userId ? await prisma.user.findUnique({ where: { id: userId } }) : null;
      const allowed = await consumeBaseRequest(userId, user?.isPro ?? false);
      if (!allowed) {
        return NextResponse.json({
          answer: "You've used your 3 free base requests for today. Upgrade to Pro for unlimited base designs, or come back tomorrow.",
        });
      }
    }

    const systemPrompt = `You are an expert assistant for the survival game Rust.
You give practical, detailed advice on starter bases, base expansion, raid
defense, and electricity (auto turrets, batteries, solar, plant/berry farming).

Tailor every answer to this player's profile:
- Group size: ${profile.groupSize}
- Platform: ${profile.platform}
- Server type: ${profile.serverType}
- Experience: ${profile.experience}

IMPORTANT — BASE DESIGN REQUESTS:
If the user asks you to give, show, provide, recommend, or suggest a base — in ANY phrasing, 
including follow-ups like "another base", "one more", "a different one", "what about a base", 
"got a base for me" — you MUST respond with ONLY the tag [SHOW_BASE] followed by a single short 
sentence (one line, no more). Do NOT write a long explanation, do NOT describe the base in detail, 
do NOT list steps or materials. The base guide is shown visually to the user, so your text must stay 
to one short intro sentence. Example response: "[SHOW_BASE] Here's a solid starter base for your group — follow the steps below."

For any NON-base question (electricity, raids, expansion, general strategy), answer normally with full detail and do NOT use the tag.

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
      model: "claude-opus-4-8",
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