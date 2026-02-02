import { Divider, Modal, Stack, Text } from "@mantine/core";
import type {SlotEventInfo, SlotMeta} from "../types/types";


export default function InfoModal({
                                      opened,
                                      onClose,
                                      slot,
                                      info,
                                  }: {
    opened: boolean;
    onClose: () => void;
    slot: SlotMeta;
    info: SlotEventInfo;
}) {
    return (
        <Modal
            opened={opened}
            onClose={onClose}
            title={<Text fw={900}>Info {slot.title}</Text>}
            radius="xl"
            size="lg"
            centered
        >
            <Stack gap="sm">
                <Text size="sm" c="dimmed">
                    Orario: <b>{slot.start} – {slot.last}</b>
                </Text>

                {slot.code !== "dopocena" ? (
                    <Text size="sm">
                        {slot.code === "cena"
                            ? "Cena: prenoti adulti + bambini + seggiolini."
                            : "Aperitivo: prenoti persone."}
                    </Text>
                ) : (
                    <Text size="sm">
                        Dopocena: può essere prenotazione libera (a persone) oppure bottiglia obbligatoria (FloorMap + zone).
                    </Text>
                )}

                <Divider my="xs" color="dark.7" />

                {info.hasEvent ? (
                    <Text size="sm" c="dimmed">
                        Evento: <b>{info.eventTitle ?? "—"}</b>
                    </Text>
                ) : (
                    <Text size="sm" c="dimmed">
                        Nessun evento per questo blocco.
                    </Text>
                )}

                <Text size="sm" c="dimmed">
                    Regola tavolo: se non prenoti anche il blocco successivo, il tavolo va liberato prima dell’inizio del prossimo blocco.
                </Text>
            </Stack>
        </Modal>
    );
}