import { useEffect, useMemo, useRef, useState } from "react";
import {
    Badge,
    Button,
    Card,
    Divider,
    Group,
    NumberInput,
    Select,
    SimpleGrid,
    Stack,
    Switch,
    Table,
    Text,
    TextInput,
    Tabs,
} from "@mantine/core";
import { useNavigate } from "react-router-dom";
import { supabase } from "../supabase";

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

type PackageCode = "base" | "premium" | "elite";

type StaffEvent = {
    id: string;
    code: string;
    title: string;
    date: string; // YYYY-MM-DD
    poster_url: string | null;
    active: boolean;
};

type AvailabilityRow = {
    package: PackageCode;
    total_tables: number;
    booked_tables: number;
};

type ReservationRow = {
    id: string;
    created_at: string;
    name: string;
    phone: string;
    notes: string | null;
    package: PackageCode;
    tables: number;
    total: number;
    status: string;
};

const euro = (n: number) =>
    new Intl.NumberFormat("it-IT", { style: "currency", currency: "EUR" }).format(n);

function fmtDateISO(dateISO: string) {
    const d = new Date(dateISO + "T00:00:00");
    const dd = String(d.getDate()).padStart(2, "0");
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const yyyy = d.getFullYear();
    return `${dd}/${mm}/${yyyy}`;
}

function safeNumber(v: unknown, fallback = 0) {
    const n = typeof v === "number" ? v : Number(v);
    return Number.isFinite(n) ? n : fallback;
}

export default function StaffPage() {
    const nav = useNavigate();

    const [loading, setLoading] = useState(false);
    const [tab, setTab] = useState<string | null>("events");

    const [events, setEvents] = useState<StaffEvent[]>([]);
    const [selectedEventId, setSelectedEventId] = useState<string | null>(null);

    const selectedEvent = useMemo(
        () => events.find((e) => e.id === selectedEventId) ?? null,
        [events, selectedEventId]
    );

    const [availability, setAvailability] = useState<Record<PackageCode, AvailabilityRow>>({
        base: { package: "base", total_tables: 0, booked_tables: 0 },
        premium: { package: "premium", total_tables: 0, booked_tables: 0 },
        elite: { package: "elite", total_tables: 0, booked_tables: 0 },
    });

    const [reservations, setReservations] = useState<ReservationRow[]>([]);

    // create event form
    const [newCode, setNewCode] = useState("fri");
    const [newTitle, setNewTitle] = useState("");
    const [newDate, setNewDate] = useState("");
    const [newPosterUrl, setNewPosterUrl] = useState("");
    const [newActive, setNewActive] = useState(true);
    const [totBase, setTotBase] = useState<number>(20);
    const [totPremium, setTotPremium] = useState<number>(20);
    const [totElite, setTotElite] = useState<number>(20);

    // edit selected event quick fields
    const [editPosterUrl, setEditPosterUrl] = useState("");
    const [editActive, setEditActive] = useState(true);

    // edit totals
    const [editTotBase, setEditTotBase] = useState<number>(20);
    const [editTotPremium, setEditTotPremium] = useState<number>(20);
    const [editTotElite, setEditTotElite] = useState<number>(20);

    const totalsBooked = useMemo(
        () => reservations.reduce((acc, r) => acc + (r.tables || 0), 0),
        [reservations]
    );

    const totalsRevenue = useMemo(
        () => reservations.reduce((acc, r) => acc + (r.total || 0), 0),
        [reservations]
    );

    // evita doppi submit in createEvent
    const creatingRef = useRef(false);

    // ========= AUTH GUARD =========
    useEffect(() => {
        let mounted = true;

        const boot = async () => {
            const { data } = await supabase.auth.getSession();
            if (!mounted) return;

            if (!data.session) {
                nav("/staff-login", { replace: true });
                return;
            }

            await loadEvents();
        };

        boot();

        const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
            if (!session) nav("/staff-login", { replace: true });
        });

        return () => {
            mounted = false;
            sub.subscription.unsubscribe();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // ========= LOADERS =========
    const loadEvents = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase
                .from("events")
                .select("id, code, title, date, poster_url, active")
                .order("date", { ascending: true });

            if (error) throw error;

            const list = (data ?? []) as StaffEvent[];
            setEvents(list);

            if (list.length === 0) {
                setSelectedEventId(null);
                setReservations([]);
                setAvailability({
                    base: { package: "base", total_tables: 0, booked_tables: 0 },
                    premium: { package: "premium", total_tables: 0, booked_tables: 0 },
                    elite: { package: "elite", total_tables: 0, booked_tables: 0 },
                });
                return;
            }

            setSelectedEventId((prev) => prev ?? list[0].id);
        } catch (e) {
            alert(e instanceof Error ? e.message : "Errore caricamento eventi");
        } finally {
            setLoading(false);
        }
    };

    const loadEventDetails = async (eventId: string) => {
        setLoading(true);
        try {
            // availability
            const { data: a, error: e1 } = await supabase
                .from("event_packages")
                .select("package, total_tables, booked_tables")
                .eq("event_id", eventId);

            if (e1) throw e1;

            const map: Record<PackageCode, AvailabilityRow> = {
                base: { package: "base", total_tables: 0, booked_tables: 0 },
                premium: { package: "premium", total_tables: 0, booked_tables: 0 },
                elite: { package: "elite", total_tables: 0, booked_tables: 0 },
            };

            (a ?? []).forEach((r) => {
                const row = r as AvailabilityRow;
                map[row.package] = row;
            });

            setAvailability(map);
            setEditTotBase(map.base.total_tables);
            setEditTotPremium(map.premium.total_tables);
            setEditTotElite(map.elite.total_tables);

            // reservations
            const { data: r, error: e2 } = await supabase
                .from("reservations")
                .select("id, created_at, name, phone, notes, package, tables, total, status")
                .eq("event_id", eventId)
                .order("created_at", { ascending: false });

            if (e2) throw e2;

            setReservations((r ?? []) as ReservationRow[]);
        } catch (e) {
            alert(e instanceof Error ? e.message : "Errore caricamento dettagli evento");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!selectedEventId) return;
        loadEventDetails(selectedEventId).catch(() => {});
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedEventId]);

    useEffect(() => {
        if (!selectedEvent) return;
        setEditPosterUrl(selectedEvent.poster_url ?? "");
        setEditActive(!!selectedEvent.active);
    }, [selectedEvent]);

    // ========= EXPORT PDF =========
    const exportReservationsPdf = () => {
        if (!selectedEvent) return;

        const doc = new jsPDF({
            orientation: "landscape",
            unit: "mm",
            format: "a4",
        });

        doc.setFontSize(16);
        doc.text("SORSO CLUB – Prenotazioni Evento", 14, 15);

        doc.setFontSize(11);
        doc.text(`${selectedEvent.title} – ${fmtDateISO(selectedEvent.date)}`, 14, 23);

        const tableBody = reservations.map((r) => [
            new Date(r.created_at).toLocaleString("it-IT"),
            r.name,
            r.phone,
            r.package.toUpperCase(),
            String(r.tables),
            euro(r.total),
            r.notes ?? "",
        ]);

        autoTable(doc, {
            startY: 30,
            head: [[
                "Data",
                "Nome",
                "Telefono",
                "Pacchetto",
                "Tavoli",
                "Totale",
                "Note",
            ]],
            body: tableBody,
            styles: {
                fontSize: 9,
                cellPadding: 3,
            },
            headStyles: {
                fillColor: [6, 182, 212], // cyan
                textColor: 0,
                fontStyle: "bold",
            },
            alternateRowStyles: {
                fillColor: [245, 245, 245],
            },
            margin: { left: 14, right: 14 },
        });

        const pageCount = doc.getNumberOfPages();
        for (let i = 1; i <= pageCount; i++) {
            doc.setPage(i);
            doc.setFontSize(8);
            doc.text(
                `Pagina ${i} di ${pageCount}`,
                doc.internal.pageSize.getWidth() - 30,
                doc.internal.pageSize.getHeight() - 10
            );
        }

        const filename = `prenotazioni_${selectedEvent.code}_${selectedEvent.date}.pdf`;
        doc.save(filename);
    };

    // ========= ACTIONS =========
    const createEvent = async () => {
        if (creatingRef.current) return;
        if (!newTitle.trim() || !newDate.trim() || !newCode.trim()) {
            return alert("Inserisci almeno: giorno, titolo, data");
        }

        creatingRef.current = true;
        setLoading(true);

        try {
            const { data: created, error: e1 } = await supabase
                .from("events")
                .insert([
                    {
                        code: newCode.trim(),
                        title: newTitle.trim(),
                        date: newDate.trim(),
                        poster_url: newPosterUrl.trim() || null,
                        active: !!newActive,
                    },
                ])
                .select("id")
                .single();

            if (e1) throw e1;
            if (!created?.id) throw new Error("Evento non creato");

            const eventId = String(created.id);

            // UPSERT: evita 409 duplicate su unique(event_id, package)
            const { error: e2 } = await supabase.from("event_packages").upsert(
                [
                    { event_id: eventId, package: "base", total_tables: safeNumber(totBase, 0), booked_tables: 0 },
                    { event_id: eventId, package: "premium", total_tables: safeNumber(totPremium, 0), booked_tables: 0 },
                    { event_id: eventId, package: "elite", total_tables: safeNumber(totElite, 0), booked_tables: 0 },
                ],
                { onConflict: "event_id,package" }
            );

            if (e2) throw e2;

            setNewTitle("");
            setNewDate("");
            setNewPosterUrl("");
            setTotBase(20);
            setTotPremium(20);
            setTotElite(20);
            setNewActive(true);

            await loadEvents();
            setSelectedEventId(eventId);
            setTab("availability");

            alert("Evento creato ✅");
        } catch (e) {
            alert(e instanceof Error ? e.message : "Errore creazione evento");
        } finally {
            setLoading(false);
            creatingRef.current = false;
        }
    };

    const saveEventMeta = async () => {
        if (!selectedEvent) return;
        setLoading(true);
        try {
            const { error } = await supabase
                .from("events")
                .update({
                    poster_url: editPosterUrl.trim() || null,
                    active: !!editActive,
                })
                .eq("id", selectedEvent.id);

            if (error) throw error;

            await loadEvents();
            alert("Aggiornato ✅");
        } catch (e) {
            alert(e instanceof Error ? e.message : "Errore aggiornamento evento");
        } finally {
            setLoading(false);
        }
    };

    const deactivateEvent = async () => {
        if (!selectedEvent) return;
        if (!confirm("Disattivare questo evento? (active = false)")) return;

        setLoading(true);
        try {
            const { error } = await supabase.from("events").update({ active: false }).eq("id", selectedEvent.id);
            if (error) throw error;

            await loadEvents();
            alert("Evento disattivato ✅");
        } catch (e) {
            alert(e instanceof Error ? e.message : "Errore disattivazione evento");
        } finally {
            setLoading(false);
        }
    };

    const saveAvailability = async () => {
        if (!selectedEvent) return;

        const bookedBase = availability.base.booked_tables;
        const bookedPremium = availability.premium.booked_tables;
        const bookedElite = availability.elite.booked_tables;

        if (editTotBase < bookedBase) return alert(`Base: non puoi scendere sotto ${bookedBase}`);
        if (editTotPremium < bookedPremium) return alert(`Premium: non puoi scendere sotto ${bookedPremium}`);
        if (editTotElite < bookedElite) return alert(`Elite: non puoi scendere sotto ${bookedElite}`);

        setLoading(true);
        try {
            const { error } = await supabase.from("event_packages").upsert(
                [
                    { event_id: selectedEvent.id, package: "base", total_tables: safeNumber(editTotBase, 0), booked_tables: bookedBase },
                    { event_id: selectedEvent.id, package: "premium", total_tables: safeNumber(editTotPremium, 0), booked_tables: bookedPremium },
                    { event_id: selectedEvent.id, package: "elite", total_tables: safeNumber(editTotElite, 0), booked_tables: bookedElite },
                ],
                { onConflict: "event_id,package" }
            );

            if (error) throw error;

            await loadEventDetails(selectedEvent.id);
            alert("Disponibilità aggiornata ✅");
        } catch (e) {
            alert(e instanceof Error ? e.message : "Errore aggiornamento disponibilità");
        } finally {
            setLoading(false);
        }
    };

    const logout = async () => {
        await supabase.auth.signOut();
        nav("/staff-login", { replace: true });
    };

    const eventOptions = useMemo(
        () =>
            events.map((e) => ({
                value: e.id,
                label: `${fmtDateISO(e.date)} • ${e.title}`,
            })),
        [events]
    );

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white font-sans selection:bg-cyan-500/30">
            {/* bg glow */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-cyan-500/10 blur-[120px] rounded-full" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/10 blur-[120px] rounded-full" />
            </div>

            {/* HEADER */}
            <div className="sticky top-0 z-50 border-b border-cyan-500/20 bg-black/80 backdrop-blur-md">
                <div className="mx-auto max-w-7xl px-4 py-4 flex items-center justify-between">
                    <div>
                        <Text fw={900} className="tracking-tighter text-xl">
                            // STAFF • EVENT MANAGER
                        </Text>
                        <Text size="xs" c="zinc.5" className="uppercase tracking-widest">
                            {loading ? "loading…" : "ready"}
                        </Text>
                    </div>

                    <Group gap="xs">
                        <Button variant="outline" color="cyan" radius="0" size="sm" onClick={loadEvents} disabled={loading}>
                            Refresh
                        </Button>
                        <Button variant="subtle" color="gray" radius="0" size="sm" onClick={() => nav("/")}>
                            Home
                        </Button>
                        <Button variant="subtle" color="gray" radius="0" size="sm" onClick={logout}>
                            Logout
                        </Button>
                    </Group>
                </div>
            </div>

            <main className="mx-auto max-w-7xl px-4 py-8 relative z-10">
                <Tabs value={tab} onChange={setTab} radius="0" color="cyan">
                    <Tabs.List>
                        <Tabs.Tab value="events">Eventi</Tabs.Tab>
                        <Tabs.Tab value="availability" disabled={!selectedEventId}>
                            Disponibilità
                        </Tabs.Tab>
                        <Tabs.Tab value="reservations" disabled={!selectedEventId}>
                            Prenotazioni
                        </Tabs.Tab>
                    </Tabs.List>

                    {/* EVENTS TAB */}
                    <Tabs.Panel value="events" pt="lg">
                        <SimpleGrid cols={{ base: 1, md: 2 }} spacing="lg">
                            <Card radius="0" className="bg-zinc-900/40 border border-zinc-800">
                                <Stack gap="md">
                                    <Text fw={900} className="uppercase tracking-widest text-cyan-400">
                                        Seleziona evento
                                    </Text>

                                    <Select
                                        data={eventOptions}
                                        value={selectedEventId}
                                        onChange={(v) => setSelectedEventId(v)}
                                        placeholder="Scegli evento…"
                                        searchable
                                        nothingFoundMessage="Nessun evento"
                                    />

                                    {selectedEvent && (
                                        <div className="border border-zinc-800 bg-black/30 p-3">
                                            <Group justify="space-between" align="flex-start">
                                                <div>
                                                    <Text fw={900}>{selectedEvent.title}</Text>
                                                    <Text size="xs" c="zinc.5">
                                                        {fmtDateISO(selectedEvent.date)} • code: {selectedEvent.code}
                                                    </Text>
                                                </div>
                                                <Badge color={selectedEvent.active ? "green" : "red"} variant="light">
                                                    {selectedEvent.active ? "ACTIVE" : "OFF"}
                                                </Badge>
                                            </Group>

                                            <Divider my="md" color="dark.7" />

                                            <TextInput
                                                label="Poster URL (facoltativo)"
                                                placeholder="https://..."
                                                value={editPosterUrl}
                                                onChange={(e) => setEditPosterUrl(e.currentTarget.value)}
                                            />

                                            <Group justify="space-between" mt="md">
                                                <Switch checked={editActive} onChange={(e) => setEditActive(e.currentTarget.checked)} label="Evento attivo" />
                                                <Group gap="xs">
                                                    <Button variant="outline" color="cyan" radius="0" onClick={saveEventMeta} disabled={loading}>
                                                        Salva
                                                    </Button>
                                                    <Button color="red" radius="0" variant="outline" onClick={deactivateEvent} disabled={loading}>
                                                        Disattiva
                                                    </Button>
                                                </Group>
                                            </Group>
                                        </div>
                                    )}
                                </Stack>
                            </Card>

                            <Card radius="0" className="bg-zinc-900/40 border border-zinc-800">
                                <Stack gap="md">
                                    <Text fw={900} className="uppercase tracking-widest text-cyan-400">
                                        Crea nuovo evento
                                    </Text>

                                    <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
                                        <Select
                                            label="Giorno"
                                            data={[
                                                { value: "mon", label: "Lunedì" },
                                                { value: "tue", label: "Martedì" },
                                                { value: "wed", label: "Mercoledì" },
                                                { value: "thu", label: "Giovedì" },
                                                { value: "fri", label: "Venerdì" },
                                                { value: "sat", label: "Sabato" },
                                                { value: "sun", label: "Domenica" },
                                            ]}
                                            value={newCode}
                                            onChange={(v) => setNewCode(v || "fri")}
                                        />
                                        <TextInput
                                            label="Data (YYYY-MM-DD)"
                                            placeholder="2026-01-23"
                                            value={newDate}
                                            onChange={(e) => setNewDate(e.currentTarget.value)}
                                        />
                                    </SimpleGrid>

                                    <TextInput
                                        label="Titolo"
                                        placeholder="Venerdì Italiano"
                                        value={newTitle}
                                        onChange={(e) => setNewTitle(e.currentTarget.value)}
                                    />

                                    <TextInput
                                        label="Poster URL (facoltativo)"
                                        placeholder="https://..."
                                        value={newPosterUrl}
                                        onChange={(e) => setNewPosterUrl(e.currentTarget.value)}
                                    />

                                    <Switch checked={newActive} onChange={(e) => setNewActive(e.currentTarget.checked)} label="Attivo" />

                                    <Divider color="dark.7" />

                                    <Text size="sm" c="zinc.4">
                                        Disponibilità tavoli (totali)
                                    </Text>

                                    <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="md">
                                        <NumberInput label="Base" min={0} value={totBase} onChange={(v) => setTotBase(safeNumber(v))} />
                                        <NumberInput label="Premium" min={0} value={totPremium} onChange={(v) => setTotPremium(safeNumber(v))} />
                                        <NumberInput label="Elite" min={0} value={totElite} onChange={(v) => setTotElite(safeNumber(v))} />
                                    </SimpleGrid>

                                    <Button
                                        color="cyan"
                                        radius="0"
                                        className="font-black uppercase"
                                        onClick={createEvent}
                                        disabled={loading || creatingRef.current}
                                    >
                                        Crea evento
                                    </Button>

                                    <Text size="xs" c="zinc.6">
                                        Nota: se premi 2 volte, non va più in 409 (upsert).
                                    </Text>
                                </Stack>
                            </Card>
                        </SimpleGrid>
                    </Tabs.Panel>

                    {/* AVAILABILITY TAB */}
                    <Tabs.Panel value="availability" pt="lg">
                        {!selectedEvent ? (
                            <Text c="zinc.4">Seleziona un evento.</Text>
                        ) : (
                            <SimpleGrid cols={{ base: 1, md: 2 }} spacing="lg">
                                <Card radius="0" className="bg-zinc-900/40 border border-zinc-800">
                                    <Stack gap="md">
                                        <Text fw={900} className="uppercase tracking-widest text-cyan-400">
                                            Disponibilità • {fmtDateISO(selectedEvent.date)}
                                        </Text>

                                        <div className="border border-zinc-800 bg-black/30 p-3">
                                            <Group justify="space-between">
                                                <Text size="sm" c="zinc.4">
                                                    Base
                                                </Text>
                                                <Text fw={900}>
                                                    {availability.base.total_tables - availability.base.booked_tables} / {availability.base.total_tables}
                                                </Text>
                                            </Group>
                                            <Group justify="space-between" mt="xs">
                                                <Text size="sm" c="zinc.4">
                                                    Premium
                                                </Text>
                                                <Text fw={900}>
                                                    {availability.premium.total_tables - availability.premium.booked_tables} / {availability.premium.total_tables}
                                                </Text>
                                            </Group>
                                            <Group justify="space-between" mt="xs">
                                                <Text size="sm" c="zinc.4">
                                                    Elite
                                                </Text>
                                                <Text fw={900}>
                                                    {availability.elite.total_tables - availability.elite.booked_tables} / {availability.elite.total_tables}
                                                </Text>
                                            </Group>
                                        </div>

                                        <Divider color="dark.7" />

                                        <Text size="sm" c="zinc.4">
                                            Imposta nuovi totali (non tocca booked)
                                        </Text>

                                        <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="md">
                                            <NumberInput label="Base" min={0} value={editTotBase} onChange={(v) => setEditTotBase(safeNumber(v))} />
                                            <NumberInput label="Premium" min={0} value={editTotPremium} onChange={(v) => setEditTotPremium(safeNumber(v))} />
                                            <NumberInput label="Elite" min={0} value={editTotElite} onChange={(v) => setEditTotElite(safeNumber(v))} />
                                        </SimpleGrid>

                                        <Button color="cyan" radius="0" onClick={saveAvailability} disabled={loading} className="font-black uppercase">
                                            Salva disponibilità
                                        </Button>

                                        <Text size="xs" c="zinc.6">
                                            Nota: non scendere sotto i tavoli già prenotati (booked).
                                        </Text>
                                    </Stack>
                                </Card>

                                <Card radius="0" className="bg-zinc-900/40 border border-zinc-800">
                                    <Stack gap="md">
                                        <Text fw={900} className="uppercase tracking-widest text-cyan-400">
                                            Info evento
                                        </Text>
                                        <Text fw={900}>{selectedEvent.title}</Text>
                                        <Text size="sm" c="zinc.4">
                                            Giorno: {selectedEvent.code} • Data: {fmtDateISO(selectedEvent.date)}
                                        </Text>
                                        <Badge color={selectedEvent.active ? "green" : "red"} variant="light">
                                            {selectedEvent.active ? "ACTIVE" : "OFF"}
                                        </Badge>

                                        <Divider color="dark.7" />

                                        <Text size="sm" c="zinc.4">
                                            Poster URL
                                        </Text>
                                        <Text size="xs" c="zinc.5" style={{ wordBreak: "break-all" }}>
                                            {selectedEvent.poster_url ?? "—"}
                                        </Text>
                                    </Stack>
                                </Card>
                            </SimpleGrid>
                        )}
                    </Tabs.Panel>

                    {/* RESERVATIONS TAB */}
                    <Tabs.Panel value="reservations" pt="lg">
                        {!selectedEvent ? (
                            <Text c="zinc.4">Seleziona un evento.</Text>
                        ) : (
                            <Stack gap="lg">
                                <Card radius="0" className="bg-zinc-900/40 border border-zinc-800">
                                    <Group justify="space-between" align="flex-end">
                                        <div>
                                            <Text fw={900} className="uppercase tracking-widest text-cyan-400">
                                                Prenotazioni • {fmtDateISO(selectedEvent.date)}
                                            </Text>
                                            <Text size="sm" c="zinc.4">
                                                {selectedEvent.title}
                                            </Text>
                                        </div>

                                        <Group gap="xs">
                                            <Button
                                                radius="0"
                                                variant="outline"
                                                color="cyan"
                                                onClick={exportReservationsPdf}
                                                disabled={reservations.length === 0}
                                            >
                                                Esporta PDF
                                            </Button>

                                            <div className="text-right">
                                                <Text size="xs" c="zinc.5" className="uppercase tracking-widest">
                                                    Tavoli
                                                </Text>
                                                <Text fw={900}>{totalsBooked}</Text>
                                                <Text size="xs" c="zinc.5" className="uppercase tracking-widest mt-2">
                                                    Incasso
                                                </Text>
                                                <Text fw={900} c="cyan">
                                                    {euro(totalsRevenue)}
                                                </Text>
                                            </div>
                                        </Group>
                                    </Group>
                                </Card>

                                <Card radius="0" className="bg-zinc-900/40 border border-zinc-800">
                                    <Table.ScrollContainer minWidth={900}>
                                        <Table striped highlightOnHover>
                                            <Table.Thead>
                                                <Table.Tr>
                                                    <Table.Th>Data</Table.Th>
                                                    <Table.Th>Nome</Table.Th>
                                                    <Table.Th>Telefono</Table.Th>
                                                    <Table.Th>Pacchetto</Table.Th>
                                                    <Table.Th>Tavoli</Table.Th>
                                                    <Table.Th>Totale</Table.Th>
                                                    <Table.Th>Note</Table.Th>
                                                </Table.Tr>
                                            </Table.Thead>
                                            <Table.Tbody>
                                                {reservations.map((r) => (
                                                    <Table.Tr key={r.id}>
                                                        <Table.Td>{new Date(r.created_at).toLocaleString("it-IT")}</Table.Td>
                                                        <Table.Td>{r.name}</Table.Td>
                                                        <Table.Td>{r.phone}</Table.Td>
                                                        <Table.Td>
                                                            <Badge
                                                                color={r.package === "base" ? "red" : r.package === "premium" ? "green" : "yellow"}
                                                                variant="light"
                                                            >
                                                                {r.package}
                                                            </Badge>
                                                        </Table.Td>
                                                        <Table.Td>{r.tables}</Table.Td>
                                                        <Table.Td>{euro(r.total)}</Table.Td>
                                                        <Table.Td>{r.notes ?? "—"}</Table.Td>
                                                    </Table.Tr>
                                                ))}

                                                {reservations.length === 0 && (
                                                    <Table.Tr>
                                                        <Table.Td colSpan={7}>
                                                            <Text c="zinc.4" size="sm">
                                                                Nessuna prenotazione per questo evento.
                                                            </Text>
                                                        </Table.Td>
                                                    </Table.Tr>
                                                )}
                                            </Table.Tbody>
                                        </Table>
                                    </Table.ScrollContainer>
                                </Card>
                            </Stack>
                        )}
                    </Tabs.Panel>
                </Tabs>
            </main>
        </div>
    );
}