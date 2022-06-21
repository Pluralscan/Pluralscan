import { writable, derived } from "svelte/store";

export const isAuthenticated = writable(false);
export const user = writable({});
