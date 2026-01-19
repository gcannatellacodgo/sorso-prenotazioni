// ✅ 1) PRIMA VARIABILE DEL FILE
const ADMIN_PASSWORD = "test";

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
    Modal,
    ScrollArea,
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
const PEOPLE_PER_TABLE = 6;

const EVENTS = [
    { id: "thu", title: "Uccio DP, Marco Sergente, Glayce", dateLabel: "GIO 22 GEN", poster: posterThu },
    { id: "fri", title: "Sorso Italiano - DP Olvas", dateLabel: "VEN 23 GEN", poster: posterFri },
    { id: "sat", title: "DJ Set - Christian Chiarenza & Pinays", dateLabel: "SAB 24 GEN", poster: posterSat },
];

const PACKAGES = [
    { code: "base", label: "Base", price: 100, area: "Sala / Pedana", color: "gray" },
    { code: "premium", label: "Premium", price: 130, area: "Privè Rialzato", color: "cyan" },
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

    const [step, setStep] = useState(1);
    const [eventId, setEventId] = useState("fri");
    const [pkg, setPkg] = useState<PackageCode>("premium");
    const [tables, setTables] = useState<number>(1);
    const [userData, setUserData] = useState({ name: "", phone: "", notes: "" });
    const [listinoOpen, setListinoOpen] = useState(false);

    const selectedEvent = useMemo(() => EVENTS.find(e => e.id === eventId)!, [eventId]);
    const selectedPackage = useMemo(() => PACKAGES.find(p => p.code === pkg)!, [pkg]);

    const totalPeople = tables * PEOPLE_PER_TABLE;
    const totalEuro = tables * selectedPackage.price;

    const nextStep = () => setStep(s => Math.min(s + 1, 3));
    const prevStep = () => setStep(s => Math.max(s - 1, 1));

    const handleWhatsApp = () => {
        const text = `Prenotazione ${selectedEvent.title}
Nome: ${userData.name}
Telefono: ${userData.phone}
Zona: ${selectedPackage.area}
Tavoli: ${tables} (max ${totalPeople} persone)
Totale: ${euro(totalEuro)}
Note: ${userData.notes || "-"}`;

        window.open(`https://wa.me/393518942961?text=${encodeURIComponent(text)}`, "_blank");
    };

    return (
        <div className="min-h-screen bg-[#050505] text-zinc-100 pb-40 lg:pb-16">
            {/* ===== MODALE LISTINO ===== */}
            <Modal
                opened={listinoOpen}
                onClose={() => setListinoOpen(false)}
                title={<Text fw={900} size="xl" className="tracking-wider">LISTINO SORSO</Text>}
                centered
                size="lg"
                overlayProps={{ backgroundOpacity: 0.6, blur: 8 }}
                styles={{
                    content: { backgroundColor: "#0a0a0a", border: "1px solid #222" },
                }}
            >
                <ScrollArea.Autosize mah="75vh">
                    <Stack gap="xl">
                        {PACKAGES.map(p => (
                            <div key={p.code}>
                                <Group justify="space-between">
                                    <Text fw={900}>{p.label}</Text>
                                    <Badge color={p.color}>{euro(p.price)}</Badge>
                                </Group>
                                {BOTTLE_LIST[p.code].map(b => (
                                    <Text key={b} size="sm">• {b}</Text>
                                ))}
                                <Divider my="md" />
                            </div>
                        ))}
                    </Stack>
                </ScrollArea.Autosize>
            </Modal>

            {/* ===== NAVBAR ===== */}
            <nav className="sticky top-0 z-50 bg-black/80 backdrop-blur-xl border-b border-white/5 px-4 py-3">
                <div className="mx-auto max-w-7xl flex justify-between items-center">
                    <img src={logoSorso} className="h-8 md:h-10" />

                    <Button
                        radius="xl"
                        size="sm"
                        variant="gradient"
                        gradient={{ from: "cyan", to: "grape" }}
                        className="uppercase font-black tracking-wider shadow-lg shadow-cyan-500/10"
                        onClick={() => setListinoOpen(true)}
                    >
                        Listino
                    </Button>
                </div>
            </nav>

            <main className="mx-auto max-w-7xl px-4 py-8">
                {/* PROGRESS MOBILE (solo mobile) */}
                {!isDesktop && (
                    <Group grow mb="xl">
                        {[1, 2, 3].map(s => (
                            <div key={s} className={`h-1 rounded-full ${step >= s ? "bg-emerald-500" : "bg-zinc-800"}`} />
                        ))}
                    </Group>
                )}

                <SimpleGrid cols={{ base: 1, lg: 2 }} spacing={60}>
                    {/* ===== SINISTRA ===== */}
                    <Stack gap={40}>
                        {(step === 1 || isDesktop) && (
                            <section>
                                <Text fw={900} size="xs" mb="md" className="uppercase tracking-widest">01. Evento</Text>
                                <SimpleGrid cols={3} spacing="xs">
                                    {EVENTS.map(e => (
                                        <button
                                            key={e.id}
                                            onClick={() => { setEventId(e.id); if (!isDesktop) nextStep(); }}
                                            className={`relative aspect-[3/4] rounded-xl overflow-hidden border-2 transition
                        ${e.id === eventId ? "border-emerald-500 scale-[0.98]" : "border-transparent opacity-40"}`}
                                        >
                                            <img src={e.poster} className="absolute inset-0 w-full h-full object-cover" />
                                        </button>
                                    ))}
                                </SimpleGrid>
                            </section>
                        )}

                        {(step === 2 || isDesktop) && (
                            <section>
                                <Text fw={900} size="xs" mb="md" className="uppercase tracking-widest">02. Zona</Text>
                                <FloorMap pkg={pkg} onSelect={setPkg} />
                            </section>
                        )}

                        {/* MOBILE: Step 3 a sinistra (come prima) */}
                        {!isDesktop && step === 3 && (
                            <DataFormSection
                                tables={tables}
                                setTables={setTables}
                                userData={userData}
                                setUserData={setUserData}
                            />
                        )}
                    </Stack>

                    {/* ===== DESTRA ===== */}
                    {/* DESKTOP: mettiamo “I tuoi dati” sopra il riepilogo */}
                    {/* MOBILE: colonna destra compare solo allo step 3 e contiene SOLO riepilogo (come prima) */}
                    {(isDesktop || step === 3) && (
                        <Stack className={isDesktop ? "lg:sticky lg:top-28" : ""} gap="lg">
                            {isDesktop && (
                                <DataFormSection
                                    tables={tables}
                                    setTables={setTables}
                                    userData={userData}
                                    setUserData={setUserData}
                                    compact
                                />
                            )}

                            <Card radius="xl" p="lg" className="bg-white/5 border border-white/10">
                                <img src={selectedEvent.poster} className="h-40 w-full object-cover rounded-md" />
                                <Stack mt="md">
                                    <SummaryRow label="Referente" value={userData.name || "---"} />
                                    <SummaryRow label="Telefono" value={userData.phone || "---"} />
                                    <SummaryRow label="Zona" value={selectedPackage.area} isHighlight />
                                    <SummaryRow label="Tavoli" value={`${tables}`} />
                                    <SummaryRow label="Capienza" value={`${totalPeople} persone max`} />
                                    <Divider />
                                    <Group justify="space-between">
                                        <Text fw={900}>Totale</Text>
                                        <Text fw={900} size="xl" className="text-emerald-400 tabular-nums">{euro(totalEuro)}</Text>
                                    </Group>

                                    <Button
                                        size="lg"
                                        radius="xl"
                                        className="font-black uppercase"
                                        color="emerald"
                                        onClick={handleWhatsApp}
                                        disabled={!userData.name.trim() || !userData.phone.trim()}
                                    >
                                        Conferma Prenotazione
                                    </Button>

                                    {!isDesktop && (
                                        <Button
                                            variant="subtle"
                                            size="xs"
                                            onClick={prevStep}
                                            className="uppercase"
                                        >
                                            ← Indietro
                                        </Button>
                                    )}
                                </Stack>
                            </Card>
                        </Stack>
                    )}
                </SimpleGrid>
            </main>

            {/* ===== NAV MOBILE ===== */}
            {!isDesktop && step < 3 && (
                <div className="fixed bottom-0 inset-x-0 z-[100] border-t border-white/10 bg-black/95 backdrop-blur-xl px-4 py-4">
                    <div className="mx-auto max-w-md flex gap-3">
                        {step > 1 && (
                            <Button
                                radius="xl"
                                size="lg"
                                variant="outline"
                                className="uppercase font-black tracking-wider border-white/20"
                                onClick={prevStep}
                            >
                                Indietro
                            </Button>
                        )}
                        <Button
                            radius="xl"
                            size="lg"
                            className="flex-1 uppercase font-black tracking-wider"
                            color="emerald"
                            onClick={nextStep}
                        >
                            Avanti
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}

/* =======================
   COMPONENTI
======================= */
function DataFormSection({
                             tables,
                             setTables,
                             userData,
                             setUserData,
                             compact = false,
                         }: any) {
    return (
        <section className={`rounded-xl bg-zinc-900/40 border border-white/5 ${compact ? "p-5" : "p-6"}`}>
            <Text fw={900} size="xs" mb="md" className="uppercase tracking-widest">
                03. I tuoi dati
            </Text>
            <Stack gap={compact ? "sm" : "md"}>
                <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
                    <NumberInput
                        label="Tavoli"
                        value={tables}
                        min={1}
                        onChange={(v) => setTables(Number(v))}
                        radius="xl"
                        variant="filled"
                        placeholder="1"
                    />
                    <TextInput
                        label="Nome"
                        placeholder="Mario Rossi"
                        value={userData.name}
                        onChange={(e) => setUserData({ ...userData, name: e.currentTarget.value })}
                        radius="xl"
                        variant="filled"
                    />
                </SimpleGrid>

                <TextInput
                    label="WhatsApp"
                    placeholder="3XX XXXXXXX"
                    value={userData.phone}
                    onChange={(e) => setUserData({ ...userData, phone: e.currentTarget.value })}
                    radius="xl"
                    variant="filled"
                />

                <Textarea
                    label="Note"
                    placeholder="Dettagli..."
                    value={userData.notes}
                    onChange={(e) => setUserData({ ...userData, notes: e.currentTarget.value })}
                    radius="xl"
                    variant="filled"
                    autosize
                    minRows={compact ? 2 : 3}
                />
            </Stack>
        </section>
    );
}

function SummaryRow({ label, value, isHighlight = false }: { label: string; value: string; isHighlight?: boolean }) {
    return (
        <Group justify="space-between">
            <Text size="xs" c="zinc.5" className="uppercase tracking-wider">{label}</Text>
            <Text size="xs" fw={800} className={isHighlight ? "text-cyan-400" : "text-zinc-300"}>
                {value}
            </Text>
        </Group>
    );
}