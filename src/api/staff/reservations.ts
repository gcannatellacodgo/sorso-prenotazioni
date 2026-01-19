import { assertAdmin, supabaseAdmin } from "./_utils";

export default async function handler(req: any, res: any) {
    const auth = assertAdmin(req);
    if (!auth.ok) return res.status(401).json({ error: auth.error });

    if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });

    const event_id = req.query?.event_id;
    if (!event_id) return res.status(400).json({ error: "Missing event_id" });

    const { data, error } = await supabaseAdmin
        .from("reservations")
        .select("id, created_at, name, phone, notes, package, tables, total, status")
        .eq("event_id", event_id)
        .order("created_at", { ascending: false });

    if (error) return res.status(500).json({ error: error.message });
    return res.status(200).json({ reservations: data ?? [] });
}