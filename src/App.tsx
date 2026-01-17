import { useMemo, useState } from "react";
import {
    Badge,
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
    Title,
} from "@mantine/core";

type EventItem = {
    id: string;
    title: string;
    dateLabel: string;
    vibe: string;
};

type PackageItem = {
    code: "base" | "premium" | "elite";
    label: string;
    price: number;
    subtitle: string;
    highlight: string;
    perks: string[];
};

const BOOKING_TIME = "23:00";

const EVENTS: EventItem[] = [
    { id: "thu-talk", title: "Un Sorso di Parole", dateLabel: "Gio 22/01", vibe: "Talk • warm vibe" },
    { id: "fri-italiano", title: "Venerdì Italiano", dateLabel: "Ven 23/01", vibe: "Hit ITA • sing along" },
    { id: "sat-djset", title: "Saturday DJ Set", dateLabel: "Sab 24/01", vibe: "Club • dancefloor" },
];

const PACKAGES: PackageItem[] = [
    {
        code: "base",
        label: "Base",
        price: 100,
        subtitle: "Tavolo da 6",
        highlight: "ENTRY",
        perks: ["Ingresso incluso", "Tavolo riservato", "Assistenza staff"],
    },
    {
        code: "premium",
        label: "Premium",
        price: 130,
        subtitle: "Tavolo da 6",
        highlight: "BEST",
        perks: ["Zona migliore", "Corsia prioritaria", "Ingresso incluso"],
    },
    {
        code: "elite",
        label: "Elite",
        price: 160,
        subtitle: "Tavolo da 6",
        highlight: "VIP",
        perks: ["Zona top", "Accoglienza dedicata", "Ingresso incluso"],
    },
];

function euro(n: number) {
    return new Intl.NumberFormat("it-IT", { style: "currency", currency: "EUR" }).format(n);
}

function StepHeader({ n, title, subtitle }: { n: string; title: string; subtitle: string }) {
    return (
        <div className="flex items-start gap-3">
            <div className="h-9 w-9 rounded-full grid place-items-center border border-white/20 bg-black/50 shadow-[0_0_30px_rgba(34,211,238,0.28)]">
                <span className="text-sm font-black text-white">{n}</span>
            </div>
            <div>
                <div className="text-lg font-black text-white">{title}</div>
                {/* più contrasto */}
                <div className="text-sm text-zinc-200/90">{subtitle}</div>
            </div>
        </div>
    );
}

function glowByPackage(code: string) {
    if (code === "elite") return "from-fuchsia-500/35 via-purple-500/25 to-cyan-500/25";
    if (code === "premium") return "from-cyan-500/30 via-emerald-500/20 to-fuchsia-500/20";
    return "from-emerald-500/25 via-cyan-500/15 to-purple-500/15";
}

export default function App() {
    const [eventId, setEventId] = useState(EVENTS[1].id);
    const [pkg, setPkg] = useState<PackageItem["code"]>("premium");
    const [tables, setTables] = useState<number | "">(1);

    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [notes, setNotes] = useState("");

    const selectedEvent = useMemo(() => EVENTS.find((e) => e.id === eventId)!, [eventId]);
    const selectedPackage = useMemo(() => PACKAGES.find((p) => p.code === pkg)!, [pkg]);

    const tablesSafe = typeof tables === "number" ? tables : 0;
    const total = tablesSafe * selectedPackage.price;

    return (
        <div className="relative min-h-screen bg-zinc-950 text-white overflow-hidden">
            {/* Background neon */}
            <div className="pointer-events-none absolute inset-0">
                <div className="absolute -top-56 left-1/2 h-[680px] w-[680px] -translate-x-1/2 rounded-full bg-fuchsia-600/35 blur-[120px]" />
                <div className="absolute top-24 -left-52 h-[640px] w-[640px] rounded-full bg-cyan-500/25 blur-[120px]" />
                <div className="absolute -bottom-64 right-[-180px] h-[760px] w-[760px] rounded-full bg-emerald-500/20 blur-[140px]" />
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.10),transparent_55%)]" />
            </div>

            <header className="relative mx-auto max-w-6xl px-4 pt-8 sm:pt-10 pb-6 sm:pb-8">
                <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs text-zinc-100 backdrop-blur">
                    <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_18px_rgba(52,211,153,0.85)]" />
                    Night booking • tavoli da 6 • ingresso dalle <span className="font-semibold text-white">{BOOKING_TIME}</span>
                </div>

                <Title
                    order={1}
                    className="mt-4 text-4xl sm:text-5xl md:text-6xl font-black tracking-tight"
                    style={{
                        background: "linear-gradient(90deg, #22c55e 0%, #06b6d4 30%, #d946ef 70%, #f59e0b 100%)",
                        WebkitBackgroundClip: "text",
                        color: "transparent",
                    }}
                >
                    Sorso • Prenota il tuo tavolo
                </Title>

                <Text className="mt-3 text-zinc-100/90 max-w-2xl">
                    Seleziona l’evento, il pacchetto e il numero di tavoli.
                    <span className="text-white font-semibold"> Orario tavoli fisso dalle {BOOKING_TIME}</span>.
                </Text>

                <div className="mt-4 flex flex-wrap gap-2">
                    <Badge variant="outline" className="border-white/20 text-zinc-100">
                        Base {euro(100)}
                    </Badge>
                    <Badge variant="outline" className="border-white/20 text-zinc-100">
                        Premium {euro(130)}
                    </Badge>
                    <Badge variant="outline" className="border-white/20 text-zinc-100">
                        Elite {euro(160)}
                    </Badge>
                </div>
            </header>

            <main className="relative mx-auto max-w-6xl px-4 pb-28 md:pb-16">
                <SimpleGrid cols={{ base: 1, md: 2 }} spacing="lg">
                    {/* LEFT */}
                    <Card radius="xl" padding="lg" className="bg-white/5 border border-white/15 backdrop-blur">
                        <Stack gap="lg">
                            {/* 1 EVENTO */}
                            <StepHeader
                                n="1"
                                title="Evento"
                                subtitle={`Seleziona l’evento della settimana (ingresso ${BOOKING_TIME}).`}
                            />

                            <div className="mt-1 grid grid-cols-1 sm:grid-cols-3 gap-3">
                                {EVENTS.map((e) => {
                                    const active = e.id === eventId;
                                    return (
                                        <button
                                            key={e.id}
                                            type="button"
                                            onClick={() => setEventId(e.id)}
                                            className={
                                                "relative overflow-hidden rounded-2xl border p-4 text-left transition min-h-[96px] " +
                                                (active
                                                    ? "border-cyan-400/70 bg-white/10 shadow-[0_0_0_1px_rgba(34,211,238,0.30),0_0_50px_rgba(217,70,239,0.18)]"
                                                    : "border-white/15 bg-white/5 hover:bg-white/10 hover:border-white/25")
                                            }
                                        >
                                            <div className="flex items-start justify-between gap-2">
                                                <div>
                                                    <div className="text-xs text-zinc-200/90">
                                                        {e.dateLabel} • {BOOKING_TIME}
                                                    </div>
                                                    <div className="mt-1 text-sm font-extrabold text-white">{e.title}</div>
                                                    <div className="mt-1 text-[11px] text-zinc-200/80">{e.vibe}</div>
                                                </div>
                                                {active ? (
                                                    <Badge variant="gradient" gradient={{ from: "cyan", to: "grape" }}>
                                                        SELECTED
                                                    </Badge>
                                                ) : (
                                                    <Badge variant="outline" className="border-white/15 text-zinc-200/80">
                                                        —
                                                    </Badge>
                                                )}
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>

                            <Divider className="border-white/15" />

                            {/* 2 PACCHETTO */}
                            <StepHeader n="2" title="Pacchetto" subtitle="Prezzo fisso per tavolo (6 persone)." />

                            <div className="mt-1 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                                {PACKAGES.map((p) => {
                                    const active = p.code === pkg;

                                    return (
                                        <button
                                            key={p.code}
                                            type="button"
                                            onClick={() => setPkg(p.code)}
                                            className={
                                                "relative overflow-hidden rounded-2xl border p-4 text-left transition min-h-[160px] " +
                                                (active
                                                    ? "border-emerald-300/55 bg-white/10 shadow-[0_0_0_1px_rgba(16,185,129,0.25),0_0_60px_rgba(6,182,212,0.18)]"
                                                    : "border-white/15 bg-white/5 hover:bg-white/10 hover:border-white/25")
                                            }
                                        >
                                            <div className={"pointer-events-none absolute inset-0 bg-gradient-to-br " + glowByPackage(p.code)} />

                                            <div className="relative">
                                                <div className="flex items-start justify-between gap-2">
                                                    <div>
                                                        <div className="flex items-center gap-2">
                                                            <div className="text-sm font-black tracking-wide text-white">{p.label}</div>
                                                            <span className="text-[10px] px-2 py-0.5 rounded-full border border-white/20 bg-black/30 text-zinc-100">
                                {p.highlight}
                              </span>
                                                        </div>
                                                        <div className="text-xs text-zinc-200/90 mt-1">
                                                            {p.subtitle} • ingresso {BOOKING_TIME}
                                                        </div>
                                                    </div>

                                                    <div className="text-right">
                                                        <Badge
                                                            variant={active ? "gradient" : "outline"}
                                                            gradient={{ from: "cyan", to: "grape" }}
                                                            className="whitespace-nowrap"
                                                        >
                                                            {euro(p.price)}
                                                        </Badge>
                                                        <div className="text-[11px] text-zinc-200/80 mt-1">per tavolo</div>
                                                    </div>
                                                </div>

                                                <ul className="mt-3 space-y-1 text-xs text-zinc-100/90">
                                                    {p.perks.map((perk) => (
                                                        <li key={perk} className="flex items-center gap-2">
                                                            <span className="h-1.5 w-1.5 rounded-full bg-white/70" />
                                                            {perk}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>

                            <Divider className="border-white/15" />

                            {/* 3 TAVOLI */}
                            <StepHeader n="3" title="Numero tavoli" subtitle={`Orario fisso: dalle ${BOOKING_TIME}.`} />

                            <NumberInput
                                label="Tavoli"
                                placeholder="1"
                                value={tables}
                                defaultValue={1}
                                onChange={setTables}
                                min={1}
                                clampBehavior="strict"
                                classNames={{ label: "text-zinc-100" }}
                                styles={{
                                    input: {
                                        backgroundColor: "rgba(255,255,255,0.08)",
                                        borderColor: "rgba(255,255,255,0.18)",
                                        color: "white",
                                        height: 46,
                                    },
                                }}
                                mt="sm"
                            />

                            <Divider className="border-white/15" />

                            {/* 4 CONTATTI */}
                            <StepHeader
                                n="4"
                                title="Contatti"
                                subtitle="Inserisci i tuoi dati, ti ricontattiamo per conferma."
                            />

                            <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="sm" className="mt-3">
                                <TextInput
                                    label="Nome e Cognome"
                                    placeholder="Es. Mario Rossi"
                                    value={name}
                                    onChange={(e) => setName(e.currentTarget.value)}
                                    classNames={{ label: "text-zinc-100" }}
                                    styles={{
                                        input: {
                                            backgroundColor: "rgba(255,255,255,0.08)",
                                            borderColor: "rgba(255,255,255,0.18)",
                                            color: "white",
                                            height: 46,
                                        },
                                    }}
                                />
                                <TextInput
                                    label="Telefono"
                                    placeholder="Es. 351 894 2961"
                                    value={phone}
                                    onChange={(e) => setPhone(e.currentTarget.value)}
                                    classNames={{ label: "text-zinc-100" }}
                                    styles={{
                                        input: {
                                            backgroundColor: "rgba(255,255,255,0.08)",
                                            borderColor: "rgba(255,255,255,0.18)",
                                            color: "white",
                                            height: 46,
                                        },
                                    }}
                                />
                            </SimpleGrid>

                            <Textarea
                                label="Note (opzionale)"
                                placeholder="Preferenza zona / festeggiamento / info utili…"
                                value={notes}
                                onChange={(e) => setNotes(e.currentTarget.value)}
                                minRows={3}
                                classNames={{ label: "text-zinc-100" }}
                                styles={{
                                    input: {
                                        backgroundColor: "rgba(255,255,255,0.08)",
                                        borderColor: "rgba(255,255,255,0.18)",
                                        color: "white",
                                    },
                                }}
                                mt="sm"
                            />

                            {/* CTA desktop */}
                            <Group justify="space-between" mt="md" align="center" className="hidden sm:flex">
                                <Text size="sm" className="text-zinc-200/90">
                                    Orario tavoli fisso: <span className="text-white font-semibold">{BOOKING_TIME}</span>
                                </Text>

                                <Button
                                    size="md"
                                    radius="xl"
                                    variant="gradient"
                                    gradient={{ from: "cyan", to: "grape" }}
                                    className="shadow-[0_0_40px_rgba(217,70,239,0.25)]"
                                    onClick={() => {
                                        if (!name.trim()) return alert("Inserisci nome e cognome");
                                        if (!phone.trim()) return alert("Inserisci il telefono");
                                        alert("Ok! Prossimo step: salvataggio su Supabase.");
                                    }}
                                >
                                    Richiedi prenotazione
                                </Button>
                            </Group>
                        </Stack>
                    </Card>

                    {/* RIGHT desktop */}
                    <div className="space-y-4 hidden md:block">
                        <Card radius="xl" padding="lg" className="bg-white/5 border border-white/15 backdrop-blur">
                            <Stack gap="xs">
                                <Group justify="space-between" align="flex-start">
                                    <div>
                                        <Text className="text-zinc-100/90" size="sm">
                                            Riepilogo
                                        </Text>
                                        <Text fw={900} className="text-white" size="xl">
                                            {selectedEvent.title}
                                        </Text>
                                        <Text className="text-zinc-200/90" size="sm">
                                            {selectedEvent.dateLabel} • ingresso {BOOKING_TIME}
                                        </Text>
                                    </div>
                                    <Badge variant="gradient" gradient={{ from: "emerald", to: "cyan" }} size="lg">
                                        Tavolo da 6
                                    </Badge>
                                </Group>

                                <Divider my="sm" className="border-white/15" />

                                <Group justify="space-between">
                                    <Text className="text-zinc-200/90">Pacchetto</Text>
                                    <Text fw={900} className="text-white">
                                        {selectedPackage.label}
                                    </Text>
                                </Group>
                                <Group justify="space-between">
                                    <Text className="text-zinc-200/90">Prezzo per tavolo</Text>
                                    <Text fw={800} className="text-white">
                                        {euro(selectedPackage.price)}
                                    </Text>
                                </Group>
                                <Group justify="space-between">
                                    <Text className="text-zinc-200/90">Numero tavoli</Text>
                                    <Text fw={800} className="text-white">
                                        {tablesSafe || "—"}
                                    </Text>
                                </Group>

                                <Divider my="sm" className="border-white/15" />

                                <div className="rounded-2xl border border-white/15 bg-black/25 p-4">
                                    <Group justify="space-between" align="center">
                                        <Text className="text-zinc-200/90">Totale</Text>
                                        <Text fw={900} className="text-white" size="xl">
                                            {euro(total)}
                                        </Text>
                                    </Group>
                                    <Text size="xs" className="mt-2 text-zinc-200/80">
                                        Totale = prezzo pacchetto × tavoli. Conferma finale con lo staff.
                                    </Text>
                                </div>
                            </Stack>
                        </Card>
                    </div>
                </SimpleGrid>

                <footer className="mt-10 text-center text-xs text-zinc-200/70 hidden md:block">
                    © {new Date().getFullYear()} Sorso • Prenotazioni
                </footer>
            </main>

            {/* MOBILE bottom bar */}
            <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 border-t border-white/15 bg-zinc-950/80 backdrop-blur">
                <div className="mx-auto max-w-6xl px-4 py-3">
                    <div className="flex items-center justify-between gap-3">
                        <div className="min-w-0">
                            <div className="text-xs text-zinc-200/90 truncate">
                                {selectedEvent.title} • {BOOKING_TIME}
                            </div>
                            <div className="text-sm font-extrabold text-white">
                                {euro(total)}{" "}
                                <span className="text-xs font-normal text-zinc-200/80">({tablesSafe} tav.)</span>
                            </div>
                        </div>

                        <Button
                            radius="xl"
                            variant="gradient"
                            gradient={{ from: "cyan", to: "grape" }}
                            className="shrink-0 shadow-[0_0_40px_rgba(217,70,239,0.25)]"
                            onClick={() => {
                                if (!name.trim()) return alert("Inserisci nome e cognome");
                                if (!phone.trim()) return alert("Inserisci il telefono");
                                alert("Ok! Prossimo step: salvataggio su Supabase.");
                            }}
                        >
                            Prenota
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}