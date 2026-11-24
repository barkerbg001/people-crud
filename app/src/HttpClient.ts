import { Platform } from "react-native";

const PORT = 5044;

// Android emulator: 10.0.2.2 is the emulator's standard alias for the host machine's localhost.
// On this setup it was refused, so we use `adb reverse tcp:5044 tcp:5044` (run by `npm run android:reverse`)
// which makes localhost on the emulator point at the host. Switch back to 10.0.2.2 if you skip adb reverse.
export const ANDROID_EMULATOR_URL_ALIAS = `http://10.0.2.2:${PORT}`;
export const ANDROID_EMULATOR_URL = `http://localhost:${PORT}`;
// iOS simulator and web: share the host's network, so localhost works.
export const IOS_SIMULATOR_URL = `http://localhost:${PORT}`;
export const WEB_URL = `http://localhost:${PORT}`;
// Real phone (Expo Go): set to your machine's LAN IP (Mac: `ipconfig getifaddr en0`, Windows: `ipconfig`).
export const DEVICE_URL = ""; // e.g. "http://192.168.1.10:5044"

export const API =
  DEVICE_URL ||
  Platform.select({
    android: ANDROID_EMULATOR_URL,
    ios: IOS_SIMULATOR_URL,
    default: WEB_URL,
  })!;

export type Person = { id: number; name: string; surname: string; age: number };

export const getPeople = async (): Promise<Person[]> => {
  const res = await fetch(`${API}/people`);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
};

export const addPerson = async (p: Omit<Person, "id">): Promise<Person> => {
  const res = await fetch(`${API}/people`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(p),
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
};

export const deletePerson = async (id: number): Promise<void> => {
  const res = await fetch(`${API}/people/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
};
