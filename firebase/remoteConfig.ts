import { fetchAndActivate, getRemoteConfig, getValue } from "firebase/remote-config";
import { initApp } from "./initFirebase";

export const getRemoteConfigValue = async (key: string): Promise<string> => {
    // Remote Config is browser-only in this app.
    if (typeof window === "undefined") return "";

    const app = initApp();
    const remoteConfig = getRemoteConfig(app);
    remoteConfig.settings.minimumFetchIntervalMillis = 60 * 60 * 1000;

    try {
        await fetchAndActivate(remoteConfig);
    } catch {
        // Continue with cached/default values if fetch fails.
    }

    return getValue(remoteConfig, key).asString();
};