// src/lib/galleryStorage.ts
import { supabase } from "../api/lib/supabase.ts";

export type GalleryGroup = {
    folderName: string; // es: "Evento Test_30-01-2026"
    title: string;
    data:string;// titolo gruppo (qui uguale al folderName, come richiesto)
    photos: string[];   // public urls
};

const BUCKET = "sorso-prenotazioni";
const ROOT = "foto"; // ✅ root dove ci sono le cartelle evento

function isImage(name: string) {
    const n = name.toLowerCase();
    return n.endsWith(".jpg") || n.endsWith(".jpeg") || n.endsWith(".png") || n.endsWith(".webp");
}

function publicUrl(path: string) {
    return supabase.storage.from(BUCKET).getPublicUrl(path).data.publicUrl;
}

/**
 * Ritorna tutte le "cartelle evento" dentro: BUCKET/foto/
 * e per ciascuna carica le immagini dentro: BUCKET/foto/<cartella>/
 */
export async function loadGalleryGroups(): Promise<GalleryGroup[]> {
    // 1) Lista contenuto di "foto/"
    const { data: rootList, error: e1 } = await supabase.storage.from("sorso-prenotazioni").list("foto", {
        limit: 1000,
        offset: 0,
        sortBy: { column: "name", order: "desc" },
    });

    if (e1) throw e1;

    // In supabase list, i "folder" spesso hanno metadata = null
    const folders = (rootList ?? [])
        .filter((x) => x?.name)
        .filter((x) => x.metadata == null) // ✅ trattiamoli come cartelle
        .map((x) => x.name);

    // 2) Per ogni folder, lista le immagini dentro "foto/<folder>/"
    const groups = await Promise.all(
        folders.map(async (folderName) => {
            const folderPath = `${ROOT}/${folderName}`;

            const { data: files, error: e2 } = await supabase.storage.from(BUCKET).list(folderPath, {
                limit: 1000,
                offset: 0,
                sortBy: { column: "name", order: "asc" },
            });

            // se per qualche motivo non listabile, ritorna gruppo vuoto
            const photos =
                e2 || !files
                    ? []
                    : files
                        .map((f) => f.name)
                        .filter(Boolean)
                        .filter(isImage)
                        .map((fileName) => publicUrl(`${folderPath}/${fileName}`));

            return {
                folderName,
                title: folderName.split('_')[0], // ✅ come richiesto: titolo = nome cartella
                data: folderName.split('_')[1],
                photos,
            } satisfies GalleryGroup;
        })
    );

    // tieni solo gruppi che hanno almeno 1 foto
    return groups.filter((g) => g.photos.length > 0);
}