import { Card, Text } from "@mantine/core";

export type PackageCode = "base" | "premium" | "elite";

type FloorMapProps = {
    pkg: PackageCode;
    onSelect: (p: PackageCode) => void;
};

export default function FloorMap({ pkg, onSelect }: FloorMapProps) {
    const zoneClass = (code: PackageCode) => {
        const active = pkg === code;

        const common = "transition-all duration-300 cursor-pointer";
        const inactive = "opacity-25 hover:opacity-50";
        const activeCls = "opacity-100 drop-shadow-[0_0_22px_rgba(255,255,255,0.45)]";

        const color =
            code === "premium"
                ? "fill-emerald-500/25 stroke-emerald-400"
                : code === "base"
                    ? "fill-red-500/25 stroke-red-400"
                    : "fill-yellow-400/28 stroke-yellow-300";

        return `${common} ${color} ${active ? activeCls : inactive}`;
    };

    // === Perimetro locale (trapezio con lato destro inclinato)
    const OUTER = "M 2 150 L 0 832 L 725 832 L 618 152 Z";

    // === Zone (fedeli al PNG)
    const Z_PREMIUM =
        "M 187 212 L 187 361 L 278 361 L 278 322 L 409 323 L 433 351 L 433 396 L 596 397 L 568 258 L 476 257 L 477 213 Z";

    const Z_BASE =
        "M 604 502 L 433 493 L 431 612 L 283 613 L 281 764 L 420 763 L 433 692 L 529 594 L 613 543 Z";

    const Z_ELITE = "M 615 548 L 532 600 L 436 700 L 423 779 L 653 778 Z";

    return (
        <Card radius="xl" padding="lg" className="bg-white/5 border border-white/15">
            <Text fw={900} className="text-white">
                Pianta locale • Zone tavoli
            </Text>
            <Text size="sm" className="text-zinc-200/90">
                Verde = Premium • Rosso = Base • Giallo = Elite
            </Text>

            <div className="mt-4 rounded-2xl border border-white/15 bg-black/30 p-3">
                <svg viewBox="0 0 726 833" className="w-full h-auto">
                    <defs>
                        <clipPath id="clip-locale">
                            <path d={OUTER} />
                        </clipPath>

                        {/* glow soft club */}
                        <filter id="softGlow" x="-30%" y="-30%" width="160%" height="160%">
                            <feGaussianBlur stdDeviation="3" result="blur" />
                            <feMerge>
                                <feMergeNode in="blur" />
                                <feMergeNode in="SourceGraphic" />
                            </feMerge>
                        </filter>

                        {/* grid leggerissima (effetto planimetria) */}
                        <pattern id="grid" width="28" height="28" patternUnits="userSpaceOnUse">
                            <path d="M 28 0 L 0 0 0 28" className="stroke-white/5" strokeWidth="1" fill="none" />
                        </pattern>
                    </defs>

                    {/* Fondo locale */}
                    <path d={OUTER} className="fill-white/3" />
                    <path d={OUTER} fill="url(#grid)" opacity="0.45" />

                    {/* Contorno */}
                    <path d={OUTER} className="fill-none stroke-white/18" strokeWidth="3" />

                    {/* ====== DETTAGLI LOCALE (semplificati) ====== */}
                    {/* Blocco servizi a sinistra (WC / cucina / retro) */}
                    <g clipPath="url(#clip-locale)">
                        <path
                            d="M 70 380 L 70 820 L 255 820 L 255 420 L 210 420 L 210 380 Z"
                            className="fill-white/6 stroke-white/10"
                            strokeWidth="2"
                            strokeLinejoin="round"
                        />
                        <text x="158" y="470" textAnchor="middle" className="fill-zinc-200/55 text-[16px] font-bold">
                            SERVIZI
                        </text>

                        {/* piccoli blocchi interni (WC/cucina) */}
                        <rect x="92" y="510" width="70" height="60" rx="10" className="fill-white/5 stroke-white/10" />
                        <rect x="170" y="510" width="70" height="60" rx="10" className="fill-white/5 stroke-white/10" />
                        <rect x="92" y="580" width="148" height="90" rx="12" className="fill-white/5 stroke-white/10" />
                        <text x="166" y="635" textAnchor="middle" className="fill-zinc-200/45 text-[12px] font-semibold">
                            WC / CUCINA
                        </text>

                        {/* Androne / volume centrale (quello tratteggiato nel pdf) */}
                        <path
                            d="M 205 355 L 205 575 L 405 575 L 405 430 L 325 430 L 325 355 Z"
                            className="fill-white/4 stroke-white/10"
                            strokeWidth="2"
                            strokeLinejoin="round"
                        />
                        <text x="305" y="490" textAnchor="middle" className="fill-zinc-200/45 text-[14px] font-bold">
                            ANDRONE
                        </text>

                        {/* Banco (rettangolo lungo verticale come nel pdf) */}
                        <path
                            d="M 412 330 L 470 330 L 470 620 L 412 620 Z"
                            className="fill-white/7 stroke-white/12"
                            strokeWidth="2"
                        />
                        <text
                            x="441"
                            y="480"
                            textAnchor="middle"
                            className="fill-zinc-200/55 text-[14px] font-bold"
                            transform="rotate(-90 441 480)"
                        >
                            BANCO
                        </text>

                        {/* Postazione DJ in alto a destra */}
                        <rect x="520" y="195" width="165" height="55" rx="12" className="fill-white/7 stroke-white/12" />
                        <text x="602" y="230" textAnchor="middle" className="fill-zinc-200/55 text-[14px] font-bold">
                            POSTAZIONE DJ
                        </text>

                        {/* ingressi simbolici (archi) */}
                        <path
                            d="M 300 820 C 315 795, 355 795, 370 820"
                            className="fill-none stroke-white/18"
                            strokeWidth="3"
                            strokeLinecap="round"
                        />
                        <text x="335" y="805" textAnchor="middle" className="fill-zinc-200/45 text-[12px] font-semibold">
                            INGRESSO
                        </text>

                        <path
                            d="M 170 150 C 190 170, 230 170, 250 150"
                            className="fill-none stroke-white/18"
                            strokeWidth="3"
                            strokeLinecap="round"
                        />
                    </g>

                    {/* ====== ZONE COLORATE (clippate) ====== */}
                    <g clipPath="url(#clip-locale)" filter="url(#softGlow)">
                        {/* Premium */}
                        <path
                            d={Z_PREMIUM}
                            className={zoneClass("premium")}
                            strokeWidth="3"
                            strokeLinejoin="round"
                            onClick={() => onSelect("premium")}
                        />

                        {/* Base */}
                        <path
                            d={Z_BASE}
                            className={zoneClass("base")}
                            strokeWidth="3"
                            strokeLinejoin="round"
                            onClick={() => onSelect("base")}
                        />

                        {/* Elite */}
                        <path
                            d={Z_ELITE}
                            className={zoneClass("elite")}
                            strokeWidth="3"
                            strokeLinejoin="round"
                            onClick={() => onSelect("elite")}
                        />
                    </g>

                    {/* Etichetta zona selezionata (pulita, una sola) */}
                    {pkg === "premium" && (
                        <text x="395" y="315" textAnchor="middle" className="fill-white text-[22px] font-black tracking-wide">
                            PREMIUM
                        </text>
                    )}
                    {pkg === "base" && (
                        <text x="410" y="675" textAnchor="middle" className="fill-white text-[22px] font-black tracking-wide">
                            BASE
                        </text>
                    )}
                    {pkg === "elite" && (
                        <text x="555" y="740" textAnchor="middle" className="fill-white text-[22px] font-black tracking-wide">
                            ELITE
                        </text>
                    )}
                </svg>
            </div>

            <Text size="xs" className="mt-3 text-zinc-200/70">
                Dettagli aggiunti: banco, servizi, androne, DJ, ingressi (stilizzati).
            </Text>
        </Card>
    );
}