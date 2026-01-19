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
    Title,

} from "@mantine/core";
import FloorMap from "./components/FloorMap.tsx";

// Importazione del logo dagli assets
import logoSorso from "./assets/logo.svg";

/* ============================================================
   COMPONENTI UI ACCESSORI
============================================================ */
const LogoHeader = () => (
    <div className="flex items-center gap-4">

        <div className="flex flex-col leading-none">
            <span className="text-2xl font-black tracking-tighter text-white uppercase italic">Sorso</span>
            <span className="text-[10px] font-bold tracking-[0.3em] text-emerald-500 uppercase ml-0.5">Club • Experience</span>
        </div>
    </div>
);

/* =======================
   TYPES & DATA
======================= */
export type PackageCode = "base" | "premium" | "elite";
const BOOKING_TIME = "23:00";


const EVENTS = [
    { id: "thu", title: "Un Sorso di Parole", dateLabel: "GIO 22 GEN", vibe: "Talk & Wine" },
    { id: "fri", title: "Venerdì Italiano", dateLabel: "VEN 23 GEN", vibe: "Greatest Hits" },
    { id: "sat", title: "Saturday Night", dateLabel: "SAB 24 GEN", vibe: "DJ Set Club" },
];

const PACKAGES = [
    { code: "base", label: "Base", price: 100, perks: ["Tavolo riservato", "1 Bottiglia standard"] },
    { code: "premium", label: "Premium", price: 130, perks: ["Zona Privè (Braccialetto)", "1 Bottiglia Premium"] },
    { code: "elite", label: "Élite", price: 160, perks: ["Top Privè (Braccialetto)", "1 Bottiglia Élite"] },
];

/* =======================
   HELPERS
======================= */
const euro = (n: number) => new Intl.NumberFormat("it-IT", { style: "currency", currency: "EUR" }).format(n);

/* =======================
   MAIN APP
======================= */
export default function App() {
    const [eventId, setEventId] = useState("fri");
    const [pkg, setPkg] = useState<PackageCode>("premium");
    const [tables, setTables] = useState<number>(1);


    const selectedPackage = useMemo(() => PACKAGES.find(p => p.code === pkg)!, [pkg]);
    const total = tables * selectedPackage.price;

    return (
        <div className="min-h-screen bg-[#080808] text-zinc-100 selection:bg-emerald-500/30 font-sans">

            {/* NAVBAR CRISTALLINA */}
            <nav className="sticky top-0 z-50 border-b border-white/5 bg-black/40 backdrop-blur-2xl">
                <div className="mx-auto max-w-7xl px-4 py-4 flex items-center justify-between">
                    <LogoHeader />
                    <Button
                        variant="subtle"
                        color="gray"
                        size="xs"
                        radius="xl"

                        className="hover:bg-white/5 transition-colors border border-white/10"
                    >
                        Staff Login
                    </Button>
                </div>
            </nav>

            <main className="mx-auto max-w-7xl px-4 py-12 md:py-20">

                {/* HERO SECTION CON LOGO GRANDE */}
                <div className="mb-20 flex flex-col items-center md:items-start text-center md:text-left">
                    <img
                        src={logoSorso}
                        alt=""
                        className="w-24 h-24 mb-8 opacity-20 filter grayscale brightness-200 md:hidden"
                    />
                    <Badge variant="outline" color="emerald" radius="sm" mb="md" className="tracking-widest px-4 py-3 border-emerald-500/30">
                        OFFICIAL BOOKING SYSTEM
                    </Badge>
                    <Title order={1} className="text-5xl md:text-8xl font-black tracking-tighter text-white leading-[0.85] mb-8">
                        PRENOTA IL TUO <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-cyan-400 to-emerald-500">TAVOLO EXCLUSIVE</span>
                    </Title>
                    <Text size="xl" className="text-zinc-500 max-w-2xl font-medium leading-relaxed">
                        Scegli la tua serata e assicurati il miglior posto nel club. <br className="hidden md:block" />
                        L'ingresso ai tavoli è garantito fino alle ore <b>{BOOKING_TIME}</b>.
                    </Text>
                </div>

                <SimpleGrid cols={{ base: 1, lg: 2 }} spacing={80}>

                    {/* COLONNA SELEZIONE */}
                    <Stack gap={60}>

                        {/* 01. EVENTO */}
                        <section>
                            <Text fw={900} size="xs" className="uppercase tracking-[0.4em] text-zinc-600 mb-8 flex items-center gap-4">
                                01. Evento <div className="h-px flex-1 bg-white/5" />
                            </Text>
                            <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="md">
                                {EVENTS.map(e => (
                                    <button
                                        key={e.id}
                                        onClick={() => setEventId(e.id)}
                                        className={`group text-left p-6 rounded-2xl border transition-all duration-500 ${e.id === eventId ? 'bg-white/10 border-emerald-500 shadow-[0_0_40px_rgba(16,185,129,0.15)]' : 'bg-zinc-900/30 border-white/5 hover:border-white/20'}`}
                                    >
                                        <Text size="xs" fw={800} className={e.id === eventId ? 'text-emerald-400' : 'text-zinc-500 group-hover:text-zinc-300'}>{e.dateLabel}</Text>
                                        <Text fw={900} size="lg" mt={4} className="text-white leading-tight">{e.title}</Text>
                                    </button>
                                ))}
                            </SimpleGrid>
                        </section>

                        {/* 02. PACCHETTO */}
                        <section>
                            <Group mb={24} justify="space-between" align="flex-end">
                                <Text fw={900} size="xs" className="uppercase tracking-[0.4em] text-zinc-600 flex items-center gap-4 flex-1">
                                    02. Zona <div className="h-px flex-1 bg-white/5" />
                                </Text>
                                <Button variant="subtle" color="emerald" size="xs" >Listino Prezzi</Button>
                            </Group>
                            <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="md">
                                {PACKAGES.map(p => (
                                    <button
                                        key={p.code}
                                        onClick={() => setPkg(p.code as PackageCode)}
                                        className={`text-left p-6 rounded-2xl border transition-all duration-500 ${p.code === pkg ? 'bg-white/10 border-cyan-500 shadow-[0_0_40px_rgba(6,182,212,0.15)]' : 'bg-zinc-900/30 border-white/5 hover:border-white/20'}`}
                                    >
                                        <Text fw={900} size="xl" className="text-white">{p.label}</Text>
                                        <Text size="sm" fw={800} className="text-cyan-400 mt-1">{euro(p.price)}</Text>
                                        <div className="mt-8 space-y-2">
                                            {p.perks.map(perk => (
                                                <Text key={perk} size="xs" className="text-zinc-500 font-medium tracking-tight flex items-center gap-2">
                                                    <div className="w-1 h-1 rounded-full bg-zinc-700" /> {perk}
                                                </Text>
                                            ))}
                                        </div>
                                    </button>
                                ))}
                            </SimpleGrid>
                        </section>

                        {/* 03. FORM DATI */}
                        <section className="p-10 rounded-[40px] bg-zinc-900/40 border border-white/5 backdrop-blur-sm relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 blur-[80px] -z-10" />
                            <Text fw={900} size="xs" className="uppercase tracking-[0.4em] text-zinc-600 mb-10">03. Dati Personali</Text>
                            <Stack gap="xl">
                                <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="xl">
                                    <NumberInput label="Numero Tavoli" value={tables} onChange={v => setTables(Number(v))} min={1} max={10} radius="xl" size="md" variant="filled" className="custom-input" />
                                    <TextInput label="Nome Completo" placeholder="Mario Rossi" radius="xl" size="md" variant="filled" className="custom-input" />
                                </SimpleGrid>
                                <TextInput label="Recapito Telefonico" placeholder="+39 3XX XXXXXXX" radius="xl" size="md" variant="filled" className="custom-input" />
                                <Textarea label="Note Aggiuntive" placeholder="Preferenze o richieste particolari..." radius="xl" size="md" variant="filled" autosize minRows={3} className="custom-input" />
                            </Stack>
                        </section>

                    </Stack>

                    {/* COLONNA MAPPA & CHECKOUT */}
                    <Stack gap="xl" className="lg:sticky lg:top-32 h-fit">
                        <img
                            src={logoSorso}
                            alt="Sorso Logo"
                            className="w-56 h-12 object-contain drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]"
                        />
                        <div className="p-3 rounded-[40px] bg-white/5 border border-white/10 shadow-2xl overflow-hidden group">
                            <FloorMap pkg={pkg} onSelect={setPkg} />
                        </div>

                        <Card radius="40px" p={48} className="bg-white/[0.03] border border-white/10 shadow-2xl backdrop-blur-3xl relative overflow-hidden">
                            {/* Glow decorativo */}
                            <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-cyan-500/10 blur-[100px]" />

                            <Title order={3} className="text-white italic tracking-tighter mb-10 text-3xl">Checkout</Title>

                            {pkg !== "base" && (
                                <div className="mb-10 p-5 rounded-2xl bg-emerald-500/5 border border-emerald-500/20 flex gap-5 items-start">
                                    <div className="bg-emerald-500/20 p-2 rounded-lg text-emerald-400">✨</div>
                                    <div>
                                        <Text fw={900} size="sm" className="text-emerald-400 uppercase tracking-widest">Accesso Privè</Text>
                                        <Text size="xs" className="text-emerald-200/60 leading-relaxed mt-1">
                                            L'area selezionata è a numero chiuso. Riceverete i braccialetti identificativi direttamente al tavolo.
                                        </Text>
                                    </div>
                                </div>
                            )}

                            <Stack gap="lg">
                                <Group justify="space-between">
                                    <Text size="sm" className="text-zinc-500 font-bold uppercase tracking-[0.2em]">Zona Selezionata</Text>
                                    <Badge size="lg" radius="sm" variant="dot" color={pkg === 'elite' ? 'yellow' : 'emerald'} className="italic font-black text-white">
                                        {selectedPackage.label}
                                    </Badge>
                                </Group>
                                <Group justify="space-between">
                                    <Text size="sm" className="text-zinc-500 font-bold uppercase tracking-[0.2em]">Tavoli</Text>
                                    <Text fw={900} className="text-white text-xl tabular-nums">{tables}</Text>
                                </Group>
                                <Divider my="lg" className="border-white/5" />
                                <Group justify="space-between" align="center">
                                    <Text size="xs" className="text-zinc-500 font-bold uppercase tracking-[0.4em]">Totale</Text>
                                    <Text size="42px" fw={900} className="text-white tabular-nums tracking-tighter leading-none">
                                        {euro(total)}
                                    </Text>
                                </Group>
                            </Stack>

                            <Button
                                fullWidth
                                size="xl"
                                radius="xl"
                                mt={48}
                                className="h-20 bg-white text-black hover:bg-zinc-200 transition-all duration-300 font-black uppercase tracking-[0.2em] text-sm shadow-[0_25px_50px_rgba(255,255,255,0.1)] active:scale-[0.97]"
                            >
                                Invia Richiesta
                            </Button>
                            <Text ta="center" size="xs" className="text-zinc-600 mt-8 font-medium">
                                Verrai ricontattato via WhatsApp o chiamata per la conferma.
                            </Text>
                        </Card>
                    </Stack>

                </SimpleGrid>
            </main>
        </div>
    );
}