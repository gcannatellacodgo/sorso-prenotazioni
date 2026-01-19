import { createClient } from "@supabase/supabase-js";

export function assertAdmin(req: Request) {
    const pwd = req.headers.get("x-admin-password");
    if (!pwd || pwd !== "test") {
        return { ok: false as const, error: "Unauthorized" };
    }
    return { ok: true as const };
}

export const supabaseAdmin = createClient(
    "https://yqkgexyzwrseoftvxpko.supabase.co",
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inlxa2dleHl6d3JzZW9mdHZ4cGtvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2ODYxNzM5OCwiZXhwIjoyMDg0MTkzMzk4fQ.Qy2JKeeE-Ga7LXwIAoOq6TS80ZfN6TL_Osj5CoAHgZc"
);