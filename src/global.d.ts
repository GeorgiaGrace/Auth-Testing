/// <reference types="@sveltejs/kit" />
declare interface ImportMeta {
    url: string;
    readonly env: ImportMetaEnv;
}

declare interface ImportMetaEnv {
    [key: string]: string | undefined;
    BASE_URL: string;
    MODE: string;
    DEV: boolean;
    PROD: boolean;
}