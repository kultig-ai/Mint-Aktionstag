import type { NextConfig } from "next";

// Auf GitHub Pages liegt die Seite unter /Mint-Aktionstag – lokal unter /.
const isGithubActions = process.env.GITHUB_ACTIONS === "true";

const nextConfig: NextConfig = {
  // Statischer Export: erzeugt bei `next build` reine HTML/CSS/JS-Dateien in out/
  output: "export",
  basePath: isGithubActions ? "/Mint-Aktionstag" : undefined,
  images: { unoptimized: true },
};

export default nextConfig;
