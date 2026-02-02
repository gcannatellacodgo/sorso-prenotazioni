export type SlotCode = "aperitivo" | "cena" | "dopocena";

export type SlotMeta = {
    code: SlotCode;
    title: string;
    start: string;
    last: string;
    nextStart: string | null;
    color: "grape" | "cyan" | "emerald";
    subtitle: string;
};

export type SlotEventInfo = {
    hasEvent: boolean;
    eventTitle?: string;
    posterUrl?: string | null;
    requiresBottle?: boolean; // only dopocena
};

export type SlotSelection = Record<SlotCode, boolean>;
export type SlotInfoMap = Record<SlotCode, SlotEventInfo>;