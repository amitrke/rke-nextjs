import { getRemoteConfig } from "firebase/remote-config";
import { getValue } from "firebase/remote-config";

const remoteConfig = getRemoteConfig();

export const getRemoteConfigValue = async(key: string): Promise<string> => {
    return getValue(remoteConfig, key).asString();
};