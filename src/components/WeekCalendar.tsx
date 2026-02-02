// src/pages/reservation/components/WeekCalendar.tsx
import { useMemo } from "react";
import { ActionIcon, Group, Text } from "@mantine/core";
import { IconChevronLeft, IconChevronRight } from "@tabler/icons-react";

type Props = {
    value: Date;               // giorno selezionato
    onChange: (d: Date) => void;
    weekAnchor: Date;          // una data dentro la settimana mostrata
    onWeekAnchorChange: (d: Date) => void;
};

function startOfWeekMonday(d: Date) {
    const x = new Date(d);
    x.setHours(0, 0, 0, 0);
    const day = x.getDay(); // 0=dom,1=lun...
    const diff = (day === 0 ? -6 : 1) - day; // porta a lunedì
    x.setDate(x.getDate() + diff);
    return x;
}

function addDays(d: Date, n: number) {
    const x = new Date(d);
    x.setDate(x.getDate() + n);
    return x;
}

function sameDay(a: Date, b: Date) {
    return (
        a.getFullYear() === b.getFullYear() &&
        a.getMonth() === b.getMonth() &&
        a.getDate() === b.getDate()
    );
}

const DOW = ["LUN", "MAR", "MER", "GIO", "VEN", "SAB", "DOM"];

export default function WeekCalendar({ value, onChange, weekAnchor, onWeekAnchorChange }: Props) {
    const weekStart = useMemo(() => startOfWeekMonday(weekAnchor), [weekAnchor]);

    const days = useMemo(() => {
        return Array.from({ length: 7 }).map((_, i) => addDays(weekStart, i));
    }, [weekStart]);

    const headerLabel = useMemo(() => {
        // es: "Gennaio 2026" oppure "Gennaio / Febbraio 2026"
        const a = days[0];
        const b = days[6];
        const m1 = a.toLocaleDateString("it-IT", { month: "long" });
        const m2 = b.toLocaleDateString("it-IT", { month: "long" });
        const y = b.getFullYear();

        const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
        if (a.getMonth() === b.getMonth()) return `${cap(m1)} ${y}`;
        return `${cap(m1)} / ${cap(m2)} ${y}`;
    }, [days]);

    return (
        <div className="rounded-3xl border border-white/10 bg-black/30 p-4">
            {/* header */}
            <Group justify="space-between" align="center" mb="sm">
                <div>
                    <Text fw={900} className="text-lg tracking-tight">
                        1) Scegli la data
                    </Text>
                    <Text size="sm" c="dimmed">
                        Calendario settimanale (Lun–Dom)
                    </Text>
                </div>

                <Group gap={8}>
                    <ActionIcon
                        variant="light"
                        color="gray"
                        radius="xl"
                        onClick={() => onWeekAnchorChange(addDays(weekAnchor, -7))}
                        aria-label="Settimana precedente"
                    >
                        <IconChevronLeft size={18} />
                    </ActionIcon>

                    <ActionIcon
                        variant="light"
                        color="gray"
                        radius="xl"
                        onClick={() => onWeekAnchorChange(addDays(weekAnchor, 7))}
                        aria-label="Settimana successiva"
                    >
                        <IconChevronRight size={18} />
                    </ActionIcon>
                </Group>
            </Group>

            <Text fw={800} className="mb-3" c="gray.2">
                {headerLabel}
            </Text>

            {/* grid 7 giorni */}
            <div className="grid grid-cols-7 gap-2">
                {days.map((d, i) => {
                    const selected = sameDay(d, value);
                    const isToday = sameDay(d, new Date());

                    return (
                        <button
                            key={d.toISOString()}
                            onClick={() => onChange(d)}
                            className={[
                                "rounded-2xl border px-2 py-3 text-center transition active:scale-[0.99]",
                                selected
                                    ? "border-red-500/40 bg-red-500/15"
                                    : "border-white/10 bg-black/20 hover:border-white/20",
                            ].join(" ")}
                        >
                            <div className="text-[11px] tracking-widest text-white/60">{DOW[i]}</div>

                            <div className="mt-1 flex items-center justify-center gap-1">
                <span className={selected ? "text-white font-black text-lg" : "text-white font-extrabold text-lg"}>
                  {String(d.getDate()).padStart(2, "0")}
                </span>
                            </div>

                            <div className="mt-1 text-[11px] text-white/50">
                                {isToday ? <span className="text-cyan-300 font-semibold">oggi</span> : "\u00A0"}
                            </div>
                        </button>
                    );
                })}
            </div>

            {/* selezione attuale */}
            <div className="mt-4 rounded-2xl border border-white/10 bg-black/20 p-3">
                <Text size="sm" c="dimmed">
                    Giorno selezionato
                </Text>
                <Text fw={900} className="text-base">
                    {value.toLocaleDateString("it-IT", {
                        weekday: "long",
                        day: "2-digit",
                        month: "long",
                        year: "numeric",
                    })}
                </Text>
            </div>
        </div>
    );
}