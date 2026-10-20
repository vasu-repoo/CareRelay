export type Consent = "share" | "private";
export type CheckIn = { id: string; person: string; relation: string; update: string; consent: Consent; createdAt: string };
export type Task = { id: string; title: string; owner: string; due: string; done: boolean };

const checkIns: CheckIn[] = [];
const plans = new Map<string, Task[]>();

export function safetyNotice(text: string) {
  const urgent = ["can't breathe", "cannot breathe", "chest pain", "unconscious", "severe bleeding", "suicidal"];
  return urgent.some((phrase) => text.toLowerCase().includes(phrase))
    ? "This may need urgent attention. Contact local emergency services or a qualified medical professional now."
    : null;
}

export function createCheckIn(input: Omit<CheckIn, "id" | "createdAt">) {
  const checkIn: CheckIn = { ...input, id: crypto.randomUUID(), createdAt: new Date().toISOString() };
  checkIns.unshift(checkIn);
  return { checkIn, safetyNotice: safetyNotice(input.update) };
}

export function getCheckIn(id: string) { return checkIns.find((item) => item.id === id); }
export function getAll() { return checkIns; }

export function makePlan(checkIn: CheckIn) {
  const plan: Task[] = [
    { id: crypto.randomUUID(), title: `Call ${checkIn.person} at 7:30 PM and confirm they are comfortable`, owner: "Maya", due: "Today", done: false },
    { id: crypto.randomUUID(), title: "Confirm whether the medication reminder was completed", owner: "Arjun", due: "Today", done: false },
    { id: crypto.randomUUID(), title: "Schedule a non-urgent check-in with the care team", owner: "Maya", due: "Tomorrow", done: false }
  ];
  plans.set(checkIn.id, plan);
  return plan;
}

export function getPlan(id: string) { return plans.get(id) ?? []; }
