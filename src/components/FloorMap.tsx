import { Card, Text, Group, Badge } from "@mantine/core";

export type PackageCode = "base" | "premium" | "elite";

type FloorMapProps = {
    pkg: PackageCode;
    onSelect: (p: PackageCode) => void;
};

export default function FloorMap({ pkg, onSelect }: FloorMapProps) {
    // === CONTORNO EDIFICIO ===
    const OUTER = "M0.832031 1035.83V0.833008H924.999L1090 1035.83H0.832031Z";

    // === ZONE INTERATTIVE (PACCHETTI) ===
    // Premium pulita (senza DJ e Banco)
    const Z_PREMIUM = "M294.167 47.499H239.167V289.166H390V224.999H607.5L650.833 276.666V349.999H915.833L875 128.332L715.833 120.832V47.499H408.333M294.167 47.499H408.333M294.167 47.499C299.167 63.3324 317.5 95.3324 350.833 96.6657C384.167 97.999 403.056 64.4435 408.333 47.499";

    const Z_BASE = "M399.167 962.5V714.166H648.333L651.667 513.333H875.833L932.5 529.166L945.833 595L807.5 679.166L648.333 842.5L625.833 962.5H399.167Z";

    const Z_ELITE = "M1014.17 985.833H631.667L656.667 856.666L820.833 687.5L952.5 608.333L1014.17 985.833Z";

    // === ZONE TECNICHE ESTRATTE (FISSE) ===
    const Z_BANCO = "M507.5 652.499V701.666H636.667V276.666L614.167 244.999H501.667V289.166H593.333V652.499H507.5Z";
    const Z_DJ = "M725.833 47.499V109.166H885V47.499H725.833Z";
    const Z_INGRESSO_SUD = "M212.5 1001.67H317.5C317.5 979.999 313.833 935.999 265.833 936.666C217.833 937.332 212.5 980.277 212.5 1001.67Z";
    const Z_VARCO_EST = "M945 374.166L965.833 490.832C931.667 494.166 861.833 488.999 855.833 441.666C849.833 394.332 912.778 376.943 945 374.166Z";

    // === DETTAGLI STRUTTURALI (NEUTRI) ===
    const D_SERVIZI = "M50 892.5V755.833H145H219.167L222.5 892.5H50Z";
    const D_ANDRONE = "M53.3333 749.166V587.5H385.833V749.166H219.167H53.3333Z";
    const D_BOX_TOP = "M472.832 319.333H54.332V559.833H472.832V319.333Z";

    const getZoneClass = (code: PackageCode) => {
        const active = pkg === code;
        const color = code === "premium"
            ? "fill-emerald-500/30 stroke-emerald-400"
            : code === "base"
                ? "fill-red-500/30 stroke-red-400"
                : "fill-yellow-400/30 stroke-yellow-300";

        return `transition-all duration-300 cursor-pointer ${color} ${active ? "opacity-100 scale-[1.01]" : "opacity-20 hover:opacity-45"}`;
    };

    const labelPos = {
        premium: { text: "PREMIUM", x: 680, y: 190 },
        base: { text: "BASE", x: 640, y: 770 },
        elite: { text: "ÉLITE", x: 860, y: 860 }
    }[pkg];

    return (
        <Card radius="xl" p="lg" className="bg-zinc-900 border border-white/10 shadow-2xl overflow-hidden">
            <Group justify="space-between" mb="lg">
                <div>
                    <Text fw={900} size="xl" className="text-white tracking-tighter uppercase italic">
                        Planimetria Tavoli
                    </Text>
                    <Text size="xs" className="text-zinc-500">
                        Seleziona una zona colorata per scegliere il pacchetto
                    </Text>
                </div>

                <Group gap={8}>
                    <Badge color="red" variant={pkg === "base" ? "filled" : "outline"}>Base</Badge>
                    <Badge color="green" variant={pkg === "premium" ? "filled" : "outline"}>Premium</Badge>
                    <Badge color="yellow" variant={pkg === "elite" ? "filled" : "outline"}>Elite</Badge>
                </Group>
            </Group>

            <div className="relative rounded-2xl bg-black/40 border border-white/5 p-4 overflow-hidden">
                <svg viewBox="0 0 1091 1037" className="w-full h-auto select-none">
                    <defs>
                        <filter id="softGlow" x="-20%" y="-20%" width="140%" height="140%">
                            <feGaussianBlur stdDeviation="5" result="blur" />
                            <feMerge>
                                <feMergeNode in="blur" />
                                <feMergeNode in="SourceGraphic" />
                            </feMerge>
                        </filter>
                    </defs>

                    {/* Fondo Struttura */}
                    <path d={OUTER} className="fill-white/5 stroke-white/10" strokeWidth="2" />

                    {/* === ZONE TECNICHE (Grigie, fisse) === */}
                    <g className="fill-zinc-800/80 stroke-zinc-600" strokeWidth="2">
                        <path d={Z_BANCO} />
                        <path d={Z_DJ} />
                        <path d={Z_INGRESSO_SUD} />
                        <path d={Z_VARCO_EST} />
                        <path d={D_ANDRONE} className="fill-zinc-900/40" />
                        <path d={D_SERVIZI} className="fill-zinc-900/40" />
                        <path d={D_BOX_TOP} className="fill-zinc-900/40" />

                        {/* Label Zone Tecniche */}
                        <text x="570" y="450" textAnchor="middle" className="fill-zinc-500 text-[14px] font-bold uppercase">Banco</text>
                        <text x="805" y="85" textAnchor="middle" className="fill-zinc-500 text-[14px] font-bold uppercase">DJ</text>
                        <text x="265" y="975" textAnchor="middle" className="fill-zinc-400 text-[12px] font-black uppercase">Ingresso</text>
                        <text x="210" y="660" textAnchor="middle" className="fill-zinc-600 text-[16px] font-bold uppercase">Androne</text>
                    </g>

                    {/* === ZONE SELEZIONABILI (Interattive) === */}
                    <g filter="url(#softGlow)">
                        <path
                            d={Z_PREMIUM}
                            className={getZoneClass("premium")}
                            strokeWidth="4"
                            onClick={() => onSelect("premium")}
                        />
                        <path
                            d={Z_BASE}
                            className={getZoneClass("base")}
                            strokeWidth="4"
                            onClick={() => onSelect("base")}
                        />
                        <path
                            d={Z_ELITE}
                            className={getZoneClass("elite")}
                            strokeWidth="4"
                            onClick={() => onSelect("elite")}
                        />
                    </g>

                    {/* Label Selezione Attiva */}
                    <text
                        x={labelPos.x}
                        y={labelPos.y}
                        textAnchor="middle"
                        className="fill-white text-[32px] font-black tracking-widest pointer-events-none transition-all duration-500"
                        style={{ textShadow: "0 0 15px rgba(0,0,0,0.9)" }}
                    >
                        {labelPos.text}
                    </text>
                </svg>
            </div>

            <Group mt="md" justify="center" gap="xl" className="opacity-50">
                <Text size="xs" className="text-emerald-400">● Premium Area</Text>
                <Text size="xs" className="text-red-400">● Base Area</Text>
                <Text size="xs" className="text-yellow-400">● Elite Area</Text>
                <Text size="xs" className="text-zinc-500">■ Service Areas</Text>
            </Group>
        </Card>
    );
}