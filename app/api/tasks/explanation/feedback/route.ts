import log from "@/utils/log";

export async function POST(req: Request) {
  const { liked, explanation } = await req.json();
  // TODO: collect feedback event
  log.info("Feedback collected", {
    liked,
    explanation,
  });
  return new Response("OK", { status: 200 });
}