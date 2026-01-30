import { useEffect, useMemo, useRef, useState } from "react";
import { Button, Group, Modal, Text } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { IconChevronLeft, IconChevronRight, IconDownload } from "@tabler/icons-react";
import type { GalleryGroup } from "../utility/GalleryStorage";

async function forceDownload(url: string, filename: string) {
    const res = await fetch(url);
    if (!res.ok) throw new Error("Download fallito");
    const blob = await res.blob();
    const blobUrl = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = blobUrl;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();

    URL.revokeObjectURL(blobUrl);
}

function fileNameFromUrl(url: string) {
    try {
        const clean = url.split("?")[0];
        const part = clean.substring(clean.lastIndexOf("/") + 1);
        return decodeURIComponent(part || "foto.jpg");
    } catch {
        return "foto.jpg";
    }
}

function clamp(n: number, min: number, max: number) {
    return Math.max(min, Math.min(max, n));
}

export default function GalleryGroupCard({ group }: { group: GalleryGroup }) {
    const isMobile = useMediaQuery("(max-width: 640px)");
    const scrollerRef = useRef<HTMLDivElement | null>(null);

    // indice corrente del carosello (post IG)
    const [index, setIndex] = useState(0);
    const total = group.photos.length;

    // viewer modale
    const [opened, setOpened] = useState(false);
    const [active, setActive] = useState(0);

    const activeUrl = useMemo(() => group.photos[active], [group.photos, active]);

    function openAt(i: number) {
        setActive(i);
        setOpened(true);
    }

    function scrollTo(i: number) {
        const el = scrollerRef.current;
        if (!el) return;

        const next = clamp(i, 0, total - 1);
        const child = el.children.item(next) as HTMLElement | null;
        if (!child) return;

        child.scrollIntoView({ behavior: "smooth", inline: "start", block: "nearest" });
        setIndex(next);
    }

    // Aggiorna index mentre l’utente scorre (snap)
    useEffect(() => {
        const el = scrollerRef.current;
        if (!el) return;

        let raf = 0;
        const onScroll = () => {
            cancelAnimationFrame(raf);
            raf = requestAnimationFrame(() => {
                const w = el.clientWidth || 1;
                const i = Math.round(el.scrollLeft / w);
                setIndex(clamp(i, 0, total - 1));
            });
        };

        el.addEventListener("scroll", onScroll, { passive: true });
        return () => {
            cancelAnimationFrame(raf);
            el.removeEventListener("scroll", onScroll);
        };
    }, [total]);

    if (total === 0) return null;

    return (
        <>
            {/* CARD stile post IG */}
            <div className="bg-black border-y border-white/10 sm:border sm:border-white/10 sm:rounded-2xl overflow-hidden">
                {/* header post */}
                <div className="px-4 py-3 flex items-center justify-between">
                    <div className="min-w-0">
                        <Text fw={900} className="truncate">
                            {group.title}
                        </Text>
                        <Text size="xs" c="dimmed">
                            {index + 1} / {total}
                        </Text>
                    </div>

                    <Group gap={8}>
                        <button
                            className={`px-2 py-1 rounded-full border border-white/10 ${
                                index > 0 ? "opacity-100" : "opacity-30"
                            }`}
                            onClick={() => index > 0 && scrollTo(index - 1)}
                            disabled={index <= 0}
                            aria-label="FotoPage precedente"
                        >
                            ←
                        </button>
                        <button
                            className={`px-2 py-1 rounded-full border border-white/10 ${
                                index < total - 1 ? "opacity-100" : "opacity-30"
                            }`}
                            onClick={() => index < total - 1 && scrollTo(index + 1)}
                            disabled={index >= total - 1}
                            aria-label="FotoPage successiva"
                        >
                            →
                        </button>
                    </Group>
                </div>

                {/* carosello: 1 immagine visibile per volta */}
                <div
                    ref={scrollerRef}
                    className="flex gap-0 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-3"
                    style={{
                        scrollbarWidth: "none",
                        WebkitOverflowScrolling: "touch",
                        touchAction: "auto", // ✅ permette sia pan-x che pan-y
                    }}
                >
                    {group.photos.map((url, i) => (
                        <div
                            key={url}
                            className="snap-start shrink-0 w-full rounded-none overflow-hidden bg-black"
                            onClick={() => openAt(i)} // la tua funzione per aprire modale
                            role="button"
                            tabIndex={0}
                        >
                            <div className="w-full aspect-[16/9] sm:aspect-[16/9] bg-black">
                                <img
                                    src={url}
                                    alt={`${group.title} ${i + 1}`}
                                    className=" object-cover"
                                    loading="lazy"
                                    draggable={false}                 // ✅ evita drag che rompe swipe
                                    style={{ userSelect: "none" }}     // ✅
                                />
                            </div>

                        </div>
                    ))}
                </div>

                {/* pallini stile IG */}
                <div className="px-4 py-3 flex items-center justify-center gap-2">
                    {Array.from({ length: total }).map((_, i) => (
                        <button
                            key={i}
                            onClick={() => scrollTo(i)}
                            className={[
                                "w-2 h-2 rounded-full",
                                i === index ? "bg-white" : "bg-white/25",
                            ].join(" ")}
                            aria-label={`Vai alla foto ${i + 1}`}
                        />
                    ))}
                </div>

                {/* footer (facoltativo) */}
                {isMobile ? null : (
                    <div className="px-4 pb-4">
                        <Text size="sm" c="dimmed">
                            Tocca l’immagine per aprire a schermo grande.
                        </Text>
                    </div>
                )}
            </div>

            {/* MODALE VIEWER grande + download */}
            <Modal
                opened={opened}
                onClose={() => setOpened(false)}
                centered
                withCloseButton
                size="min(1100px, 96vw)"
                radius="lg"
                overlayProps={{ blur: 6, opacity: 0.65 }}
                styles={{
                    content: { background: "#0b0b0b", border: "1px solid rgba(255,255,255,0.08)" },
                    header: { background: "#0b0b0b" },
                    title: { color: "white" },
                }}
                title={
                    <div className="min-w-0">
                        <Text fw={900} className="truncate">
                            {group.title}
                        </Text>
                        <Text size="xs" c="dimmed">
                            {active + 1} / {total}
                        </Text>
                    </div>
                }
            >
                <div className="flex flex-col gap-3">
                    <div className="w-full rounded-2xl overflow-hidden bg-black border border-white/10">
                        <img
                            src={activeUrl}
                            alt={`${group.title} ${active + 1}`}
                            className="w-full max-h-[80vh] object-contain"
                        />
                    </div>

                    <div className="flex items-center justify-between gap-2">
                        <Button
                            variant="outline"
                            color="gray"
                            radius="xl"
                            leftSection={<IconChevronLeft size={16} />}
                            disabled={active <= 0}
                            onClick={() => setActive((v) => Math.max(0, v - 1))}
                            className="flex-1"
                        >
                            Prev
                        </Button>

                        <Button
                            variant="filled"
                            color="red"
                            radius="xl"
                            leftSection={<IconDownload size={16} />}
                            onClick={async () => {
                                const name = fileNameFromUrl(activeUrl);
                                await forceDownload(activeUrl, name);
                            }}
                            className="flex-1"
                        >
                            Download
                        </Button>

                        <Button
                            variant="outline"
                            color="gray"
                            radius="xl"
                            rightSection={<IconChevronRight size={16} />}
                            disabled={active >= total - 1}
                            onClick={() => setActive((v) => Math.min(total - 1, v + 1))}
                            className="flex-1"
                        >
                            Next
                        </Button>
                    </div>
                </div>
            </Modal>
        </>
    );
}