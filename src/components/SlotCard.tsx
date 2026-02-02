import { ActionIcon, Badge, Button, Card, Group, Text, Title } from "@mantine/core";
import { IconInfoCircle } from "@tabler/icons-react";
import type {SlotEventInfo, SlotMeta} from "../types/types.ts";


export default function SlotCard({
                                     slot,
                                     selected,
                                     onToggle,
                                     info,
                                     leaveRule,
                                     onOpenInfo,
                                 }: {
    slot: SlotMeta;
    selected: boolean;
    onToggle: () => void;
    info: SlotEventInfo;
    leaveRule: string | null;
    onOpenInfo: () => void;
}) {
    const border = selected ? "border-white/25" : "border-white/10";
    const bg = selected ? "bg-white/10" : "bg-black/30";

    return (
        <Card radius="xl" p="lg" className={`${bg} ${border} border `}>
            <Group justify="space-between" align="flex-start" wrap="nowrap">
                <div className="min-w-0">
                    <div>
                    <Group gap={10} wrap="nowrap">
                        <Title order={4} className="truncate">
                            {slot.title}
                        </Title>
                        <Badge color={slot.color} variant="light">
                            {slot.start} – {slot.last}
                        </Badge>
                    </Group>

                    <Text size="sm" c="dimmed" mt={6}>
                        {slot.subtitle}
                    </Text>

                    <Group gap={8} mt={10}>
                        {info.hasEvent ? (
                            <Badge color="dark" variant="outline">
                                Evento: {info.eventTitle ?? "—"}
                            </Badge>
                        ) : (
                            <Badge color="gray" variant="outline">
                                Nessun evento
                            </Badge>
                        )}

                        {slot.code === "dopocena" ? (
                            info.hasEvent ? (
                                <Badge color={info.requiresBottle ? "red" : "green"} variant="light">
                                    {info.requiresBottle ? "Bottiglia obbligatoria" : "Prenotazione libera"}
                                </Badge>
                            ) : (
                                <Badge color="gray" variant="light">
                                    Prenotazione libera
                                </Badge>
                            )
                        ) : null}
                    </Group>
                    </div>

                </div>
                <div className="flex flex-col items-end">
                <Group gap={8} className="">
                    <ActionIcon variant="subtle" color="gray" radius="xl" onClick={onOpenInfo} aria-label="Info">
                        <IconInfoCircle size={18} />
                    </ActionIcon>

                    <Button radius="xl" variant={selected ? "filled" : "outline"} color={selected ? slot.color : "gray"} onClick={onToggle}>
                        {selected ? "Selezionato" : "Seleziona"}
                    </Button>
                </Group>
                {leaveRule ? (
                    <div className="mt-3 rounded-xl border border-yellow-500/30 bg-yellow-500/10 px-3 py-2">
                        <Text size="sm" c="yellow">
                            ⚠️ {leaveRule}
                        </Text>
                    </div>
                ) : null}
                </div>
            </Group>
        </Card>
    );
}