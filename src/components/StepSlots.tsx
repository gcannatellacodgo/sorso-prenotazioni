import { Card, Stack, Text } from "@mantine/core";
import SlotCard from "../components/SlotCard";

import type {
    SlotCode,
    SlotInfoMap,
    SlotMeta,
    SlotSelection,
} from "../types/types";
import { leaveByText } from "../utility/utility.tsx";

export default function StepSlots({
                                      slots,
                                      selection,
                                      onToggle,
                                      slotInfo,
                                      onOpenInfo,
                                  }: {
    slots: SlotMeta[];
    selection: SlotSelection;
    onToggle: (code: SlotCode) => void;
    slotInfo: SlotInfoMap;
    onOpenInfo: (code: SlotCode) => void;
}) {
    return (
        <Stack className={"flex"} gap="lg">
            {/* Header */}
            <Card
                radius="xl"
                p={{ base: "md", sm: "lg" }}
                className="bg-black/40 border border-white/10 backdrop-blur"
            >
                <Stack gap={6}>
                    <Text fw={900} size="sm" tt="uppercase" c="dimmed">
                        Step 2
                    </Text>

                    <Text fw={800} size="lg">
                        Seleziona i blocchi
                    </Text>

                    <Text size="sm" c="dimmed">
                        Puoi prenotare uno o più slot (es. Cena + Dopocena)
                    </Text>
                </Stack>
            </Card>

            {/* Slots list */}
            <Stack>
                {slots.map((s) => (
                    <SlotCard
                        key={s.code}
                        slot={s}
                        selected={selection[s.code]}
                        onToggle={() => onToggle(s.code)}
                        info={slotInfo[s.code]}
                        leaveRule={leaveByText(selection, s.code)}
                        onOpenInfo={() => onOpenInfo(s.code)}
                    />
                ))}
            </Stack>
        </Stack>
    );
}
