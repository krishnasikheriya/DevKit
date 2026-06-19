import flourite from "flourite";

export function detectLanguage(code: string): string {
  if (!code || code.trim() === "") {
    return "plaintext";
  }

  // 1. Heuristics for JSON (flourite misses JSON)
  if (/^\s*[\{\[]/.test(code) && /[\}\]]\s*$/.test(code)) {
    try {
      JSON.parse(code);
      return "json";
    } catch (e) {
      // Not valid JSON, continue
    }
  }

  // 2. Heuristics for SQL
  if (/^\s*(SELECT|INSERT|UPDATE|DELETE|CREATE|ALTER|DROP)\s/i.test(code)) {
    return "sql";
  }

  // 3. Heuristics for Markdown
  if (/^#+\s/.test(code) || /\[.*\]\(.*\)/.test(code) || /^\s*(-|\*)\s/.test(code) || /```[a-z]*\n/.test(code)) {
    // If it looks very much like markdown
    if (!/^\s*(import|function|class|def|fn|public)\s/.test(code)) {
      return "markdown";
    }
  }

  // 4. Use Flourite for programming languages
  const res = flourite(code, { shiki: true }).language;
  
  if (res === "unknown") return "plaintext";
  if (res === "c") return "cpp"; // We group C and C++ in our UI

  // Ensure it matches one of our supported values if possible, 
  // though flourite's shiki: true outputs standard names that match our keys
  return res.toLowerCase();
}
