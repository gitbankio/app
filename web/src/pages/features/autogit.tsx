import FeaturePage from "./_template";
import { GitBranch } from "lucide-react";
import { BuilderCat } from "@/components/mascots";

function AutogitDiagram() {
  const ac = "#f97316";
  return (
    <svg width="260" height="66" viewBox="0 0 260 66" fill="none" aria-hidden style={{imageRendering:"pixelated"}}>
      <rect x="4"   y="21" width="44" height="24" rx="2" fill="#f9731611" stroke={ac} strokeWidth="0.75"/>
      <text x="26"  y="30" fontSize="6" fontFamily="'Courier New',monospace" fontWeight="bold" fill={ac} textAnchor="middle">PR</text>
      <text x="26"  y="39" fontSize="5.5" fontFamily="'Courier New',monospace" fill={ac} textAnchor="middle" opacity="0.75">MERGE</text>
      <rect x="48"  y="32.25" width="4" height="1.5" fill={ac} fillOpacity="0.45"/>
      <polygon points="52,30 52,36 56,33" fill={ac} fillOpacity="0.5"/>
      <rect x="56"  y="21" width="44" height="24" rx="2" fill="#f9731611" stroke={ac} strokeWidth="0.75"/>
      <text x="78"  y="30" fontSize="6" fontFamily="'Courier New',monospace" fontWeight="bold" fill={ac} textAnchor="middle">WEBHOOK</text>
      <text x="78"  y="39" fontSize="5.5" fontFamily="'Courier New',monospace" fill={ac} textAnchor="middle" opacity="0.75">GITHUB APP</text>
      <rect x="100" y="32.25" width="4" height="1.5" fill={ac} fillOpacity="0.45"/>
      <polygon points="104,30 104,36 108,33" fill={ac} fillOpacity="0.5"/>
      <rect x="108" y="21" width="44" height="24" rx="2" fill="#f9731611" stroke={ac} strokeWidth="0.75"/>
      <text x="130" y="30" fontSize="6" fontFamily="'Courier New',monospace" fontWeight="bold" fill={ac} textAnchor="middle">AI PARSE</text>
      <text x="130" y="39" fontSize="5.5" fontFamily="'Courier New',monospace" fill={ac} textAnchor="middle" opacity="0.75">CLAUDE</text>
      <rect x="152" y="32.25" width="4" height="1.5" fill={ac} fillOpacity="0.45"/>
      <polygon points="156,30 156,36 160,33" fill={ac} fillOpacity="0.5"/>
      <rect x="160" y="21" width="44" height="24" rx="2" fill="#f9731611" stroke={ac} strokeWidth="0.75"/>
      <text x="182" y="30" fontSize="6" fontFamily="'Courier New',monospace" fontWeight="bold" fill={ac} textAnchor="middle">GH API</text>
      <text x="182" y="39" fontSize="5.5" fontFamily="'Courier New',monospace" fill={ac} textAnchor="middle" opacity="0.75">REST v3</text>
      <rect x="204" y="32.25" width="4" height="1.5" fill={ac} fillOpacity="0.45"/>
      <polygon points="208,30 208,36 212,33" fill={ac} fillOpacity="0.5"/>
      <rect x="212" y="21" width="44" height="24" rx="2" fill="#f9731611" stroke={ac} strokeWidth="0.75"/>
      <text x="234" y="30" fontSize="6" fontFamily="'Courier New',monospace" fontWeight="bold" fill={ac} textAnchor="middle">COMMITS</text>
      <text x="234" y="39" fontSize="5.5" fontFamily="'Courier New',monospace" fill={ac} textAnchor="middle" opacity="0.75">AUTO-PUSH</text>
    </svg>
  );
}

export default function AutogitFeaturePage() {
  return (
    <FeaturePage
      data={{
        status: "LIVE",
        accent: "#f97316",
        title: "AutoGit Builder",
        tagline: "Push code to GitHub from any AI client",
        icon: <GitBranch size={28} />,
        mascot: <BuilderCat />,
        heroDiagram: <AutogitDiagram />,
        description:
          "AutoGit bridges your AI assistant to GitHub. Claude Desktop, Cursor, Grok, or any MCP-compatible client can create files, commit changes, open pull requests, and deploy to GitHub Pages, all from a natural language prompt, no terminal required.",
        features: [
          {
            title: "Push commits from any AI",
            desc: "MCP tool autogit_push({ files, message, branch }) commits a set of files to a GitHub repo. Supports multi-file commits. Works from Claude Desktop, Cursor, Grok, VS Code, and any MCP host.",
          },
          {
            title: "Create pull requests",
            desc: "autogit_create_pr({ title, body, base, head }) opens a pull request with AI-generated title and description. PRs appear in your GitHub repo immediately.",
          },
          {
            title: "Full file CRUD",
            desc: "autogit_read_file, autogit_write_file, autogit_delete_file, autogit_list_files, complete file system operations on any GitHub branch.",
          },
          {
            title: "AI-generated React apps",
            desc: "The AutoGit landing page prompts users to describe an app. The AI generates a full React + Vite app, uploads it to GitHub, and deploys via GitHub Pages in under 60 seconds.",
          },
          {
            title: "Session-based scaffolding",
            desc: "Generate-iterate cycle: each session stores scaffolds in the DB. Ask the AI to improve component X, add feature Y, or fix bug Z, it retrieves the session and continues building.",
          },
          {
            title: "GitHub Pages deployment",
            desc: "After push, @gitbankbot deploy pages on GitHub Pages branch in any Issue or PR triggers a GitHub Actions workflow to build and deploy to user.github.io/repo.",
          },
        ],
        steps: [
          {
            step: "01",
            title: "Connect MCP",
            desc: "Add https://gitbank.io/api/mcp to your AI client. No API key needed, GitHub App handles auth.",
          },
          {
            step: "02",
            title: "Describe or write",
            desc: "Tell your AI: 'Create a landing page for my startup' or 'Add dark mode to the existing app'.",
          },
          {
            step: "03",
            title: "Push",
            desc: "AI calls autogit_push({ files: [...], message: 'feat: add dark mode', branch: 'main' }). Files appear in your repo instantly.",
          },
          {
            step: "04",
            title: "Deploy",
            desc: "Post @gitbankbot deploy in any Issue or PR. GitHub Pages builds and serves your app in 30 seconds.",
          },
        ],
        commands: [
          {
            cmd: "autogit_push({ files, message, repo, branch })",
            desc: "Commits all provided files to the specified repo and branch. Returns the commit SHA and GitHub URL.",
            output: '{ commit: "a3f2b1c", url: "https://github.com/user/repo/commit/a3f2b1c" }',
          },
          {
            cmd: "autogit_create_pr({ repo, title, body, head, base })",
            desc: "Opens a pull request on the specified repo. Returns PR number and URL.",
            output: '{ pr: 42, url: "https://github.com/user/repo/pull/42" }',
          },
          {
            cmd: "autogit_read_file({ repo, path, ref })",
            desc: "Returns the file contents at the given path and branch/commit ref.",
          },
          {
            cmd: "autogit_list_files({ repo, path, ref })",
            desc: "Lists all files in a directory at the given path and ref.",
          },
          {
            cmd: "autogit_write_file({ repo, path, content, message, branch })",
            desc: "Creates or updates a single file. Automatically creates a commit.",
          },
          {
            cmd: "autogit_delete_file({ repo, path, message, branch })",
            desc: "Deletes a file and creates a deletion commit.",
          },
        ],
        architecture: [
          {
            layer: "AutoGit API routes",
            what: "/autogit/*, session-based scaffold management",
            why: "Dedicated Express routes handle generate, stream, iterate, and deploy operations. Sessions stored in the DB with file snapshots so the AI can continue iterating across multiple requests.",
          },
          {
            layer: "MCP tool bridge",
            what: "autogit_* tools registered on the MCP server",
            why: "Each MCP tool maps to a GitHub App API call. The MCP handler validates the GitHub installation token, resolves the repo, and calls the GitHub Contents API.",
          },
          {
            layer: "GitHub App",
            what: "Installable GitHub App with contents:write permission",
            why: "The Gitbank GitHub App (installed on user repos) provides a short-lived installation token. The API uses this token for all repo operations, no long-lived PAT required.",
          },
          {
            layer: "Session DB",
            what: "scaffold_sessions table, per-session file state",
            why: "Each generate session stores all file contents. On iterate, the AI retrieves the session, modifies specific files, and pushes the delta. Enables multi-turn app building without re-generating from scratch.",
          },
          {
            layer: "GitHub Pages deployment",
            what: "Triggered via GitHub webhook @gitbankbot deploy command",
            why: "When @gitbankbot receives a deploy command in an Issue/PR, it pushes a workflow dispatch event to the repo. A pre-configured GitHub Actions workflow builds and deploys to GitHub Pages.",
          },
        ],
        faq: [
          {
            q: "Which AI clients work with AutoGit?",
            a: "Any client that supports MCP StreamableHTTP transport: Claude Desktop, Cursor, Grok (coming), VS Code MCP extension, and any custom client using the MCP SDK.",
          },
          {
            q: "Do I need to install anything?",
            a: "No installation on your machine. Add the MCP server URL to your AI client settings and install the Gitbank GitHub App on your repo. That's all.",
          },
          {
            q: "Can it push to private repos?",
            a: "Yes. The GitHub App installation includes private repo access when you grant it during app install. All push operations are authenticated with the installation token.",
          },
          {
            q: "What frameworks does the AI-generated scaffold support?",
            a: "The AutoGit builder generates React + Vite apps by default. Future templates include Next.js, Astro, and plain HTML/CSS. The AI can generate any file type, framework is just a starting template.",
          },
          {
            q: "Is there a file size or count limit?",
            a: "GitHub's Content API has a 100 MB per-file limit and a rate limit on commits. AutoGit batches large scaffolds into tree commits to avoid per-file rate limiting. Practical limit is ~500 files per session.",
          },
        ],
      }}
    />
  );
}
