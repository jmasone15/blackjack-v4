/// <reference types="vite/client" />

interface ImportMetaEnv {
	readonly VITE_OPEN_AI_API_KEY: string;
	readonly VITE_OPEN_AI_PROJECT_KEY: string;
	readonly VITE_OPEN_AI_ORG_KEY: string;
}

interface ImportMeta {
	readonly env: ImportMetaEnv;
}
