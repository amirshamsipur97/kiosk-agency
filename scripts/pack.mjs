/**
 * Zip the exported site for upload to Hostinger.
 *
 * `next build` writes out/. This wraps it in a single archive so the whole
 * site goes up in one drag rather than a few thousand files, which is the
 * difference between a minute and an hour in a File Manager.
 */
import { execSync } from "node:child_process";
import { statSync, existsSync, rmSync, readdirSync } from "node:fs";

if (!existsSync("out")) {
  console.error("No out/ folder. Run `next build` first.");
  process.exit(1);
}

const zip = "kioskoman-site.zip";
rmSync(zip, { force: true });

// -r from inside out/, so the archive has no wrapper folder: unzipping it in
// public_html puts index.html at the root, which is what Apache expects.
execSync(`cd out && zip -qr ../${zip} . -x ".DS_Store"`, { stdio: "inherit" });

const mb = (statSync(zip).size / 1024 / 1024).toFixed(1);
const pages = readdirSync("out").filter((f) => f.endsWith(".html")).length;
console.log(`\n  ${zip}  ${mb} MB, ${pages} pages at the root`);
console.log("  Upload it to public_html and extract there.\n");
