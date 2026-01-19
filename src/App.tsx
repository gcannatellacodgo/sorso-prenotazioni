// ✅ 1) PRIMA VARIABILE DEL FILE

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
import FloorMap from "./components/FloorMap.tsx";

// Asset Logo e Locandine
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

const BOTTLE_LIST = {
    base: ["Bulldog 1L", "Bombay 1L", "Tanqueray 1L", "Stolichnaya 1L", "Ferrari Maximum 0,75L"],
    premium: ["Gin Mare 0,75L", "Hendricks 0,75L", "Grey Goose 0,7L", "Belvedere 0,7L", "Moët Brut Impérial", "Ferrari Perlé"],
    elite: ["Portofino 0,75L", "Portofino Peninsula 0,75L", "Elit Vodka 0,75L", "Moët Ice 0,75L", "Gleego 0,75L"],
};

const euro = (n: number) => new Intl.NumberFormat("it-IT", { style: "currency", currency: "EUR" }).format(n);

export default function App() {
    const [step, setStep] = useState(1);
    const [eventId, setEventId] = useState("fri");
    const [pkg, setPkg] = useState<PackageCode>("premium");
    const [tables, setTables] = useState<number>(1);
    const [userData, setUserData] = useState({ name: "", phone: "", notes: "" });
    const [listinoOpen, setListinoOpen] = useState(false);

    const selectedEvent = useMemo(() => EVENTS.find(e => e.id === eventId)!, [eventId]);
    const selectedPackage = useMemo(() => PACKAGES.find(p => p.code === pkg)!, [pkg]);

    const totalPeople = (tables || 0) * PEOPLE_PER_TABLE;
    const totalEuro = (tables || 0) * selectedPackage.price;

    const nextStep = () => setStep((s) => Math.min(s + 1, 3));
    const prevStep = () => setStep((s) => Math.max(s - 1, 1));

    const handleWhatsApp = () => {
        const text = `Prenotazione ${selectedEvent.title}: ${userData.name}, ${selectedPackage.area}, ${tables} tavoli.`;
        window.open(`https://wa.me/393330000000?text=${encodeURIComponent(text)}`, '_blank');
    };

    return (
        <div className="min-h-screen bg-[#050505] text-zinc-100 font-sans pb-40 lg:pb-16 selection:bg-emerald-500/30">

            {/* MODALE LISTINO (Aggiunta nuovamente qui) */}
            <Modal
                opened={listinoOpen}
                onClose={() => setListinoOpen(false)}
                title={<Text fw={900} size="xl" className="italic tracking-tighter text-white">LISTINO SORSO</Text>}
                centered size="lg" radius="24px"
                overlayProps={{ backgroundOpacity: 0.6, blur: 10 }}
                styles={{ content: { backgroundColor: '#0a0a0a', border: '1px solid #222' } }}
            >
                <ScrollArea.Autosize mah="75vh" type="never">
                    <Stack gap="xl" p="md">
                        {PACKAGES.map(p => (
                            <div key={p.code}>
                                <Group justify="space-between" mb="xs">
                                    <Text fw={900} className="uppercase tracking-widest text-white">{p.label}</Text>
                                    <Badge color={p.color} variant="light">{euro(p.price)}</Badge>
                                </Group>
                                <div className="space-y-1">
                                    {BOTTLE_LIST[p.code as PackageCode].map(b => (
                                        <Text key={b} size="sm" c="zinc.5">• {b}</Text>
                                    ))}
                                </div>
                                <Divider mt="xl" color="zinc.9" />
                            </div>
                        ))}
                    </Stack>
                </ScrollArea.Autosize>
            </Modal>

            {/* NAVBAR */}
            <nav className="sticky top-0 z-50 border-b border-white/5 bg-black/80 backdrop-blur-xl px-4 py-3">
                <div className="mx-auto max-w-7xl flex items-center justify-between">
                    <img src={logoSorso} alt="Sorso Club" className="h-8 md:h-10" />
                    <Button variant="subtle" color="zinc" size="compact-xs" className="uppercase" onClick={() => setListinoOpen(true)}>
                        Listino
                    </Button>
                </div>
            </nav>

            <main className="mx-auto max-w-7xl px-4 py-8">
                {/* PROGRESS MOBILE */}
                <Group grow gap="xs" mb="xl" className="lg:hidden">
                    {[1, 2, 3].map((s) => (
                        <div key={s} className={`h-1 rounded-full transition-all duration-500 ${step >= s ? 'bg-emerald-500' : 'bg-zinc-800'}`} />
                    ))}
                </Group>

                <SimpleGrid cols={{ base: 1, lg: 2 }} spacing={60}>
                    {/* COLONNA SINISTRA */}
                    <Stack gap={40}>
                        <section className={step === 1 || window.innerWidth >= 1024 ? 'block' : 'hidden'}>
                            <Text fw={900} size="xs" c="zinc.7" className="uppercase tracking-widest mb-5">01. Scegli l'Evento</Text>
                            <SimpleGrid cols={3} spacing="xs">
                                {EVENTS.map(e => (
                                    <button
                                        key={e.id}
                                        onClick={() => { setEventId(e.id); if(window.innerWidth < 1024) nextStep(); }}
                                        className={`group relative aspect-[3/4] rounded-xl overflow-hidden border-2 transition-all ${e.id === eventId ? 'border-emerald-500 scale-[0.98]' : 'border-transparent opacity-40'}`}
                                    >
                                        <img src={e.poster} className="absolute inset-0 w-full h-full object-cover" />
                                    </button>
                                ))}
                            </SimpleGrid>
                        </section>

                        <section className={step === 2 || window.innerWidth >= 1024 ? 'block' : 'hidden'}>
                            <Text fw={900} size="xs" c="zinc.7" className="uppercase tracking-widest mb-5">02. Posizione & Pacchetto</Text>
                            <FloorMap pkg={pkg} onSelect={setPkg} />
                        </section>

                        <section className={step === 3 || window.innerWidth >= 1024 ? 'block' : 'hidden'}>
                            <DataFormSection tables={tables} setTables={setTables} userData={userData} setUserData={setUserData} />
                        </section>
                    </Stack>

                    {/* COLONNA DESTRA (RIEPILOGO SOLO STEP 3 SU MOBILE) */}
                    <Stack className={`${step === 3 ? 'flex' : 'hidden'} lg:flex lg:sticky lg:top-28`}>
                        <Card radius="40px" p={0} className="bg-white/[0.03] border border-white/10 overflow-hidden shadow-2xl">
                            <img src={selectedEvent.poster} className="h-44 w-full object-cover" />
                            <Stack p={32} gap="lg">
                                <div className="space-y-3">
                                    <SummaryRow label="Referente" value={userData.name || "---"} />
                                    <SummaryRow label="Zona" value={selectedPackage.area} isHighlight />
                                    <SummaryRow label="Capienza" value={`${totalPeople} Persone Max`} />
                                </div>
                                <Divider className="border-white/5" />
                                <Group justify="space-between">
                                    <Text fw={900} size="xl" c="zinc.6" className="uppercase">Totale</Text>
                                    <Text fw={900} size="32px" className="text-emerald-400 tabular-nums">{euro(totalEuro)}</Text>
                                </Group>
                                <Button fullWidth size="xl" radius="xl" color="blue" onClick={handleWhatsApp} className="h-16 font-black uppercase">
                                    Conferma Prenotazione
                                </Button>
                                <Button variant="subtle" color="gray" size="xs" onClick={prevStep} className="lg:hidden uppercase">
                                    ← Modifica Dati
                                </Button>
                            </Stack>
                        </Card>
                    </Stack>
                </SimpleGrid>
            </main>

            {/* NAVIGAZIONE MOBILE (Scompare allo step 3) */}
            {step < 3 && (
                <div className="lg:hidden fixed bottom-0 left-0 right-0 p-4 bg-black/95 border-t border-white/10 z-[100]">
                    <div className="max-w-md mx-auto flex gap-3">
                        {step > 1 && (
                            <Button variant="outline" color="gray" radius="xl" size="lg" className="uppercase" onClick={prevStep}>
                                Indietro
                            </Button>
                        )}
                        <Button color="emerald" radius="xl" size="lg" className="flex-1 font-black uppercase" onClick={nextStep}>
                            {step === 2 ? "Vai al Riepilogo" : "Avanti"}
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}


// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
function DataFormSection({ tables, setTables, userData, setUserData }) {
    return (
        <section className="p-6 rounded-[32px] bg-zinc-900/40 border border-white/5">
            <Text fw={900} size="xs" c="zinc.7" className="uppercase tracking-widest mb-6">03. I Tuoi Dati</Text>
            <Stack gap="md">
                <SimpleGrid cols={2} spacing="md">
                    <NumberInput label="Tavoli" value={tables} onChange={(v) => setTables(Number(v))} min={1} radius="xl" variant="filled" />
                    <TextInput label="Nome" placeholder="Mario Rossi" value={userData.name} onChange={(e) => setUserData({...userData, name: e.currentTarget.value})} radius="xl" variant="filled" />
                </SimpleGrid>
                <TextInput label="WhatsApp" placeholder="3XX XXXXXXX" value={userData.phone} onChange={(e) => setUserData({...userData, phone: e.currentTarget.value})} radius="xl" variant="filled" />
                <Textarea label="Note" placeholder="Dettagli..." value={userData.notes} onChange={(e) => setUserData({...userData, notes: e.currentTarget.value})} radius="xl" variant="filled" />
            </Stack>
        </section>
    );
}

function SummaryRow({ label, value, isHighlight = false }: { label: string, value: string, isHighlight?: boolean }) {
    return (
        <Group justify="space-between">
            <Text size="xs" fw={800} c="zinc.6" className="uppercase">{label}</Text>
            <Text size="xs" fw={800} className={isHighlight ? 'text-cyan-400' : 'text-zinc-300'}>{value}</Text>
        </Group>
    );
}