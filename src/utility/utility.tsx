import { supabase } from "../api/lib/supabase";
import type {SlotCode, SlotSelection} from "../types/types.ts";



export function normalizeToDate(v: unknown, fallback = new Date()): Date {
    if (v instanceof Date && !Number.isNaN(v.getTime())) return v;

    if (typeof v === "string" || typeof v === "number") {
        const d = new Date(v);
        if (!Number.isNaN(d.getTime())) return d;
    }

    // gestione oggetti "date-like" che a volte arrivano da librerie
    if (v && typeof v === "object") {
        const maybe = v as any;
        const d = maybe?.toDate?.();
        if (d instanceof Date && !Number.isNaN(d.getTime())) return d;
    }

    return fallback;
}

export function toISODate(d: Date) {
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
}

export function fmtDateIT(d: Date) {
    return d.toLocaleDateString("it-IT", {
        weekday: "long",
        day: "2-digit",
        month: "long",
        year: "numeric",
    });
}

export function leaveByText(sel: SlotSelection, slot: SlotCode) {
    if (slot === "aperitivo" && sel.aperitivo && !sel.cena) return "Libera entro le 20:00 (inizio Cena).";
    if (slot === "cena" && sel.cena && !sel.dopocena) return "Libera entro le 23:15 (inizio Dopocena).";
    return null;
}

export function countSelected(sel: SlotSelection) {
    return (sel.aperitivo ? 1 : 0) + (sel.cena ? 1 : 0) + (sel.dopocena ? 1 : 0);
}

export async function isLoggedIn(): Promise<boolean> {
    const { data, error } = await supabase.auth.getSession();

    if (error) return false;
    return !!data.session;
}