import { useMemo, useState } from "react";
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
    Title,
} from "@mantine/core";
import FloorMap from "./components/FloorMap.tsx";

/* =======================
   TYPES
======================= */
type EventItem = {
    id: string;
    title: string;
    dateLabel: string;
    vibe: string;
};

type PackageCode = "base" | "premium" | "elite";

type PackageItem = {
    code: PackageCode;
    label: string;
    price: number;
    subtitle: string;
    highlight: string;
    perks: string[];
};

/* =======================
   DATA
======================= */
const BOOKING_TIME = "23:00";

const EVENTS: EventItem[] = [
    { id: "thu", title: "Un Sorso di Parole", dateLabel: "Gio 22/01", vibe: "Talk • warm vibe" },
    { id: "fri", title: "Venerdì Italiano", dateLabel: "Ven 23/01", vibe: "Hit ITA • sing along" },
    { id: "sat", title: "Saturday DJ Set", dateLabel: "Sab 24/01", vibe: "Club • dancefloor" },
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

/* =======================
   HELPERS
======================= */
function euro(n: number) {
    return new Intl.NumberFormat("it-IT", { style: "currency", currency: "EUR" }).format(n);
}

function StepHeader({ n, title, subtitle }: { n: string; title: string; subtitle: string }) {
    return (
        <div className="flex items-start gap-3">
            <div className="h-9 w-9 rounded-full grid place-items-center border border-white/20 bg-black/55">
                <span className="text-sm font-black text-white">{n}</span>
            </div>
            <div>
                <div className="text-lg font-black text-white">{title}</div>
                <div className="text-sm text-zinc-200/90">{subtitle}</div>
            </div>
        </div>
    );
}




export default function App() {
    const [eventId, setEventId] = useState(EVENTS[1].id);
    const [pkg, setPkg] = useState<PackageCode>("premium");
    const [tables, setTables] = useState<number | "">(1);

    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [notes, setNotes] = useState("");

    const selectedEvent = useMemo(() => EVENTS.find((e) => e.id === eventId)!, [eventId]);
    const selectedPackage = useMemo(() => PACKAGES.find((p) => p.code === pkg)!, [pkg]);

    const tablesSafe = typeof tables === "number" ? tables : 0;
    const total = tablesSafe * selectedPackage.price;

    return (
        <div className="min-h-screen bg-zinc-950 text-white">
            <div className="mx-auto max-w-6xl px-4 py-8">
                <Title
                    order={1}
                    className="text-4xl sm:text-5xl font-black"
                    style={{
                        background: "linear-gradient(90deg, #22c55e 0%, #06b6d4 40%, #d946ef 70%, #f59e0b 100%)",
                        WebkitBackgroundClip: "text",
                        color: "transparent",
                    }}
                >
                    Sorso • Prenota il tuo tavolo
                </Title>

                <Text className="mt-2 text-zinc-200/90">
                    Tavoli da 6 • Ingresso dalle <b>{BOOKING_TIME}</b>
                </Text>

                <div className="mt-6">
                    <SimpleGrid cols={{ base: 1, md: 2 }} spacing="lg">
                        {/* LEFT */}
                        <Card radius="xl" padding="lg" className="bg-white/5 border border-white/15">
                            <Stack gap="lg">
                                <div>
                                    <StepHeader n="1" title="Evento" subtitle={`Seleziona l’evento (ingresso ${BOOKING_TIME}).`} />
                                    <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-3">
                                        {EVENTS.map((e) => {
                                            const active = e.id === eventId;
                                            return (
                                                <button
                                                    key={e.id}
                                                    type="button"
                                                    onClick={() => setEventId(e.id)}
                                                    className={
                                                        "rounded-2xl border p-4 text-left transition " +
                                                        (active ? "border-cyan-400/70 bg-white/10" : "border-white/15 bg-white/5 hover:bg-white/10")
                                                    }
                                                >
                                                    <div className="text-xs text-zinc-200/90">
                                                        {e.dateLabel} • {BOOKING_TIME}
                                                    </div>
                                                    <div className="mt-1 font-extrabold">{e.title}</div>
                                                    <div className="text-xs text-zinc-200/70">{e.vibe}</div>
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>

                                <Divider className="border-white/15" />

                                <div>
                                    <StepHeader n="2" title="Pacchetto" subtitle="Prezzo fisso per tavolo." />
                                    <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-3">
                                        {PACKAGES.map((p) => {
                                            const active = p.code === pkg;
                                            return (
                                                <button
                                                    key={p.code}
                                                    type="button"
                                                    onClick={() => setPkg(p.code)}
                                                    className={
                                                        "rounded-2xl border p-4 text-left transition " +
                                                        (active
                                                            ? "border-emerald-300/55 bg-white/10"
                                                            : "border-white/15 bg-white/5 hover:bg-white/10")
                                                    }
                                                >
                                                    <div className="flex items-center justify-between">
                                                        <div className="font-black">{p.label}</div>
                                                        <div className="text-xs font-extrabold">{euro(p.price)}</div>
                                                    </div>
                                                    <div className="mt-1 text-xs text-zinc-200/80">{p.subtitle} • {BOOKING_TIME}</div>
                                                    <ul className="mt-2 text-xs text-zinc-200/85 space-y-1">
                                                        {p.perks.map((perk) => (
                                                            <li key={perk}>• {perk}</li>
                                                        ))}
                                                    </ul>
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>

                                <Divider className="border-white/15" />

                                <div>
                                    <StepHeader n="3" title="Numero tavoli" subtitle={`Orario fisso dalle ${BOOKING_TIME}.`} />
                                    <NumberInput
                                        mt="sm"
                                        label="Tavoli"
                                        placeholder="1"
                                        value={tables}
                                        onChange={setTables}
                                        min={1}
                                        clampBehavior="strict"
                                    />
                                </div>

                                <Divider className="border-white/15" />

                                <div>
                                    <StepHeader n="4" title="Contatti" subtitle="Ti ricontattiamo per conferma." />
                                    <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="sm" className="mt-3">
                                        <TextInput
                                            label="Nome e Cognome"
                                            placeholder="Mario Rossi"
                                            value={name}
                                            onChange={(e) => setName(e.currentTarget.value)}
                                        />
                                        <TextInput
                                            label="Telefono"
                                            placeholder="351 000 0000"
                                            value={phone}
                                            onChange={(e) => setPhone(e.currentTarget.value)}
                                        />
                                    </SimpleGrid>

                                    <Textarea
                                        mt="sm"
                                        label="Note"
                                        placeholder="Preferenze / info utili…"
                                        value={notes}
                                        onChange={(e) => setNotes(e.currentTarget.value)}
                                    />

                                    <Group justify="space-between" mt="md">
                                        <Text size="sm" c="dimmed">
                                            Totale: <b className="text-white">{euro(total)}</b>
                                        </Text>
                                        <Button
                                            radius="xl"
                                            variant="gradient"
                                            gradient={{ from: "cyan", to: "grape" }}
                                            onClick={() => {
                                                if (!name.trim()) return alert("Inserisci nome e cognome");
                                                if (!phone.trim()) return alert("Inserisci il telefono");
                                                alert("OK! Prossimo step: salvataggio su Supabase.");
                                            }}
                                        >
                                            Prenota
                                        </Button>
                                    </Group>
                                </div>
                            </Stack>
                        </Card>

                        {/* RIGHT */}
                        <Stack>
                            <FloorMap pkg={pkg} onSelect={setPkg} />

                            <Card radius="xl" padding="lg" className="bg-white/5 border border-white/15">
                                <Text fw={900}>Riepilogo</Text>
                                <Text className="mt-1">{selectedEvent.title}</Text>
                                <Text size="sm" c="dimmed">
                                    {selectedEvent.dateLabel} • {BOOKING_TIME}
                                </Text>

                                <Divider my="sm" className="border-white/15" />

                                <Group justify="space-between">
                                    <Text size="sm" c="dimmed">Pacchetto</Text>
                                    <Text fw={800}>{selectedPackage.label}</Text>
                                </Group>

                                <Group justify="space-between" mt="xs">
                                    <Text size="sm" c="dimmed">Tavoli</Text>
                                    <Text fw={800}>{tablesSafe}</Text>
                                </Group>

                                <Group justify="space-between" mt="xs">
                                    <Text size="sm" c="dimmed">Totale</Text>
                                    <Text fw={900} size="xl">{euro(total)}</Text>
                                </Group>
                            </Card>
                        </Stack>
                    </SimpleGrid>
                </div>
            </div>
        </div>
    );
}