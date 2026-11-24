// Web or iOS simulator: localhost works. Real phone: use the Mac's IP (run `ipconfig getifaddr en0`).
const API = "http://localhost:5044";

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
