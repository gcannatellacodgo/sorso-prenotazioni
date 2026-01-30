// src/pages/GalleryPage.tsx
import { useEffect, useState } from "react";
import { ActionIcon, Text } from "@mantine/core";
import { IconRefresh } from "@tabler/icons-react";
import GalleryGroupCard from "../components/GalleryGroupCard";
import { type GalleryGroup, loadGalleryGroups } from "../utility/GalleryStorage";

export default function FotoPage() {
    const [loading, setLoading] = useState(false);
    const [groups, setGroups] = useState<GalleryGroup[]>([]);
    const [error, setError] = useState<string | null>(null);

    async function refresh() {
        setLoading(true);
        setError(null);
        try {
            const list = await loadGalleryGroups();
            setGroups(list);
        } catch (e: any) {
            setGroups([]);
            setError(String(e?.message ?? e ?? "Errore"));
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        refresh().catch(() => {});
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className="min-h-screen overflow-y-auto bg-black text-white">
            {/* Top bar stile IG */}
            <div className="sticky top-0 z-50 border-b border-white/10 bg-black/80 backdrop-blur-md">
                <div className="mx-auto max-w-6xl px-4 h-14 flex items-center justify-between">
                    <div className="w-10" />
                    <Text fw={900} className="tracking-tight">
                        Gallery
                    </Text>

                    <ActionIcon
                        variant="subtle"
                        color="gray"
                        onClick={refresh}
                        loading={loading}
                        aria-label="Aggiorna"
                    >
                        <IconRefresh size={18} />
                    </ActionIcon>
                </div>
            </div>

            <div className="mx-auto max-w-6xl px-0 sm:px-4 py-4 sm:py-6">
                {/* Errore */}
                {error ? (
                    <div className="mx-4 sm:mx-0 border border-red-500/30 bg-red-500/10 p-4 rounded-xl mb-4">
                        <Text c="red" size="sm">
                            Errore: {error}
                        </Text>
                    </div>
                ) : null}

                {/* Lista gruppi */}
                <div className="flex flex-col gap-6">
                    {groups.map((g) => (
                        <GalleryGroupCard key={g.folderName} group={g} />
                    ))}

                    {!loading && groups.length === 0 ? (
                        <Text c="dimmed" size="sm" className="px-4 sm:px-0">
                            Nessuna cartella trovata dentro <b>foto/</b> oppure nessuna immagine dentro le cartelle.
                        </Text>
                    ) : null}
                </div>
            </div>
        </div>
    );
}