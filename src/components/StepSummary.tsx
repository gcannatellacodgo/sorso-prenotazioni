import { Badge, Card, Divider, Group, Stack, Text } from "@mantine/core";
import { leaveByText, fmtDateIT } from "../utility/utility.tsx";
import type { SlotInfoMap, SlotMeta, SlotSelection } from "../types/types.ts";

export default function StepSummary({
                                        date,
                                        slots,
                                        selection,
                                        slotInfo,
                                    }: {
    date: Date;
    slots: SlotMeta[];
    selection: SlotSelection;
    slotInfo: SlotInfoMap;
}) {
    const selectedSlots = slots.filter((s) => selection[s.code]);

    return (
        <Stack gap="md">
            <Card radius="xl" p="lg" className="bg-black/30 border border-white/10">
                <Text fw={900} className="text-base">
                    3) Dati e riepilogo
                </Text>
                <Text size="sm" c="dimmed" mt={6}>
                    Qui mettiamo: Nome, Cognome, Telefono (una volta) + campi blocchi selezionati.
                </Text>
            </Card>

            <Card radius="xl" p="lg" className="bg-black/20 border border-white/10">
                <Text fw={900}>Riepilogo</Text>
                <Text size="sm" c="dimmed" mt={6}>
                    Data: <b>{fmtDateIT(date)}</b>
                </Text>

                <Divider my="md" color="dark.7" />

                <Stack gap={10}>
                    {selectedSlots.map((s) => {
                        const leaveRule = leaveByText(selection, s.code);
                        const info = slotInfo[s.code];

                        return (
                            <div key={s.code} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                                <Group justify="space-between" align="flex-start">
                                    <div className="min-w-0">
                                        <Text fw={800} className="truncate">
                                            {s.title}
                                        </Text>
                                        <Text size="xs" c="dimmed">
                                            {s.start} – {s.last}
                                        </Text>

                                        {info.hasEvent ? (
                                            <Text size="xs" c="dimmed" mt={6}>
                                                Evento: <b>{info.eventTitle ?? "—"}</b>
                                            </Text>
                                        ) : null}

                                        {leaveRule ? (
                                            <Text size="xs" c="yellow" mt={8}>
                                                ⚠️ {leaveRule}
                                            </Text>
                                        ) : null}
                                    </div>

                                    <Badge color={s.color} variant="light">
                                        Selezionato
                                    </Badge>
                                </Group>
                            </div>
                        );
                    })}

                    {selectedSlots.length === 0 ? <Text c="dimmed">Nessun blocco selezionato.</Text> : null}
                </Stack>
            </Card>
        </Stack>
    );
}