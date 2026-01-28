import { useEffect, useMemo, useState } from "react";
import {
    Button,
    Card,
    Divider,
    Group,
    NumberInput,
    SimpleGrid,
    Stack,
    Text,
    TextInput,
    Textarea,
    Modal,
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { useNavigate } from "react-router-dom";
import FloorMap from "../components/FloorMap";
import { supabase } from "../supabase";

// Asset
import logoSorso from "../assets/logo.svg";

/* =======================
   TYPES
======================= */
export type PackageCode = "base" | "premium" | "elite";

type SupabaseEvent = {
    id: string; // uuid
    code: string; // mon/tue/... o altro
    title: string;
    date: string; // YYYY-MM-DD
    poster_url: string | null;
    active?: boolean;
};

type PackageItem = {
    code: PackageCode;
    label: string;
    price: number;
    area: string;
    color: string;
};

type UserData = {
    name: string;
    phone: string;
    notes: string;
};

type AvailabilityRow = {
    package: PackageCode;
    total_tables: number;
    booked_tables: number;
};

type DataFormSectionProps = {
    tables: number;
    setTables: (n: number) => void;
    userData: UserData;
    setUserData: (u: UserData) => void;
    compact?: boolean;
    selectEvent:SupabaseEvent
};

type SummaryRowProps = {
    label: string;
    value: string;
    isHighlight?: boolean;
};

/* =======================
   DATA (STATIC)
======================= */
const PEOPLE_PER_TABLE = 6;

const PACKAGES: PackageItem[] = [
    { code: "base", label: "Base", price: 100, area: "Sala", color: "cyan" },
    { code: "premium", label: "Premium", price: 130, area: "Top Privé DJ", color: "grape" },
    { code: "elite", label: "Élite", price: 160, area: "Privé Rialzato", color: "emerald" },
];

const BOTTLE_LIST: Record<PackageCode, string[]> = {
    base: ["Bulldog 1L", "Bombay 1L", "Tanqueray 1L", "Stolichnaya 1L", "Ferrari Maximum 0,75L"],
    premium: [
        "Gin Mare 0,75L",
        "Hendricks 0,75L",
        "Grey Goose 0,7L",
        "Belvedere 0,7L",
        "Moët Brut Impérial",
        "Ferrari Perlé",
    ],
    elite: ["Portofino 0,75L", "Portofino Peninsula 0,75L", "Elit Vodka 0,75L", "Moët Ice 0,75L", "Gleego 0,75L"],
};

const euro = (n: number) => new Intl.NumberFormat("it-IT", { style: "currency", currency: "EUR" }).format(n);

function formatDateLabelISO(dateISO: string) {
    const d = new Date(dateISO + "T00:00:00");
    const days = ["DOM", "LUN", "MAR", "MER", "GIO", "VEN", "SAB"];
    const months = ["GEN", "FEB", "MAR", "APR", "MAG", "GIU", "LUG", "AGO", "SET", "OTT", "NOV", "DIC"];
    const dd = String(d.getDate()).padStart(2, "0");
    return `${days[d.getDay()]} ${dd} ${months[d.getMonth()]}`;
}

/* =======================
   APP
======================= */
export default function BookingPage() {
    const nav = useNavigate();
    const isDesktop = useMediaQuery("(min-width: 1024px)");

    // UI step (mobile)
    const [step, setStep] = useState<number>(1);

    // Supabase events
    const [events, setEvents] = useState<SupabaseEvent[]>([]);
    const [loadingEvents, setLoadingEvents] = useState<boolean>(true);

    // event selection now uses UUID
    const [eventId, setEventId] = useState<string>("");

    // package & tables
    const [pkg, setPkg] = useState<PackageCode>("premium");
    const [tables, setTables] = useState<number>(1);

    // availability per package for selected event
    const [availability, setAvailability] = useState<Record<PackageCode, number>>({
        base: 0,
        premium: 0,
        elite: 0,
    });
    const [loadingAvailability, setLoadingAvailability] = useState<boolean>(false);

    // form data
    const [userData, setUserData] = useState<UserData>({ name: "", phone: "", notes: "" });

    // listino modal
    const [listinoOpen, setListinoOpen] = useState<boolean>(false);

    const selectedEvent = useMemo(() => events.find((e) => e.id === eventId), [events, eventId]);
    const selectedPackage = useMemo(() => PACKAGES.find((p) => p.code === pkg) ?? PACKAGES[0], [pkg]);

    const totalPeople = tables * PEOPLE_PER_TABLE;
    const totalEuro = tables * selectedPackage.price;

    const nextStep = () => setStep((s) => Math.min(s + 1, 3));
    const prevStep = () => setStep((s) => Math.max(s - 1, 1));

    /* =======================
         LOAD EVENTS
    ======================= */
    useEffect(() => {
        const loadEvents = async () => {
            setLoadingEvents(true);

            const { data, error } = await supabase
                .from("events")
                .select("id, code, title, date, poster_url, active")
                .eq("active", true)
                .order("date", { ascending: true });

            if (error) {
                console.error("Errore caricamento eventi:", error);
                setEvents([]);
                setEventId("");
                setLoadingEvents(false);
                return;
            }

            const safe = (data ?? []) as SupabaseEvent[];
            setEvents(safe);

            if (safe.length === 0) {
                setEventId("");
            } else if (!eventId) {
                setEventId(safe[0].id);
            }

            setLoadingEvents(false);
        };

        loadEvents();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    /* =======================
         LOAD AVAILABILITY (when event changes)
    ======================= */
    useEffect(() => {
        const loadAvailability = async () => {
            if (!eventId) return;

            setLoadingAvailability(true);

            const { data, error } = await supabase
                .from("event_packages")
                .select("package, total_tables, booked_tables")
                .eq("event_id", eventId);

            if (error) {
                console.error("Errore caricamento disponibilità:", error);
                setAvailability({ base: 0, premium: 0, elite: 0 });
                setLoadingAvailability(false);
                return;
            }

            const rows = (data ?? []) as AvailabilityRow[];
            const map: Record<PackageCode, number> = { base: 0, premium: 0, elite: 0 };

            rows.forEach((r) => {
                map[r.package] = Math.max(0, r.total_tables - r.booked_tables);
            });

            setAvailability(map);

            if (map[pkg] <= 0) {
                const firstAvailable = (Object.keys(map) as PackageCode[]).find((k) => map[k] > 0);
                if (firstAvailable) setPkg(firstAvailable);
            }

            setLoadingAvailability(false);
        };

        loadAvailability();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [eventId]);

    /* =======================
         CREATE RESERVATION (RPC)
    ======================= */
    const createReservation = async () => {
        if (!selectedEvent) {
            alert("Seleziona un evento");
            return;
        }

        if (!userData.name.trim() || !userData.phone.trim()) {
            alert("Inserisci nome e numero telefono");
            return;
        }

        if (availability[pkg] < tables) {
            alert("Tavoli non disponibili per questa zona");
            return;
        }

        const { error } = await supabase.rpc("create_reservation", {
            p_event_id: selectedEvent.id,
            p_package: pkg,
            p_tables: tables,
            p_name: userData.name.trim(),
            p_phone: userData.phone.trim(),
            p_notes: userData.notes?.trim() ?? "",
            p_total: totalEuro,
        });

        if (error) {
            console.error(error);
            const msg = String(error.message || "");
            if (msg.toLowerCase().includes("posti non disponibili")) {
                alert("Posti esauriti per questa zona");
            } else {
                alert("Errore prenotazione: " + msg);
            }
            return;
        }

        alert("Prenotazione inviata ✅");

        try {
            setLoadingAvailability(true);
            const { data } = await supabase
                .from("event_packages")
                .select("package, total_tables, booked_tables")
                .eq("event_id", selectedEvent.id);

            const rows = (data ?? []) as AvailabilityRow[];
            const map: Record<PackageCode, number> = { base: 0, premium: 0, elite: 0 };
            rows.forEach((r) => (map[r.package] = Math.max(0, r.total_tables - r.booked_tables)));
            setAvailability(map);
        } finally {
            setLoadingAvailability(false);
        }

        setUserData({ name: "", phone: "", notes: "" });
        setTables(1);
    };

    const selectPkgSafe = (p: PackageCode) => {
        if (availability[p] <= 0) {
            alert("Zona esaurita");
            return;
        }
        setPkg(p);
    };

    if (loadingEvents) {
        return (
            <div className="min-h-screen bg-[#0a0a0a] text-white grid place-items-center">
                <div className="text-center">
                    <div className="text-cyan-400 font-black tracking-widest">CARICAMENTO…</div>
                    <div className="text-zinc-400 text-sm mt-2">Sto caricando gli eventi</div>
                </div>
            </div>
        );
    }

    /* =======================
       MODALE LISTINO (serve anche nella schermata “nessun evento”)
    ======================= */
    const ListinoModal = (
        <Modal
            opened={listinoOpen}
            onClose={() => setListinoOpen(false)}
            title={<Text fw={900} className="tracking-tighter italic text-cyan-400">// LISTINO</Text>}
            centered
            size="lg"
            radius="0"
            overlayProps={{ backgroundOpacity: 0.8, blur: 10 }}
            styles={{ content: { backgroundColor: "#0f0f0f", border: "2px solid #222" } }}
        >
            <Stack gap="xl">
                {PACKAGES.map((p) => (
                    <div key={p.code} className="border-l-2 border-cyan-500 pl-4 py-2">
                        <Group justify="space-between" mb="xs">
                            <Text fw={900} className="uppercase">
                                {p.label}
                            </Text>
                            <Text fw={900} c="cyan">
                                {euro(p.price)}
                            </Text>
                        </Group>

                        <Text size="xs" c="zinc.5" className="opacity-70 mb-2">
                            // 1 bottiglia = 1 tavolo — max 6 persone
                        </Text>

                        {BOTTLE_LIST[p.code].map((b) => (
                            <Text key={b} size="xs" c="zinc.5" className="opacity-70">
                                // {b}
                            </Text>
                        ))}

                        <Divider mt="md" color="dark.7" />
                    </div>
                ))}
            </Stack>
        </Modal>
    );

    /* =======================
       SE NON CI SONO EVENTI ATTIVI
    ======================= */
    if (!selectedEvent) {
        return (
            <div className="min-h-screen bg-[#0a0a0a] text-white font-sans selection:bg-cyan-500/30">
                {/* BG */}
                <div className="fixed inset-0 overflow-hidden pointer-events-none">
                    <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-cyan-500/10 blur-[120px] rounded-full" />
                    <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/10 blur-[120px] rounded-full" />
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.03]" />
                </div>

                {ListinoModal}

                {/* NAVBAR minimale */}
                <nav className="sticky top-0 z-50 border-b border-cyan-500/20 bg-black/80 backdrop-blur-md">
                    <div className="mx-auto max-w-7xl px-6 py-4 flex justify-between items-center">
                        <Group gap="xs">
                            <img src={logoSorso} className="h-8" alt="Sorso Club" />
                            <Text fw={900} size="xl" className="tracking-tighter hidden sm:block">
                                CLUB
                            </Text>
                        </Group>

                        <Group gap="xs">
                            <Button
                                variant="outline"
                                color="cyan"
                                radius="0"
                                size="xs"
                                className="uppercase font-black border-2"
                                onClick={() => setListinoOpen(true)}
                            >
                                Listino
                            </Button>

                            <Button
                                variant="subtle"
                                color="gray"
                                radius="0"
                                size="xs"
                                className="uppercase font-black"
                                onClick={() => nav("/staff-login")}
                            >
                                Staff
                            </Button>
                        </Group>
                    </div>
                </nav>

                <div className="min-h-[calc(100vh-72px)] grid place-items-center px-6 relative z-10">
                    <div className="max-w-md text-center">
                        <div className="text-xl font-black text-cyan-400">// NESSUN EVENTO ATTIVO</div>
                        <div className="text-zinc-400 mt-2">
                            Attiva almeno un evento su Supabase (events.active = true).
                        </div>

                        <Group justify="center" mt="xl">
                            <Button radius="0" color="cyan" className="uppercase font-black" onClick={() => nav("/staff-login")}>
                                Vai allo Staff
                            </Button>
                        </Group>
                    </div>
                </div>
            </div>
        );
    }

    /* =======================
       UI “normale” con eventi
    ======================= */
    const eventDateLabel = formatDateLabelISO(selectedEvent.date);
    const poster = selectedEvent.poster_url ?? "";

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white font-sans selection:bg-cyan-500/30">
            {/* EFFETTI SFONDO CYBER */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-cyan-500/10 blur-[120px] rounded-full" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/10 blur-[120px] rounded-full" />
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.03]" />
            </div>

            {ListinoModal}

            {/* NAVBAR */}
            <nav className="sticky top-0 z-50 border-b border-cyan-500/20 bg-black/80 backdrop-blur-md">
                <div className="mx-auto max-w-7xl px-6 py-4 flex justify-between items-center">
                    <Group gap="xs">
                        <img src={logoSorso} className="h-8" alt="Sorso Club" />
                        <Text fw={900} size="xl" className="tracking-tighter hidden sm:block">
                            CLUB
                        </Text>
                    </Group>

                    <Group gap="xs">
                        <Button
                            variant="outline"
                            color="cyan"
                            radius="0"
                            size="xs"
                            className="uppercase font-black border-2"
                            onClick={() => setListinoOpen(true)}
                        >
                            Listino
                        </Button>

                        <Button
                            variant="subtle"
                            color="gray"
                            radius="0"
                            size="xs"
                            className="uppercase font-black"
                            onClick={() => nav("/staff-login")}
                        >
                            Staff
                        </Button>
                    </Group>
                </div>
            </nav>

            <main className="mx-auto max-w-7xl px-4 py-8 relative z-10">
                <Text fw={900} size="xl" className="italic tracking-tighter mb-8 text-zinc-400">
                    // PRENOTAZIONE — CYBER NIGHTS //
                </Text>

                {/* PROGRESS MOBILE */}
                {!isDesktop && (
                    <Group grow mb="xl" gap="xs">
                        {[1, 2, 3].map((s) => (
                            <div
                                key={s}
                                className={`h-1.5 transition-all ${step >= s ? "bg-cyan-500 shadow-[0_0_10px_#06b6d4]" : "bg-zinc-800"}`}
                            />
                        ))}
                    </Group>
                )}

                <SimpleGrid cols={{ base: 1, lg: 2 }} spacing={60}>
                    {/* SINISTRA */}
                    <Stack gap={40}>
                        {(step === 1 || isDesktop) && (
                            <section>
                                <Text fw={900} size="xs" c="cyan" mb="md" className="uppercase tracking-[0.3em] font-mono">
                                    / Step 01 / Evento
                                </Text>

                                <SimpleGrid cols={3} spacing="md">
                                    {events.map((e) => {
                                        const active = e.id === eventId;
                                        const label = formatDateLabelISO(e.date);
                                        const ePoster = e.poster_url ?? "";

                                        return (
                                            <button
                                                key={e.id}
                                                onClick={() => {
                                                    setEventId(e.id);
                                                    if (!isDesktop) nextStep();
                                                }}
                                                className={`relative aspect-square overflow-hidden border-2 transition-all duration-500 ${
                                                    active
                                                        ? "border-cyan-500 shadow-[0_0_20px_rgba(6,184,212,0.4)] scale-95"
                                                        : "border-zinc-800 opacity-40 hover:opacity-100"
                                                }`}
                                            >
                                                {ePoster ? (
                                                    <img src={ePoster} className="absolute inset-0 w-full h-full object-cover" alt={e.title} />
                                                ) : (
                                                    <div className="absolute inset-0 bg-zinc-900 grid place-items-center text-zinc-500 text-xs">
                                                        NESSUN POSTER
                                                    </div>
                                                )}

                                                <div className="absolute inset-x-0 bottom-0 bg-black/80 p-2 border-t border-cyan-500/50">
                                                    <Text size="9px" fw={900} className="truncate uppercase">
                                                        {label}
                                                    </Text>
                                                </div>
                                            </button>
                                        );
                                    })}
                                </SimpleGrid>

                                <Text size="xs" c="zinc.5" className="opacity-70 mt-3">
                                    // Evento selezionato: {eventDateLabel}
                                </Text>
                            </section>
                        )}

                        {(step === 2 || isDesktop) && (
                            <section>
                                <Group justify="space-between" align="flex-end" mb="md">
                                    <Text fw={900} size="xs" c="purple.4" className="uppercase tracking-[0.3em] font-mono">
                                        / Step 02 / Zona
                                    </Text>
                                    <Text size="xs" c="zinc.5" className="opacity-70">
                                        {loadingAvailability ? "// caricamento disponibilità…" : "//"}
                                    </Text>
                                </Group>

                                <div className="grid grid-cols-3 gap-2 mb-3">
                                    {PACKAGES.map((p) => {
                                        const a = availability[p.code];
                                        const ok = a > 0;
                                        const cls = ok ? "border-emerald-500/30 text-emerald-300" : "border-red-500/25 text-red-300";
                                        return (
                                            <div key={p.code} className={`border bg-black/30 px-2 py-2 text-[10px] uppercase tracking-widest ${cls}`}>
                                                <div className="font-black">{p.label}</div>
                                                <div className="opacity-80">{ok ? `${a} tavoli` : "esaurito"}</div>
                                            </div>
                                        );
                                    })}
                                </div>

                                <div className="p-1 bg-zinc-900 border border-zinc-800 shadow-2xl relative">
                                    <div className="absolute -top-1 -left-1 w-4 h-4 border-t-2 border-l-2 border-cyan-500" />
                                    <div className="absolute -bottom-1 -right-1 w-4 h-4 border-b-2 border-r-2 border-cyan-500" />

                                    <FloorMap pkg={pkg} onSelect={(p) => selectPkgSafe(p)} />
                                </div>

                                <Text size="xs" c="zinc.5" className="opacity-70 mt-3">
                                    // Disponibili in {selectedPackage.label}: {availability[pkg]} tavoli
                                </Text>
                            </section>
                        )}

                        {!isDesktop && step === 3 && (
                            <DataFormSection tables={tables} setTables={setTables} userData={userData} setUserData={setUserData} selectEvent={selectedEvent} />
                        )}
                    </Stack>

                    {/* DESTRA (RIEPILOGO) */}
                    {(isDesktop || step === 3) && (
                        <Stack className={isDesktop ? "lg:sticky lg:top-28" : ""} gap="xl">
                            {isDesktop && (
                                <DataFormSection  tables={tables} setTables={setTables} userData={userData} setUserData={setUserData} compact selectEvent={selectedEvent} />
                            )}

                            <Card radius="0" p={0} className="bg-zinc-900/50 border border-zinc-800 backdrop-blur-xl overflow-hidden shadow-2xl">
                                <div className="relative h-48 overflow-hidden border-b border-white/5">
                                    {poster ? (
                                        <>
                                            <img
                                                src={poster}
                                                className="w-full h-full object-cover blur-sm opacity-50 absolute scale-110"
                                                alt={selectedEvent.title}
                                            />
                                            <img
                                                src={poster}
                                                className="w-full h-full object-contain relative z-10 p-4"
                                                alt={selectedEvent.title}
                                            />
                                        </>
                                    ) : (
                                        <div className="absolute inset-0 bg-zinc-900 grid place-items-center text-zinc-500 text-xs">NESSUN POSTER</div>
                                    )}
                                    <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 to-transparent z-20" />
                                </div>

                                <div className="h-1 bg-gradient-to-r from-cyan-500 via-purple-500 to-emerald-500" />

                                <Stack p={30} gap="xl">
                                    <div className="space-y-4">
                                        <SummaryRow label="Evento" value={selectedEvent.title} />
                                        <SummaryRow label="Data" value={eventDateLabel} />
                                        <SummaryRow label="Zona" value={selectedPackage.area} isHighlight />
                                        <SummaryRow label="Referente" value={userData.name || "—"} />
                                        {selectedEvent.title === 'FestivalBar' || selectedEvent.title === 'Live Band Aperitivo'?<div></div>:<SummaryRow label="Tavoli" value={`${tables}`} />}
                                        {selectedEvent.title === 'FestivalBar' || selectedEvent.title === 'Live Band Aperitivo'?<div></div>:<SummaryRow label="Persone" value={`${totalPeople} max`} />}
                                    </div>

                                    <div className="bg-black/50 p-4 border border-zinc-800 text-center relative overflow-hidden group">
                                        <div className="absolute inset-0 bg-cyan-500/5 translate-y-full group-hover:translate-y-0 transition-transform" />
                                        {selectedEvent.title === 'FestivalBar' || selectedEvent.title === 'Live Band Aperitivo'?<div></div>:<Text size="xs" c="zinc.5" className="uppercase tracking-widest mb-1 relative z-10">
                                            Totale dovuto
                                            </Text>}
                                         <Text fw={900} size="42px" className="text-white tracking-tighter tabular-nums relative z-10">
                                             {selectedEvent.title === 'FestivalBar' || selectedEvent.title === 'Live Band Aperitivo'?'Questo evento non prevede la bottiglia':euro(totalEuro)}
                                        </Text>
                                    </div>

                                    <Button
                                        size="xl"
                                        radius="0"
                                        className="h-16 font-black uppercase tracking-widest transition-all hover:shadow-[0_0_30px_rgba(6,184,212,0.4)]"
                                        color="cyan"
                                        onClick={createReservation}
                                        disabled={!userData.name.trim() || !userData.phone.trim() || loadingAvailability || availability[pkg] < tables}
                                    >
                                        Conferma prenotazione
                                    </Button>

                                    <Text size="xs" c="zinc.5" className="opacity-70">
                                        {loadingAvailability
                                            ? "// aggiornamento disponibilità…"
                                            : availability[pkg] < tables
                                                ? "// tavoli insufficienti per questa zona"
                                                : "//"}
                                    </Text>

                                    {!isDesktop && (
                                        <Button variant="subtle" color="gray" size="xs" onClick={prevStep} className="uppercase opacity-50">
                                            // Torna alla mappa
                                        </Button>
                                    )}
                                </Stack>
                            </Card>
                        </Stack>
                    )}
                </SimpleGrid>
            </main>

            {/* NAV MOBILE */}
            {!isDesktop && step < 3 && (
                <div className="fixed bottom-0 inset-x-0 z-[100] border-t border-cyan-500/30 bg-black/90 backdrop-blur-xl p-4">
                    <div className="flex gap-2">
                        {step > 1 && (
                            <Button radius="0" size="lg" variant="outline" color="zinc" onClick={prevStep} className="border-2 uppercase font-black">
                                Indietro
                            </Button>
                        )}
                        <Button
                            radius="0"
                            size="lg"
                            className="flex-1 uppercase font-black bg-cyan-600 shadow-[0_0_15px_rgba(8,145,178,0.4)]"
                            onClick={nextStep}
                        >
                            {step === 2 ? "Vai al riepilogo" : "Avanti"}
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}

/* =======================
   COMPONENTI DI SUPPORTO
======================= */

function DataFormSection({tables, setTables, userData, setUserData, compact = false, selectEvent}: DataFormSectionProps) {

    return (
        <section className={`bg-zinc-900/30 border border-zinc-800 relative shadow-lg ${compact ? "p-5" : "p-8"}`}>
            <div className="absolute top-0 right-0 p-2">
                <div className="w-2 h-2 bg-cyan-500 animate-pulse shadow-[0_0_8px_cyan]" />
            </div>

            <Text fw={900} size="xs" mb="xl" className="uppercase tracking-[0.4em] text-cyan-500 font-mono">
                / Step 03 / Dati cliente
            </Text>

            <Stack gap="lg">
                <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="lg">
                    <NumberInput
                        label={
                            selectEvent.title === 'FestivalBar' || selectEvent.title === 'Live Band Aperitivo'?<Text size="xs" fw={700} c="zinc.5" mb={4}>Numero persone</Text>: <Text size="xs" fw={700} c="zinc.5" mb={4}>Numero tavoli</Text>
                        }
                        value={tables}
                        onChange={(v) => setTables(typeof v === "number" ? v : Number(v))}
                        radius="0"
                        variant="filled"
                        min={1}
                        styles={{ input: { backgroundColor: "#000", border: "1px solid #333", color: "#06b6d4" } }}
                    />

                    <TextInput
                        label={
                            <Text size="xs" fw={700} c="zinc.5" mb={4}>
                                Nome cliente
                            </Text>
                        }
                        placeholder="Inserisci il nome"
                        value={userData.name}
                        onChange={(e) => setUserData({ ...userData, name: e.currentTarget.value })}
                        radius="0"
                        variant="filled"
                        styles={{ input: { backgroundColor: "#000", border: "1px solid #333" } }}
                    />
                </SimpleGrid>

                <TextInput
                    label={
                        <Text size="xs" fw={700} c="zinc.5" mb={4}>
                            Numero Telefono
                        </Text>
                    }
                    placeholder="3XX XXXXXXX"
                    value={userData.phone}
                    onChange={(e) => setUserData({ ...userData, phone: e.currentTarget.value })}
                    radius="0"
                    variant="filled"
                    styles={{ input: { backgroundColor: "#000", border: "1px solid #333" } }}
                />

                <Textarea
                    label={
                        <Text size="xs" fw={700} c="zinc.5" mb={4}>
                            Note
                        </Text>
                    }
                    placeholder="Aggiungi eventuali note…"
                    value={userData.notes}
                    onChange={(e) => setUserData({ ...userData, notes: e.currentTarget.value })}
                    radius="0"
                    variant="filled"
                    autosize
                    minRows={2}
                    styles={{ input: { backgroundColor: "#000", border: "1px solid #333" } }}
                />
            </Stack>
        </section>
    );
}

function SummaryRow({ label, value, isHighlight = false }: SummaryRowProps) {
    return (
        <Group justify="space-between" className="border-b border-zinc-800 pb-2">
            <Text size="10px" fw={900} c="zinc.6" className="uppercase tracking-widest">
                {label}
            </Text>
            <Text size="xs" fw={900} className={isHighlight ? "text-cyan-400" : "text-white"}>
                {value}
            </Text>
        </Group>
    );
}