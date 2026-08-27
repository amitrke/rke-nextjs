// Title-similarity dedup for news articles pulled from multiple sources (NewsAPI, NewsData.io, SerpApi).
// Different outlets paraphrase the same event differently, so exact-title matching misses most duplicates.
// This uses bag-of-words Jaccard/coverage similarity with light number/plural normalization, no AI/ML model.

const STOP_WORDS = new Set([
    "the", "a", "an", "to", "of", "in", "on", "for", "with", "and", "or", "at", "from", "by", "about",
    "after", "before", "over", "under", "into", "as", "is", "are", "was", "were", "be", "been", "being",
    "this", "that", "these", "those", "it", "its", "their", "his", "her", "new", "breaking",
]);

// Headlines about the same event often report the same fact as a word ("two") in one outlet
// and a digit ("2") in another - normalize so both compare equal.
const NUMBER_WORDS: Record<string, string> = {
    one: "1", two: "2", three: "3", four: "4", five: "5", six: "6", seven: "7", eight: "8", nine: "9",
    ten: "10", eleven: "11", twelve: "12",
};

function normalizeTitle(raw: string): string {
    if (!raw) return "";
    return raw
        .toLowerCase()
        .replace(/https?:\/\/\S+/g, " ") // remove urls
        .replace(/[^a-z0-9\s]/g, " ")      // remove punctuation
        .replace(/\s+/g, " ")               // collapse whitespace
        .trim();
}

// Light plural stemming so "bike"/"bikes", "injury"/"injuries" compare equal. Deliberately narrow
// (no verb-tense stemming) to avoid collapsing unrelated words together.
function stem(token: string): string {
    if (token.length > 4 && token.endsWith("ies")) return token.slice(0, -3) + "y";
    if (token.length > 4 && token.endsWith("es")) return token.slice(0, -2);
    if (token.length > 3 && token.endsWith("s") && !token.endsWith("ss")) return token.slice(0, -1);
    return token;
}

function tokenizeTitle(raw: string): string[] {
    const norm = normalizeTitle(raw);
    if (!norm) return [];
    return norm
        .split(" ")
        .filter(t => t && !STOP_WORDS.has(t))
        .map(t => NUMBER_WORDS[t] ?? t)
        .map(stem);
}

function jaccardSimilarity(aTokens: string[], bTokens: string[]): number {
    if (aTokens.length === 0 && bTokens.length === 0) return 1;
    const aSet = new Set(aTokens);
    const bSet = new Set(bTokens);
    let intersection = 0;
    for (const t of aSet) {
        if (bSet.has(t)) intersection++;
    }
    const union = aSet.size + bSet.size - intersection;
    return union === 0 ? 0 : intersection / union;
}

function tokenCoverage(aTokens: string[], bTokens: string[]): number {
    if (aTokens.length === 0 || bTokens.length === 0) return 0;
    const aSet = new Set(aTokens);
    const bSet = new Set(bTokens);
    let intersection = 0;
    for (const t of aSet) {
        if (bSet.has(t)) intersection++;
    }
    const minLen = Math.min(aSet.size, bSet.size);
    return minLen === 0 ? 0 : intersection / minLen;
}

// Thresholds tuned against real roorkee.org news titles (multi-outlet coverage of the same story
// commonly lands around 0.5-0.85 coverage / 0.35-0.7 Jaccard, while unrelated articles - even ones
// sharing a topic like "IIT Roorkee study" - stayed under 0.4 Jaccard / 0.39 coverage). See
// tests/newsDedup.test.ts for the specific cases this was validated against.
function areTitlesSimilar(a: string, b: string): boolean {
    const an = normalizeTitle(a);
    const bn = normalizeTitle(b);
    if (!an || !bn) return false;
    if (an === bn) return true;
    const at = tokenizeTitle(a);
    const bt = tokenizeTitle(b);
    if (at.length === 0 || bt.length === 0) return an === bn;
    const j = jaccardSimilarity(at, bt);
    const cov = tokenCoverage(at, bt);
    return j >= 0.45 || cov >= 0.5;
}

export function dedupeBySimilarTitle<T extends { title: string }>(items: T[]): T[] {
    const result: T[] = [];
    for (const item of items) {
        const duplicate = result.some(r => areTitlesSimilar(r.title, item.title));
        if (!duplicate) result.push(item);
    }
    return result;
}
