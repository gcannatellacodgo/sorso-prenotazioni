import { createClient } from "@supabase/supabase-js";

/** =========================
 *  SUPABASE CONFIG (Vite)
 *  ========================= */
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error(
        "Missing Supabase env vars. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env"
    );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
    },
});

/** =========================
 *  TYPES
 *  ========================= */
export type StorageFile = {
    path: string;
    name: string;
};

type ListOptions = {
    limit?: number;
    offset?: number;
    sortBy?: {
        column: "name" | "updated_at" | "created_at" | "last_accessed_at";
        order: "asc" | "desc";
    };
};

/** =========================
 *  STORAGE API
 *  ========================= */
export const StorageApi = {
    /** Lista solo 1 livello (NON ricorsivo) */
    async list(bucket: string, path = "", options: ListOptions = {}) {
        const { limit = 100, offset = 0, sortBy = { column: "name", order: "asc" } } =
            options;

        const { data, error } = await supabase.storage.from(bucket).list(path, {
            limit,
            offset,
            sortBy,
        });

        if (error) throw error;
        return data ?? [];
    },

    /** Lista TUTTI i file in una cartella (ricorsivo + paginazione) */
    async listAllFilesRecursive(bucket: string, rootPath = ""): Promise<StorageFile[]> {
        const files: StorageFile[] = [];

        async function walk(path: string) {
            let offset = 0;
            const limit = 100;

            while (true) {
                const { data, error } = await supabase.storage.from(bucket).list(path, {
                    limit,
                    offset,
                    sortBy: { column: "name", order: "asc" },
                });

                if (error) throw error;
                if (!data || data.length === 0) break;

                for (const item of data) {
                    const fullPath = path ? `${path}/${item.name}` : item.name;

                    // In storage.list le cartelle spesso hanno id null
                    const isFolder = (item as any).id === null;

                    if (isFolder) {
                        await walk(fullPath);
                    } else {
                        files.push({ path: fullPath, name: item.name });
                    }
                }

                if (data.length < limit) break;
                offset += limit;
            }
        }

        await walk(rootPath);
        return files;
    },

    /** Public URL (bucket public) */
    getPublicUrl(bucket: string, path: string) {
        const { data } = supabase.storage.from(bucket).getPublicUrl(path);
        return data.publicUrl;
    },

    /** Signed URL (bucket private) */
    async createSignedUrl(bucket: string, path: string, expiresInSeconds = 60) {
        const { data, error } = await supabase.storage
            .from(bucket)
            .createSignedUrl(path, expiresInSeconds);

        if (error) throw error;
        return data.signedUrl;
    },

    /** Upload file */
    async upload(bucket: string, path: string, file: File, upsert = true) {
        const { data, error } = await supabase.storage.from(bucket).upload(path, file, {
            upsert,
            cacheControl: "3600",
            contentType: file.type || undefined,
        });

        if (error) throw error;
        return data;
    },

    /** Remove (uno o più file) */
    async remove(bucket: string, paths: string[]) {
        const { data, error } = await supabase.storage.from(bucket).remove(paths);
        if (error) throw error;
        return data;
    },
};

/** =========================
 *  DB API
 *  ========================= */
export const DbApi = {
    /** Select semplice */
    async select<T = any>(table: string, columns = "*", filters?: Record<string, any>) {
        let q = supabase.from(table).select(columns);

        if (filters) {
            for (const [k, v] of Object.entries(filters)) q = q.eq(k, v);
        }

        const { data, error } = await q;
        if (error) throw error;
        return data as T[];
    },

    /** Insert */
    async insert<T = any>(table: string, payload: any) {
        const { data, error } = await supabase.from(table).insert(payload).select();
        if (error) throw error;
        return data as T[];
    },

    /** Update */
    async update<T = any>(table: string, payload: any, match: Record<string, any>) {
        let q = supabase.from(table).update(payload);
        for (const [k, v] of Object.entries(match)) q = q.eq(k, v);

        const { data, error } = await q.select();
        if (error) throw error;
        return data as T[];
    },

    /** Delete */
    async remove(table: string, match: Record<string, any>) {
        let q = supabase.from(table).delete();
        for (const [k, v] of Object.entries(match)) q = q.eq(k, v);

        const { data, error } = await q;
        if (error) throw error;
        return data;
    },
};

/** =========================
 *  RPC API
 *  ========================= */
export const RpcApi = {
    async call<T = any>(fn: string, args?: Record<string, any>) {
        const { data, error } = await supabase.rpc(fn, args);
        if (error) throw error;
        return data as T;
    },
};

/** =========================
 *  AUTH API
 *  ========================= */
export const AuthApi = {
    async signInWithPassword(email: string, password: string) {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        return data;
    },

    async signOut() {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
    },

    async getSession() {
        const { data, error } = await supabase.auth.getSession();
        if (error) throw error;
        return data.session;
    },
};