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

/** item restituito da storage.list */
type StorageListItem = {
    name: string;
    id: string | null;
};

/** opzioni list */
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
    async list(
        bucket: string,
        path = "",
        options: ListOptions = {}
    ): Promise<StorageListItem[]> {
        const {
            limit = 100,
            offset = 0,
            sortBy = { column: "name", order: "asc" },
        } = options;

        const { data, error } = await supabase.storage.from(bucket).list(path, {
            limit,
            offset,
            sortBy,
        });

        if (error) throw error;
        return (data ?? []) as StorageListItem[];
    },

    /** Lista TUTTI i file in una cartella (ricorsivo + paginazione) */
    async listAllFilesRecursive(
        bucket: string,
        rootPath = ""
    ): Promise<StorageFile[]> {
        const files: StorageFile[] = [];

        async function walk(path: string): Promise<void> {
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

                const items = data as StorageListItem[];

                for (const item of items) {
                    const fullPath = path ? `${path}/${item.name}` : item.name;

                    // id === null → cartella
                    if (item.id === null) {
                        await walk(fullPath);
                    } else {
                        files.push({ path: fullPath, name: item.name });
                    }
                }

                if (items.length < limit) break;
                offset += limit;
            }
        }

        await walk(rootPath);
        return files;
    },

    /** Public URL (bucket public) */
    getPublicUrl(bucket: string, path: string): string {
        const { data } = supabase.storage.from(bucket).getPublicUrl(path);
        return data.publicUrl;
    },

    /** Signed URL (bucket private) */
    async createSignedUrl(
        bucket: string,
        path: string,
        expiresInSeconds = 60
    ): Promise<string> {
        const { data, error } = await supabase.storage
            .from(bucket)
            .createSignedUrl(path, expiresInSeconds);

        if (error) throw error;
        return data.signedUrl;
    },

    /** Upload file */
    async upload(
        bucket: string,
        path: string,
        file: File,
        upsert = true
    ): Promise<{ path: string }> {
        const { data, error } = await supabase.storage.from(bucket).upload(path, file, {
            upsert,
            cacheControl: "3600",
            contentType: file.type || undefined,
        });

        if (error) throw error;
        return { path: data.path };
    },

    /** Remove (uno o più file) */
    async remove(bucket: string, paths: string[]): Promise<number> {
        const { data, error } = await supabase.storage.from(bucket).remove(paths);
        if (error) throw error;
        return data?.length ?? 0;
    },
};

/** =========================
 *  DB API
 *  ========================= */
export const DbApi = {
    /** Select semplice */
    async select<T = unknown>(
        table: string,
        columns = "*",
        filters?: Record<string, unknown>
    ): Promise<T[]> {
        let q = supabase.from(table).select(columns);

        if (filters) {
            for (const [k, v] of Object.entries(filters)) {
                q = q.eq(k, v);
            }
        }

        const { data, error } = await q;
        if (error) throw error;
        return data as T[];
    },

    /** Insert */
    async insert<T = unknown>(
        table: string,
        payload: unknown
    ): Promise<T[]> {
        const { data, error } = await supabase.from(table).insert(payload).select();
        if (error) throw error;
        return data as T[];
    },

    /** Update */
    async update<T = unknown>(
        table: string,
        payload: unknown,
        match: Record<string, unknown>
    ): Promise<T[]> {
        let q = supabase.from(table).update(payload);

        for (const [k, v] of Object.entries(match)) {
            q = q.eq(k, v);
        }

        const { data, error } = await q.select();
        if (error) throw error;
        return data as T[];
    },

    /** Delete */
    async remove(
        table: string,
        match: Record<string, unknown>
    ): Promise<void> {
        let q = supabase.from(table).delete();

        for (const [k, v] of Object.entries(match)) {
            q = q.eq(k, v);
        }

        const { error } = await q;
        if (error) throw error;
    },
};

/** =========================
 *  RPC API
 *  ========================= */
export const RpcApi = {
    async call<T = unknown>(
        fn: string,
        args?: Record<string, unknown>
    ): Promise<T> {
        const { data, error } = await supabase.rpc(fn, args);
        if (error) throw error;
        return data as T;
    },
};

/** =========================
 *  AUTH API
 *  ========================= */

type SupabaseSession = {
    user: {
        id?: string;
        email?: string;
    } | null;
    access_token?: string;
    refresh_token?: string;
    expires_at?: number;
};

export const AuthApi = {
    async signInWithPassword(
        email: string,
        password: string
    ): Promise<SupabaseSession> {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });
        if (error) throw error;
        return data as SupabaseSession;
    },

    async signOut(): Promise<void> {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
    },

    async getSession(): Promise<SupabaseSession | null> {
        const { data, error } = await supabase.auth.getSession();
        if (error) throw error;
        return data.session as SupabaseSession | null;
    },
};