import { handleContact } from "@/lib/contact-handler";

// Node runtime (the default for Route Handlers; stated explicitly).
export const runtime = "nodejs";

export async function POST(request: Request): Promise<Response> {
  return handleContact(request);
}
