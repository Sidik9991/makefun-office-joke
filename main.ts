// One-line office joke entry — make.fun "One-Line Office Joke: 24-Hour Sprint"
// Picks the best of 7 candidate lines by scoring each 0-2 on the judge brief's
// criteria (in the brief's own order), writes the winner to /output/entry.txt,
// then re-reads and validates the gate (1-200 chars, one line, non-blank).
// All lines written fresh in this session. None reuses the sibling entry's
// lines ("Our team-building day taught us one thing: we work best alone, on
// mute." / "I asked IT for a second monitor and got a second ticket number
// instead.") or any house reference text from the kit.

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";

// Judge brief criteria, in order. Weights follow the brief's priority:
// (1) genuine one-line office joke, (2) funny / surprise payoff — heaviest;
// (3) one line, single sentence; (4) fresh, specific detail; (5) clear, tight.
const WEIGHTS = { joke: 3, funny: 3, oneLine: 2, fresh: 2, clear: 1 };

type Cand = { id: string; text: string; joke: number; funny: number; oneLine: number; fresh: number; clear: number; note: string };

const CANDIDATES: Cand[] = [
  { id: "A", text: "I put 'per my last email' in my will, so my family knows I tried.", joke: 2, funny: 2, oneLine: 2, fresh: 2, clear: 2,
    note: "Most specific office detail of the set ('per my last email'); the will is a surprise payoff at the very end; one sentence, 68 chars." },
  { id: "B", text: "I set my Slack status to 'in a meeting' and finally got some work done.", joke: 2, funny: 2, oneLine: 2, fresh: 1, clear: 2,
    note: "Strong recognition (status-as-shield), but the 'busy status' trick is a known shape; loses freshness to A." },
  { id: "C", text: "My out-of-office reply has been on so long HR asked if I still work here.", joke: 2, funny: 1, oneLine: 2, fresh: 1, clear: 2,
    note: "HR punchline lands mid-line and the joke is a slow exaggeration, not a turn; weaker payoff than A/B." },
  { id: "D", text: "My calendar is so full my lunch break now has a waiting list.", joke: 2, funny: 1, oneLine: 2, fresh: 1, clear: 2,
    note: "Tight and clear, but 'calendar too full' is a familiar complaint with a mild payoff." },
  { id: "E", text: "I asked for a raise and got a pizza party, so I expensed my dignity.", joke: 2, funny: 1, oneLine: 2, fresh: 1, clear: 1,
    note: "Pizza-party-instead-of-raise is a known trope; 'expensed my dignity' is a second, weaker beat after the turn." },
  { id: "F", text: "The office plant outlived three managers, so we promoted it to HR.", joke: 2, funny: 1, oneLine: 2, fresh: 1, clear: 2,
    note: "Absurd and specific, but the promotion punchline is a familiar 'promoted to irrelevance' shape." },
  { id: "G", text: "The only thing our team builds on time is a case for working from home.", joke: 2, funny: 1, oneLine: 2, fresh: 1, clear: 2,
    note: "Clever, but reads as a quip/observation about remote work rather than a joke with a turn; criterion 1 weaker." },
];

function score(c: Cand): number {
  return c.joke * WEIGHTS.joke + c.funny * WEIGHTS.funny + c.oneLine * WEIGHTS.oneLine + c.fresh * WEIGHTS.fresh + c.clear * WEIGHTS.clear;
}

const ranked = [...CANDIDATES].sort((a, b) => score(b) - score(a) || a.text.length - b.text.length);
for (const c of ranked) {
  console.log(`${c.id} score=${score(c)} len=${[...c.text].length} :: ${c.text}  // ${c.note}`);
}
const winner = ranked[0];
console.log(`WINNER: ${winner.id} (${[...winner.text].length} chars)`);

mkdirSync("/output", { recursive: true });
writeFileSync("/output/entry.txt", winner.text, "utf8");

// Gate validation: re-read and fail loudly unless 1-200 chars, one line, non-blank.
const out = readFileSync("/output/entry.txt", "utf8");
const chars = [...out].length;
if (chars < 1 || chars > 200) throw new Error(`GATE FAIL: ${chars} chars (need 1-200)`);
if (out.trim().length === 0) throw new Error("GATE FAIL: blank entry");
if (out.includes("\n")) throw new Error("GATE FAIL: more than one line");
if (out !== winner.text) throw new Error("GATE FAIL: entry.txt differs from chosen line");
console.log(`GATE OK: ${chars} chars, one line, non-blank`);
