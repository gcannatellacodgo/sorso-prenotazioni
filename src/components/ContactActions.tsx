import { Text } from "@mantine/core";
import {
    IconClock,
    IconPhone,
    IconMail,
    IconMapPin,
} from "@tabler/icons-react";

const linkClass =
    "text-white underline underline-offset-4 hover:opacity-80";

export function ContactActions() {
    return (
        <div className="space-y-1">
            {/* VIA / MAPPA */}
            <div className="flex items-center gap-1 text-white">
                <IconMapPin size={14} />
                <a
                    href="https://www.google.com/maps/search/?api=1&query=Via+caduti+sul+lavoro+71+Barcellona+Pozzo+di+Gotto"
                    target="_blank"
                    rel="noopener noreferrer"
                    className={linkClass + " text-xs"}
                >
                    Via Caduti sul lavoro 71 · Barcellona P.G. (ME)
                </a>
            </div>

            {/* ORARI */}
            <div className="flex items-center gap-1 text-white">
                <IconClock size={14} />
                <span className="text-xs">
          Dal martedì alla domenica · 18:00 → 02:00
        </span>
            </div>

            {/* TELEFONO */}
            <div className="flex items-center gap-1 text-white">
                <IconPhone size={14} />

                <a href="tel:+390909217364" className={linkClass + " text-xs"}>
                    090 921 7364
                </a>

                <Text size="xs" className="text-white">
                    ·
                </Text>

                <a href="tel:+393773705251" className={linkClass + " text-xs"}>
                    377 370 5251
                </a>
            </div>

            {/* EMAIL */}
            <div className="flex items-center gap-1 text-white">
                <IconMail size={14} />
                <a
                    href="mailto:sorsolab@gmail.com"
                    className={linkClass + " text-xs"}
                >
                    sorsolab@gmail.com
                </a>
            </div>
        </div>
    );
}