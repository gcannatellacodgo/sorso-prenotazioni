import { assertAdmin, supabaseAdmin } from "./_utils";

export default async function handler(req: any, res: any) {
    const auth = assertAdmin(req);
    if (!auth.ok) return res.status(401).json({ error: auth.error });

    if (req.method === "GET") {
        const { data, error } = await supabaseAdmin
            .from("events")
            .select("id, code, title, date, poster_url, active")
            .order("date", { ascending: true });

        if (error) return res.status(500).json({ error: error.message });
        return res.status(200).json({ events: data ?? [] });
    }

    if (req.method === "POST") {
        const body = req.body ?? {};
        const { code, title, date, poster_url, active, totals } = body;

        if (!title || !date || !code) {
            return res.status(400).json({ error: "Missing fields: code/title/date" });
        }

        // 1) crea evento
        const { data: created, error: e1 } = await supabaseAdmin
            .from("events")
            .insert([{ code, title, date, poster_url: poster_url ?? null, active: !!active }])
            .select("id")
            .single();

        if (e1) return res.status(500).json({ error: e1.message });

        // 2) crea disponibilità per pacchetto
        const eventId = created.id as string;
        const base = Number(totals?.base ?? 20);
        const premium = Number(totals?.premium ?? 20);
        const elite = Number(totals?.elite ?? 20);

        const { error: e2 } = await supabaseAdmin.from("event_packages").insert([
            { event_id: eventId, package: "base", total_tables: base, booked_tables: 0 },
            { event_id: eventId, package: "premium", total_tables: premium, booked_tables: 0 },
            { event_id: eventId, package: "elite", total_tables: elite, booked_tables: 0 },
        ]);

        if (e2) return res.status(500).json({ error: e2.message });

        return res.status(200).json({ ok: true, id: eventId });
    }

    if (req.method === "PATCH") {
        const body = req.body ?? {};
        const { id, ...patch } = body;
        if (!id) return res.status(400).json({ error: "Missing id" });

        const { error } = await supabaseAdmin.from("events").update(patch).eq("id", id);
        if (error) return res.status(500).json({ error: error.message });

        return res.status(200).json({ ok: true });
    }

    if (req.method === "DELETE") {
        const { id } = req.query ?? {};
        if (!id) return res.status(400).json({ error: "Missing id" });

        // soft delete
        const { error } = await supabaseAdmin.from("events").update({ active: false }).eq("id", id);
        if (error) return res.status(500).json({ error: error.message });

        return res.status(200).json({ ok: true });
    }

    return res.status(405).json({ error: "Method not allowed" });
}