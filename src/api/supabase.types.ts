/** =========================
 *  COMMON TYPES
 *  ========================= */

export type ApiOk<T> = {
    ok: true;
    data: T;
};

export type ApiErr = {
    ok: false;
    error: string;
};

export type ApiResult<T> = ApiOk<T> | ApiErr;

/** =========================
 *  STORAGE TYPES
 *  ========================= */

export type StorageFileItem = {
    name: string;
    path: string;
    extension: string;
    url: string; // public or signed
};

export type StorageFolderResult = {
    bucket: string;
    folder: string;
    total: number;
    files: StorageFileItem[];
};

/** =========================
 *  DB TYPES
 *  ========================= */

/**
 * Parametri per select generica
 * T = tipo del record restituito
 */
export type DbSelectParams<TFilters = Record<string, unknown>> = {
    table: string;
    columns?: string; // default "*"
    filters?: TFilters;
};

export type DbInsertParams<TPayload = unknown> = {
    table: string;
    payload: TPayload;
};

export type DbUpdateParams<TPayload = unknown, TMatch = Record<string, unknown>> = {
    table: string;
    payload: TPayload;
    match: TMatch;
};

export type DbDeleteParams<TMatch = Record<string, unknown>> = {
    table: string;
    match: TMatch;
};

/** =========================
 *  RPC TYPES
 *  ========================= */

export type RpcCallParams<TArgs = Record<string, unknown>> = {
    fn: string;
    args?: TArgs;
};

/** =========================
 *  AUTH TYPES
 *  ========================= */

export type AuthSignInParams = {
    email: string;
    password: string;
};

export type AuthSessionUser = {
    id?: string;
    email?: string;
};

export type AuthSessionResult = {
    user: AuthSessionUser | null;
    access_token?: string;
    refresh_token?: string;
    expires_at?: number;
};