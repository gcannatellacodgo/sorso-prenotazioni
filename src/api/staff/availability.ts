import { assertAdmin, supabaseAdmin } from "./_utils";

export default async function handler(req: any, res: any) {
    const auth = assertAdmin(req);
    if (!auth.ok) return res.status(401).json({ error: auth.error });

    if (req.method === "GET") {
        const event_id = req.query?.event_id;
        if (!event_id) return res.status(400).json({ error: "Missing event_id" });

        const { data, error } = await supabaseAdmin
            .from("event_packages")
            .select("package, total_tables, booked_tables")
            .eq("event_id", event_id);

        if (error) return res.status(500).json({ error: error.message });
        return res.status(200).json({ availability: data ?? [] });
    }

    if (req.method === "PATCH") {
        const body = req.body ?? {};
        const { event_id, totals } = body;
        if (!event_id || !totals) return res.status(400).json({ error: "Missing event_id/totals" });

        const updates = (Object.entries(totals) as [string, any][])
            .filter(([k]) => ["base", "premium", "elite"].includes(k))
            .map(([pkg, total_tables]) => ({
                event_id,
                package: pkg,
                total_tables: Number(total_tables),
            }));

        for (const u of updates) {
            const { error } = await supabaseAdmin
                .from("event_packages")
                .update({ total_tables: u.total_tables })
                .eq("event_id", u.event_id)
                .eq("package", u.package);

            if (error) return res.status(500).json({ error: error.message });
        }

        return res.status(200).json({ ok: true });
    }

    return res.status(405).json({ error: "Method not allowed" });
}