/* Vérifie qu'aucune ressource de `dist/` n'est chargée depuis un domaine tiers.
 *
 * Le site doit pouvoir être consulté sans que le navigateur du visiteur contacte
 * un autre serveur que celui qui l'héberge : c'est ce qui permet d'affirmer
 * qu'aucune adresse IP ne sort de l'hébergement (RGPD). Un CDN de polices, une
 * image en hotlink ou un script d'analytics réintroduit silencieusement ce
 * transfert — ce script échoue avant la mise en ligne.
 *
 * Les liens <a> sortants ne sont pas concernés : ils ne partent que sur un clic
 * volontaire du visiteur, et sont rendus en `rel="noreferrer"`.
 */
import { readFile, readdir } from 'node:fs/promises';
import { join, relative } from 'node:path';

const DIST = 'dist';
const SELF = 'einformatique.fr';

/* Attributs déclenchant un chargement automatique par le navigateur. */
const AUTO_LOAD =
  /<(?:img|script|link|source|video|audio|iframe|embed|object)\b[^>]*?(?:src|srcset|href|data)="([^"]+)"/gi;
const CSS_URL = /url\((['"]?)((?:https?:)?\/\/[^)'"]+)\1\)/gi;

async function* walk(dir) {
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) yield* walk(p);
    else yield p;
  }
}

const offences = [];

for await (const file of walk(DIST)) {
  const isHtml = file.endsWith('.html');
  const isCss = file.endsWith('.css');
  if (!isHtml && !isCss) continue;

  const body = await readFile(file, 'utf8');
  const found = [];

  if (isHtml) {
    for (const [, value] of body.matchAll(AUTO_LOAD)) {
      for (const part of value.split(',')) found.push(part.trim().split(/\s+/)[0]);
    }
  }
  for (const [, , url] of body.matchAll(CSS_URL)) found.push(url);

  for (const url of found) {
    if (!/^(https?:)?\/\//.test(url)) continue;
    const host = url.replace(/^(https?:)?\/\//, '').split('/')[0];
    if (host === SELF || host.endsWith(`.${SELF}`)) continue;
    offences.push(`${relative(DIST, file)} → ${host} (${url})`);
  }
}

if (offences.length) {
  console.error('\n✗ Ressources chargées depuis un domaine tiers :\n');
  for (const o of offences) console.error('   ' + o);
  console.error(
    '\nCes requêtes transmettent l\'adresse IP du visiteur à un tiers.',
    '\nHébergez la ressource dans public/ ou src/assets/ avant de publier.\n'
  );
  process.exit(1);
}

console.log('✓ Aucune ressource tierce : rien ne quitte l\'hébergement.');
