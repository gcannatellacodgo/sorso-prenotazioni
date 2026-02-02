import { useEffect, useMemo, useState } from "react";
import { Badge, Group, Text } from "@mantine/core";
import { SLOTS } from "../constants/constants.ts";
import type { SlotCode, SlotInfoMap, SlotSelection } from "../types/types.ts";
import { countSelected, normalizeToDate, toISODate, fmtDateIT } from "../utility/utility.tsx";

import StepSlots from "../components/StepSlots";
import StepSummary from "../components/StepSummary";

import InfoModal from "../components/InfoModal";
import BottomBar from "../components/BottomBar";
import WeekCalendar from "../components/WeekCalendar.tsx";

export default function ReservationPage() {
    const [step, setStep] = useState<1 | 2 | 3>(1);

    const [date, setDate] = useState<Date>(() => new Date());
    const [weekAnchor, setWeekAnchor] = useState<Date>(() => new Date());
    const isoDate = useMemo(() => toISODate(date), [date]);

    const [selection, setSelection] = useState<SlotSelection>({
        aperitivo: false,
        cena: false,
        dopocena: false,
    });

    // Demo (poi lo colleghiamo a Supabase)
    const [slotInfo, setSlotInfo] = useState<SlotInfoMap>({
        aperitivo: { hasEvent: false },
        cena: { hasEvent: false },
        dopocena: { hasEvent: true, eventTitle: "Evento Test", requiresBottle: false, posterUrl: null },
    });

    const selectedCount = useMemo(() => countSelected(selection), [selection]);

    // modal info
    const [infoOpen, setInfoOpen] = useState(false);
    const [infoSlot, setInfoSlot] = useState<SlotCode>("aperitivo");

    const infoSlotMeta = useMemo(() => SLOTS.find((s) => s.code === infoSlot)!, [infoSlot]);

    function toggleSlot(code: SlotCode) {
        setSelection((prev) => ({ ...prev, [code]: !prev[code] }));
    }

    function openInfo(code: SlotCode) {
        setInfoSlot(code);
        setInfoOpen(true);
    }

    // reset selezioni & reload eventi quando cambia data
    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setSelection({ aperitivo: false, cena: false, dopocena: false });

        // TODO: fetch eventi per isoDate
        setSlotInfo({
            aperitivo: { hasEvent: false },
            cena: { hasEvent: false },
            dopocena: { hasEvent: true, eventTitle: "Evento Test", requiresBottle: false, posterUrl: null },
        });
    }, [isoDate]);

    const canProceed =
        (step === 1 && !!date) ||
        (step === 2 && selectedCount > 0) ||
        (step === 3 && true);

    return (
        <div className="min-h-screen bg-black text-white">
            {/* glow */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-cyan-500/10 blur-[90px]" />
                <div className="absolute -bottom-28 -right-24 h-72 w-72 rounded-full bg-purple-500/10 blur-[90px]" />
            </div>

            {/* header */}
            <div className="sticky top-0 z-50 border-b border-white/10 bg-black/80 backdrop-blur">
                <div className="mx-auto max-w-lg px-4 py-4">
                    <Group justify="space-between" align="center" wrap="nowrap">
                        <div className="min-w-0">
                            <Text fw={900} className="text-lg tracking-tight truncate">
                                Prenota un tavolo
                            </Text>
                            <Text size="xs" c="dimmed" className="truncate">
                                {fmtDateIT(date)} • {isoDate}
                            </Text>
                        </div>

                        <Badge variant="light" color="gray" radius="xl">
                            Step {step}/3
                        </Badge>
                    </Group>
                </div>
            </div>

            <main className="relative z-10 mx-auto max-w-lg px-4 pb-32 pt-6">
                {step === 1 ? (
                    <div className="space-y-4">
                        <WeekCalendar
                            value={date}
                            weekAnchor={weekAnchor}
                            onWeekAnchorChange={setWeekAnchor}
                            onChange={(d) => {
                                const nd = normalizeToDate(d, date);
                                setDate(nd);
                                setWeekAnchor(nd);
                            }}
                        />

                        {/* qui sotto puoi lasciare l’info eventi come prima (mini recap) */}
                        <div className="rounded-3xl border border-white/10 bg-black/30 p-4">
                            <Text fw={900} className="text-base tracking-tight mb-2">
                                Eventi del giorno
                            </Text>

                            <div className="space-y-2">
                                {SLOTS.map((s) => {
                                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                                    // @ts-expect-error
                                    const info = slotInfo[s.code];
                                    return (
                                        <div
                                            key={s.code}
                                            className="flex items-center justify-between rounded-2xl border border-white/10 bg-black/20 px-3 py-2"
                                        >
                                            <div className="min-w-0">
                                                <Text fw={800} className="truncate">
                                                    {s.label}
                                                </Text>
                                                <Text size="xs" c="dimmed" className="truncate">
                                                    {s.timeLabel}
                                                </Text>
                                            </div>

                                            {info?.hasEvent ? (
                                                <Badge color={info.requiresBottle ? "red" : "cyan"} variant="light" radius="xl">
                                                    {info.requiresBottle ? "Evento • Bottiglia" : "Evento"}
                                                </Badge>
                                            ) : (
                                                <Badge color="gray" variant="light" radius="xl">
                                                    Nessun evento
                                                </Badge>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                ) : null}

                {step === 2 ? (
                    <StepSlots
                        slots={SLOTS}
                        selection={selection}
                        onToggle={toggleSlot}
                        slotInfo={slotInfo}
                        onOpenInfo={openInfo}
                    />
                ) : null}

                {step === 3 ? (
                    <StepSummary
                        date={date}
                        slots={SLOTS}
                        selection={selection}
                        slotInfo={slotInfo}
                    />
                ) : null}
            </main>

            <InfoModal
                opened={infoOpen}
                onClose={() => setInfoOpen(false)}
                slot={infoSlotMeta}
                info={slotInfo[infoSlot]}
            />

            <BottomBar
                step={step}
                selectedCount={selectedCount}
                canProceed={canProceed}
                onBack={() => setStep((s) => (s === 1 ? 1 : ((s - 1) as 1 | 2 | 3)))}
                onNext={() => {
                    if (step === 1) setStep(2);
                    else if (step === 2) setStep(3);
                }}
            />
        </div>
    );
}