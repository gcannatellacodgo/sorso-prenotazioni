// ✅ 1) PRIMA VARIABILE DEL FILE


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
    Modal,
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import FloorMap from "./components/FloorMap";

// Asset
import logoSorso from "./assets/logo.svg";
import posterThu from "./assets/evento3.jpeg";
import posterFri from "./assets/evento1.jpeg";
import posterSat from "./assets/evento2.jpeg";

/* =======================
   TYPES & DATA
======================= */
export type PackageCode = "base" | "premium" | "elite";

type EventItem = {
    id: "thu" | "fri" | "sat";
    title: string;
    dateLabel: string;
    poster: string;
};

type PackageItem = {
    code: PackageCode;
    label: string;
    price: number;
    area: string;
    color: string; // mantine color name
};

type UserData = {
    name: string;
    phone: string;
    notes: string;
};

type DataFormSectionProps = {
    tables: number;
    setTables: (n: number) => void;
    userData: UserData;
    setUserData: (u: UserData) => void;
    compact?: boolean;
};

type SummaryRowProps = {
    label: string;
    value: string;
    isHighlight?: boolean;
};

const PEOPLE_PER_TABLE = 6;

const EVENTS: EventItem[] = [
    { id: "thu", title: "Uccio DP, Marco Sergente, Glayce", dateLabel: "GIO 22 GEN", poster: posterThu },
    { id: "fri", title: "Sorso Italiano - DP Olvas", dateLabel: "VEN 23 GEN", poster: posterFri },
    { id: "sat", title: "DJ Set - Christian Chiarenza & Pinays", dateLabel: "SAB 24 GEN", poster: posterSat },
];

const PACKAGES: PackageItem[] = [
    { code: "base", label: "Base", price: 100, area: "Salla / Pedana", color: "cyan" },
    { code: "premium", label: "Premium", price: 130, area: "Privè Rialzato", color: "grape" },
    { code: "elite", label: "Élite", price: 160, area: "Top Privè DJ", color: "emerald" },
];

const BOTTLE_LIST: Record<PackageCode, string[]> = {
    base: ["Bulldog 1L", "Bombay 1L", "Tanqueray 1L", "Stolichnaya 1L", "Ferrari Maximum 0,75L"],
    premium: ["Gin Mare 0,75L", "Hendricks 0,75L", "Grey Goose 0,7L", "Belvedere 0,7L", "Moët Brut Impérial", "Ferrari Perlé"],
    elite: ["Portofino 0,75L", "Portofino Peninsula 0,75L", "Elit Vodka 0,75L", "Moët Ice 0,75L", "Gleego 0,75L"],
};

const euro = (n: number) =>
    new Intl.NumberFormat("it-IT", { style: "currency", currency: "EUR" }).format(n);

/* =======================
   APP
======================= */
export default function App() {
    const isDesktop = useMediaQuery("(min-width: 1024px)");

    const [step, setStep] = useState<number>(1);
    const [eventId, setEventId] = useState<EventItem["id"]>("fri");
    const [pkg, setPkg] = useState<PackageCode>("premium");
    const [tables, setTables] = useState<number>(1);
    const [userData, setUserData] = useState<UserData>({ name: "", phone: "", notes: "" });
    const [listinoOpen, setListinoOpen] = useState<boolean>(false);

    const selectedEvent = useMemo(
        () => EVENTS.find((e) => e.id === eventId) ?? EVENTS[0],
        [eventId]
    );

    const selectedPackage = useMemo(
        () => PACKAGES.find((p) => p.code === pkg) ?? PACKAGES[0],
        [pkg]
    );

    const totalPeople = tables * PEOPLE_PER_TABLE;
    const totalEuro = tables * selectedPackage.price;

    const nextStep = () => setStep((s) => Math.min(s + 1, 3));
    const prevStep = () => setStep((s) => Math.max(s - 1, 1));

    const handleWhatsApp = () => {
        const text =
            `*Prenotazione Sorso Club*\n\n` +
            `*Evento:* ${selectedEvent.title}\n` +
            `*Nome:* ${userData.name}\n` +
            `*Zona:* ${selectedPackage.area}\n` +
            `*Tavoli:* ${tables}\n` +
            `*Totale:* ${euro(totalEuro)}`;

        window.open(`https://wa.me/393518942961?text=${encodeURIComponent(text)}`, "_blank");
    };

    return (
        <div className="min-h-screen bg-[#0a0a0a] text-white font-sans selection:bg-cyan-500/30">
            {/* EFFETTI SFONDO CYBER */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-cyan-500/10 blur-[120px] rounded-full" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/10 blur-[120px] rounded-full" />
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.03]" />
            </div>

            {/* MODALE LISTINO */}
            <Modal
                opened={listinoOpen}
                onClose={() => setListinoOpen(false)}
                title={<Text fw={900} className="tracking-tighter italic text-cyan-400">// LISTINO_PREMIUM</Text>}
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

                            {/* ✅ fix TS: p.code è PackageCode, quindi BOTTLE_LIST[p.code] è ok */}
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

            {/* NAVBAR */}
            <nav className="sticky top-0 z-50 border-b border-cyan-500/20 bg-black/80 backdrop-blur-md">
                <div className="mx-auto max-w-7xl px-6 py-4 flex justify-between items-center">
                    <Group gap="xs">
                        <img src={logoSorso} className="h-8" alt="Sorso Club" />
                        <Text fw={900} size="xl" className="tracking-tighter hidden sm:block">
                            SORSO CLUB
                        </Text>
                    </Group>

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
                                className={`h-1.5 transition-all ${
                                    step >= s ? "bg-cyan-500 shadow-[0_0_10px_#06b6d4]" : "bg-zinc-800"
                                }`}
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
                                    {EVENTS.map((e) => (
                                        <button
                                            key={e.id}
                                            onClick={() => {
                                                setEventId(e.id);
                                                if (!isDesktop) nextStep();
                                            }}
                                            className={`relative aspect-square overflow-hidden border-2 transition-all duration-500 ${
                                                e.id === eventId
                                                    ? "border-cyan-500 shadow-[0_0_20px_rgba(6,184,212,0.4)] scale-95"
                                                    : "border-zinc-800 opacity-40 hover:opacity-100"
                                            }`}
                                        >
                                            <img src={e.poster} className="absolute inset-0 w-full h-full object-cover" alt={e.title} />
                                            <div className="absolute inset-x-0 bottom-0 bg-black/80 p-2 border-t border-cyan-500/50">
                                                <Text size="9px" fw={900} className="truncate uppercase">
                                                    {e.dateLabel}
                                                </Text>
                                            </div>
                                        </button>
                                    ))}
                                </SimpleGrid>
                            </section>
                        )}

                        {(step === 2 || isDesktop) && (
                            <section>
                                <Text fw={900} size="xs" c="purple.4" mb="md" className="uppercase tracking-[0.3em] font-mono">
                                    / Step 02 / Zona
                                </Text>
                                <div className="p-1 bg-zinc-900 border border-zinc-800 shadow-2xl relative">
                                    <div className="absolute -top-1 -left-1 w-4 h-4 border-t-2 border-l-2 border-cyan-500" />
                                    <div className="absolute -bottom-1 -right-1 w-4 h-4 border-b-2 border-r-2 border-cyan-500" />
                                    <FloorMap pkg={pkg} onSelect={setPkg} />
                                </div>
                            </section>
                        )}

                        {!isDesktop && step === 3 && (
                            <DataFormSection
                                tables={tables}
                                setTables={setTables}
                                userData={userData}
                                setUserData={setUserData}
                            />
                        )}
                    </Stack>

                    {/* DESTRA (RIEPILOGO) */}
                    {(isDesktop || step === 3) && (
                        <Stack className={isDesktop ? "lg:sticky lg:top-28" : ""} gap="xl">
                            {isDesktop && (
                                <DataFormSection
                                    tables={tables}
                                    setTables={setTables}
                                    userData={userData}
                                    setUserData={setUserData}
                                    compact
                                />
                            )}

                            <Card radius="0" p={0} className="bg-zinc-900/50 border border-zinc-800 backdrop-blur-xl overflow-hidden shadow-2xl">
                                {/* EFFETTO IMMAGINE DOPPIO STRATO */}
                                <div className="relative h-48 overflow-hidden border-b border-white/5">
                                    <img
                                        src={selectedEvent.poster}
                                        className="w-full h-full object-cover blur-sm opacity-50 absolute scale-110"
                                        alt={selectedEvent.title}
                                    />
                                    <img
                                        src={selectedEvent.poster}
                                        className="w-full h-full object-contain relative z-10 p-4"
                                        alt={selectedEvent.title}
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 to-transparent z-20" />
                                </div>

                                <div className="h-1 bg-gradient-to-r from-cyan-500 via-purple-500 to-emerald-500" />

                                <Stack p={30} gap="xl">
                                    <div className="space-y-4">
                                        <SummaryRow label="Evento" value={selectedEvent.title} />
                                        <SummaryRow label="Zona" value={selectedPackage.area} isHighlight />
                                        <SummaryRow label="Referente" value={userData.name || "---"} />
                                        <SummaryRow label="Persone" value={`${totalPeople} Max`} />
                                    </div>

                                    <div className="bg-black/50 p-4 border border-zinc-800 text-center relative overflow-hidden group">
                                        <div className="absolute inset-0 bg-cyan-500/5 translate-y-full group-hover:translate-y-0 transition-transform" />
                                        <Text size="xs" c="zinc.5" className="uppercase tracking-widest mb-1 relative z-10">
                                            Totale dovuto
                                        </Text>
                                        <Text fw={900} size="42px" className="text-white tracking-tighter tabular-nums relative z-10">
                                            {euro(totalEuro)}
                                        </Text>
                                    </div>

                                    <Button
                                        size="xl"
                                        radius="0"
                                        className="h-16 font-black uppercase tracking-widest transition-all hover:shadow-[0_0_30px_rgba(6,184,212,0.4)]"
                                        color="cyan"
                                        onClick={handleWhatsApp}
                                        disabled={!userData.name.trim() || !userData.phone.trim()}
                                    >
                                        WhatsApp Confirm
                                    </Button>

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
                            <Button
                                radius="0"
                                size="lg"
                                variant="outline"
                                color="zinc"
                                onClick={prevStep}
                                className="border-2 uppercase font-black"
                            >
                                Back
                            </Button>
                        )}
                        <Button
                            radius="0"
                            size="lg"
                            className="flex-1 uppercase font-black bg-cyan-600 shadow-[0_0_15px_rgba(8,145,178,0.4)]"
                            onClick={nextStep}
                        >
                            {step === 2 ? "Review Order" : "Next Step"}
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

function DataFormSection({ tables, setTables, userData, setUserData, compact = false }: DataFormSectionProps) {
    return (
        <section className={`bg-zinc-900/30 border border-zinc-800 relative shadow-lg ${compact ? "p-5" : "p-8"}`}>
            <div className="absolute top-0 right-0 p-2">
                <div className="w-2 h-2 bg-cyan-500 animate-pulse shadow-[0_0_8px_cyan]" />
            </div>

            <Text fw={900} size="xs" mb="xl" className="uppercase tracking-[0.4em] text-cyan-500 font-mono">
                / Step 03 / Client Info
            </Text>

            <Stack gap="lg">
                <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="lg">
                    <NumberInput
                        label={<Text size="xs" fw={700} c="zinc.5" mb={4}>TABLES COUNT</Text>}
                        value={tables}
                        onChange={(v) => setTables(typeof v === "number" ? v : Number(v))}
                        radius="0"
                        variant="filled"
                        min={1}
                        styles={{ input: { backgroundColor: "#000", border: "1px solid #333", color: "#06b6d4" } }}
                    />

                    <TextInput
                        label={<Text size="xs" fw={700} c="zinc.5" mb={4}>CLIENT NAME</Text>}
                        placeholder="ENTER NAME"
                        value={userData.name}
                        onChange={(e) => setUserData({ ...userData, name: e.currentTarget.value })}
                        radius="0"
                        variant="filled"
                        styles={{ input: { backgroundColor: "#000", border: "1px solid #333" } }}
                    />
                </SimpleGrid>

                <TextInput
                    label={<Text size="xs" fw={700} c="zinc.5" mb={4}>WHATSAPP CONTACT</Text>}
                    placeholder="3XX XXXXXXX"
                    value={userData.phone}
                    onChange={(e) => setUserData({ ...userData, phone: e.currentTarget.value })}
                    radius="0"
                    variant="filled"
                    styles={{ input: { backgroundColor: "#000", border: "1px solid #333" } }}
                />

                <Textarea
                    label={<Text size="xs" fw={700} c="zinc.5" mb={4}>NOTES</Text>}
                    placeholder="EXTRA DETAILS..."
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