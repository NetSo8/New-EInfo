/* Contrôles d'accessibilité sur `dist/`, exécutés à chaque build.
 *
 * Ils ne remplacent pas un audit : axe-core et un vrai lecteur d'écran voient
 * des choses qu'aucune expression régulière n'attrapera. Ils empêchent les
 * régressions les plus faciles à introduire sans s'en rendre compte — une
 * image sans alternative, un niveau de titre sauté, un bouton muet.
 */
import { readFile, readdir } from 'node:fs/promises';
import { join, relative } from 'node:path';

const DIST = 'dist';

async function* walk(dir) {
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) yield* walk(p);
    else if (e.name.endsWith('.html')) yield p;
  }
}

const tags = (html, name) =>
  [...html.matchAll(new RegExp(`<${name}\\b[^>]*>`, 'gi'))].map((m) => m[0]);
const attr = (tag, name) => {
  const m = tag.match(new RegExp(`\\s${name}="([^"]*)"`, 'i'));
  return m ? m[1] : null;
};
const hasAttr = (tag, name) => new RegExp(`\\s${name}[=\\s>]`, 'i').test(tag);

const problems = [];
let checked = 0;

for await (const file of walk(DIST)) {
  const html = await readFile(file, 'utf8');
  const page = relative(DIST, file);
  const fail = (msg) => problems.push(`${page} — ${msg}`);

  /* Une redirection générée n'a pas de contenu à auditer. */
  if (/http-equiv="refresh"/i.test(html)) continue;
  checked++;

  if (!/<html[^>]+lang="[a-z-]+"/i.test(html)) fail('<html> sans attribut lang');
  if (!/<title>[^<]{3,}<\/title>/i.test(html)) fail('<title> absent ou vide');

  const h1 = (html.match(/<h1\b/gi) || []).length;
  if (h1 !== 1) fail(`${h1} <h1> (il en faut exactement un)`);

  /* Hiérarchie : on ne saute pas de niveau en descendant. */
  const levels = [...html.matchAll(/<h([1-6])\b/gi)].map((m) => +m[1]);
  for (let i = 1; i < levels.length; i++) {
    if (levels[i] - levels[i - 1] > 1) {
      fail(`niveau de titre sauté : h${levels[i - 1]} → h${levels[i]}`);
      break;
    }
  }

  for (const img of tags(html, 'img')) {
    if (!hasAttr(img, 'alt')) fail(`<img> sans attribut alt : ${img.slice(0, 70)}`);
  }

  /* Deux repères de même nature doivent être distinguables à l'oreille. */
  const navs = tags(html, 'nav');
  if (navs.length > 1) {
    const named = navs.filter((n) => attr(n, 'aria-label') || attr(n, 'aria-labelledby'));
    if (named.length !== navs.length) fail(`${navs.length} <nav>, seulement ${named.length} nommés`);
  }

  /* Un tabindex positif réordonne la tabulation et casse l'ordre de lecture. */
  if (/tabindex="[1-9]/i.test(html)) fail('tabindex positif');

  /* Bouton sans texte ni étiquette : muet pour un lecteur d'écran. */
  for (const m of html.matchAll(/<button\b([^>]*)>([\s\S]*?)<\/button>/gi)) {
    const [, attrs, inner] = m;
    const text = inner.replace(/<[^>]+>/g, '').replace(/&nbsp;/g, ' ').trim();
    const labelled = /aria-label(ledby)?="/i.test(attrs) || /class="[^"]*\bsr-only\b/.test(inner);
    if (!text && !labelled) fail(`<button> sans nom accessible : ${m[0].slice(0, 70)}`);
  }

  /* Idem pour un lien qui n'enveloppe qu'une icône. */
  for (const m of html.matchAll(/<a\b([^>]*\shref=[^>]*)>([\s\S]*?)<\/a>/gi)) {
    const [, attrs, inner] = m;
    const text = inner.replace(/<[^>]+>/g, '').replace(/&nbsp;/g, ' ').trim();
    const labelled = /aria-label(ledby)?="/i.test(attrs) || /class="[^"]*\bsr-only\b/.test(inner);
    if (!text && !labelled) fail(`<a> sans nom accessible : ${m[0].slice(0, 70)}`);
  }

  /* Une nouvelle fenêtre sans prévenir désoriente ; on exige au moins rel. */
  for (const a of tags(html, 'a')) {
    if (attr(a, 'target') === '_blank' && !/noopener/.test(attr(a, 'rel') || '')) {
      fail(`lien _blank sans rel="noopener" : ${a.slice(0, 60)}`);
    }
  }
}

if (problems.length) {
  console.error(`\n✗ Accessibilité — ${problems.length} problème(s) sur ${checked} pages :\n`);
  for (const p of problems) console.error('   ' + p);
  console.error('');
  process.exit(1);
}

console.log(`✓ Accessibilité : ${checked} pages, aucun défaut structurel.`);
