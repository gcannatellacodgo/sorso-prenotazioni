import type { SlotMeta } from "./types";

export const SLOTS: SlotMeta[] = [
    {
        code: "aperitivo",
        title: "Aperitivo",
        start: "18:15",
        last: "19:00",
        nextStart: "20:00",
        color: "grape",
        subtitle: "Ultima prenotazione alle 19:00",
    },
    {
        code: "cena",
        title: "Cena",
        start: "20:00",
        last: "21:15",
        nextStart: "23:15",
        color: "cyan",
        subtitle: "Ultima prenotazione alle 21:15",
    },
    {
        code: "dopocena",
        title: "Dopocena",
        start: "23:15",
        last: "02:00",
        nextStart: null,
        color: "emerald",
        subtitle: "Ultima prenotazione alle 02:00",
    },
];