// src/services/supabase.service.ts

import { StorageApi, DbApi, RpcApi, AuthApi } from "./lib/supabase.ts";
import type {
    ApiResult,
    StorageFolderResult,
    StorageFileItem,
    DbSelectParams,
    DbInsertParams,
    DbUpdateParams,
    DbDeleteParams,
    RpcCallParams,
    AuthSignInParams,
    AuthSessionResult,
} from "./supabase.types";

/** =========================
 *  INTERNAL TYPES (no-any)
 *  ========================= */

// Minimal shape returned by supabase.storage.list(...)
type StorageListItem = {
    name: string;
    id: string | null; // null => folder, string => file
};

// Minimal session shape (kept generic to avoid importing supabase-js types here)
type SupabaseSession = {
    user: {
        id?: string;
        email?: string;
    } | null;
    access_token?: string;
    refresh_token?: string;
    expires_at?: number;
};

/** helper: estrai estensione */
function getExt(name: string): string {
    return name.split(".").pop()?.toLowerCase() ?? "";
}

/** helper: uniforma errori */
function toErrorMessage(e: unknown): string {
    if (typeof e === "string") return e;
    if (e instanceof Error) return e.message;
    try {
        return JSON.stringify(e);
    } catch {
        return "Unknown error";
    }
}

/** =========================
 *  SUPABASE SERVICE (UI layer)
 *  - qui dentro chiami le Api del file supabase.ts
 *  - la UI non deve mai importare StorageApi/DbApi/RpcApi/AuthApi
 *  ========================= */
export const SupabaseService = {
    /** =========================
     *  STORAGE
     *  ========================= */

    /** Lista 1 livello (NON ricorsivo) */
    async listFolder(
        bucket: string,
        folder = ""
    ): Promise<ApiResult<StorageFolderResult>> {
        try {
            const items = (await StorageApi.list(bucket, folder)) as StorageListItem[];

            const files: StorageFileItem[] = items
                // id === null => folder, id !== null => file
                .filter((it) => it.id !== null)
                .map((it) => {
                    const path = folder ? `${folder}/${it.name}` : it.name;
                    return {
                        name: it.name,
                        path,
                        extension: getExt(it.name),
                        url: StorageApi.getPublicUrl(bucket, path),
                    };
                });

            return {
                ok: true,
                data: {
                    bucket,
                    folder,
                    total: files.length,
                    files,
                },
            };
        } catch (e) {
            return { ok: false, error: toErrorMessage(e) };
        }
    },

    /** Lista TUTTI i file (RICORSIVO) */
    async listFolderRecursive(
        bucket: string,
        folder = ""
    ): Promise<ApiResult<StorageFolderResult>> {
        try {
            const rawFiles = await StorageApi.listAllFilesRecursive(bucket, folder);

            const files: StorageFileItem[] = rawFiles.map((f: { name: string; path: string; }) => ({
                name: f.name,
                path: f.path,
                extension: getExt(f.name),
                url: StorageApi.getPublicUrl(bucket, f.path),
            }));

            return {
                ok: true,
                data: {
                    bucket,
                    folder,
                    total: files.length,
                    files,
                },
            };
        } catch (e) {
            return { ok: false, error: toErrorMessage(e) };
        }
    },

    /** Public URL (bucket public) */
    getPublicUrl(bucket: string, path: string): string {
        return StorageApi.getPublicUrl(bucket, path);
    },

    /** Signed URL (bucket private) */
    async createSignedUrl(
        bucket: string,
        path: string,
        expiresInSeconds = 60
    ): Promise<ApiResult<{ signedUrl: string }>> {
        try {
            const signedUrl = await StorageApi.createSignedUrl(bucket, path, expiresInSeconds);
            return { ok: true, data: { signedUrl } };
        } catch (e) {
            return { ok: false, error: toErrorMessage(e) };
        }
    },

    /** Upload */
    async upload(
        bucket: string,
        path: string,
        file: File,
        upsert = true
    ): Promise<ApiResult<{ path: string }>> {
        try {
            const res = await StorageApi.upload(bucket, path, file, upsert);
            return { ok: true, data: { path: res.path } };
        } catch (e) {
            return { ok: false, error: toErrorMessage(e) };
        }
    },

    /** Remove */
    async remove(bucket: string, paths: string[]): Promise<ApiResult<{ removed: number }>> {
        try {
            const res = await StorageApi.remove(bucket, paths);
            return { ok: true, data: { removed: res ?? 0 } };
        } catch (e) {
            return { ok: false, error: toErrorMessage(e) };
        }
    },

    /** =========================
     *  DB
     *  ========================= */

    async dbSelect<T = unknown>(params: DbSelectParams): Promise<ApiResult<T[]>> {
        try {
            const data = await DbApi.select<T>(params.table, params.columns ?? "*", params.filters);
            return { ok: true, data };
        } catch (e) {
            return { ok: false, error: toErrorMessage(e) };
        }
    },

    async dbInsert<T = unknown>(params: DbInsertParams): Promise<ApiResult<T[]>> {
        try {
            const data = await DbApi.insert<T>(params.table, params.payload);
            return { ok: true, data };
        } catch (e) {
            return { ok: false, error: toErrorMessage(e) };
        }
    },

    async dbUpdate<T = unknown>(params: DbUpdateParams): Promise<ApiResult<T[]>> {
        try {
            const data = await DbApi.update<T>(params.table, params.payload, params.match);
            return { ok: true, data };
        } catch (e) {
            return { ok: false, error: toErrorMessage(e) };
        }
    },

    async dbDelete(params: DbDeleteParams): Promise<ApiResult<null>> {
        try {
            await DbApi.remove(params.table, params.match);
            return { ok: true, data: null };
        } catch (e) {
            return { ok: false, error: toErrorMessage(e) };
        }
    },

    /** =========================
     *  RPC
     *  ========================= */

    async rpcCall<T = unknown>(params: RpcCallParams): Promise<ApiResult<T>> {
        try {
            const data = await RpcApi.call<T>(params.fn, params.args);
            return { ok: true, data };
        } catch (e) {
            return { ok: false, error: toErrorMessage(e) };
        }
    },

    /** =========================
     *  AUTH
     *  ========================= */

    async signInWithPassword(params: AuthSignInParams): Promise<ApiResult<AuthSessionResult>> {
        try {
            const session = (await AuthApi.signInWithPassword(
                params.email,
                params.password
            )) as SupabaseSession;

            return {
                ok: true,
                data: {
                    user: session.user
                        ? {
                            id: session.user.id,
                            email: session.user.email,
                        }
                        : null,
                    access_token: session.access_token,
                    refresh_token: session.refresh_token,
                    expires_at: session.expires_at,
                },
            };
        } catch (e) {
            return { ok: false, error: toErrorMessage(e) };
        }
    },

    async signOut(): Promise<ApiResult<true>> {
        try {
            await AuthApi.signOut();
            return { ok: true, data: true };
        } catch (e) {
            return { ok: false, error: toErrorMessage(e) };
        }
    },

    async getSession(): Promise<ApiResult<AuthSessionResult>> {
        try {
            const session = (await AuthApi.getSession()) as SupabaseSession | null;

            if (!session || !session.user) {
                return { ok: true, data: { user: null } };
            }

            return {
                ok: true,
                data: {
                    user: {
                        id: session.user.id,
                        email: session.user.email,
                    },
                    access_token: session.access_token,
                    refresh_token: session.refresh_token,
                    expires_at: session.expires_at,
                },
            };
        } catch (e) {
            return { ok: false, error: toErrorMessage(e) };
        }
    },
};

/*
Esempio:

const res = await SupabaseService.listFolderRecursive("sorso-prenotazioni", "video");
if (!res.ok) console.error(res.error);
else console.log(res.data.files);
*/