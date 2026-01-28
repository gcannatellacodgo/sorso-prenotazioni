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

export type DbSelectParams = {
    table: string;
    columns?: string; // default "*"
    filters?: Record<string, any>;
};

export type DbInsertParams = {
    table: string;
    payload: any;
};

export type DbUpdateParams = {
    table: string;
    payload: any;
    match: Record<string, any>;
};

export type DbDeleteParams = {
    table: string;
    match: Record<string, any>;
};

/** =========================
 *  RPC TYPES
 *  ========================= */

export type RpcCallParams = {
    fn: string;
    args?: Record<string, any>;
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