/* Scène 3D de la pile de couches (page À propos).
 *
 * Module chargé à la demande par LayerStack.astro. Les classes de Three.js
 * sont importées une à une : le build ne garde que ce qui sert, au lieu de
 * la bibliothèque entière.
 */
import {
  AmbientLight,
  BoxGeometry,
  BufferAttribute,
  BufferGeometry,
  CanvasTexture,
  Clock,
  Color,
  ConeGeometry,
  DirectionalLight,
  EdgesGeometry,
  Group,
  InstancedMesh,
  LineBasicMaterial,
  LineSegments,
  Matrix4,
  Mesh,
  MeshBasicMaterial,
  MeshStandardMaterial,
  PerspectiveCamera,
  PlaneGeometry,
  Points,
  PointsMaterial,
  DoubleSide,
  RingGeometry,
  Scene,
  WebGLRenderer,
} from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';

/* Ce qui pousse sur chaque plaque : des modules en relief, de plus en plus
   nombreux et fins à mesure qu'on descend. Un écran, des lames de serveur,
   une grille de services, la mémoire découpée en blocs, puis une puce
   couverte de cellules. Coordonnées locales à la plaque (±1,55), hors des
   coins réservés aux étiquettes. [x, z, largeur, profondeur, hauteur, clignote ?] */
type Module = [number, number, number, number, number, boolean?];

/** Pseudo-hasard stable : la même pile à chaque chargement. */
const bruit = (n: number) => (((Math.sin(n * 12.9898) * 43758.5453) % 1) + 1) % 1;

const MOTIFS: Module[][] = [
  // Interface : un écran et son clavier.
  [
    [-0.05, -0.2, 1.95, 1.1, 0.1],
    [-0.05, 0.62, 1.5, 0.26, 0.06],
    [0.72, 0.62, 0.12, 0.12, 0.1, true],
  ],
  // Réseau : quatre lames de serveur, chacune sa diode.
  [0, 1, 2, 3].flatMap((k): Module[] => [
    [-0.1, -0.72 + k * 0.44, 2.2, 0.34, 0.14],
    [1.17, -0.72 + k * 0.44, 0.1, 0.1, 0.22, true],
  ]),
  // Service : seize services reliés entre eux.
  [0, 1, 2, 3].flatMap((r) => [0, 1, 2, 3].map((col): Module => [-0.9 + col * 0.6, -0.72 + r * 0.48, 0.28, 0.28, 0.24, true])),
  // Système : la mémoire, six rangées de blocs alloués de tailles inégales.
  [0, 1, 2, 3, 4, 5].flatMap((r) => {
    const rangee: Module[] = [];
    let x = -1.25;
    for (let n = 0; x < 1.15; n++) {
      const w = Math.min(0.14 + bruit(r * 31 + n) * 0.55, 1.25 - x);
      rangee.push([x + w / 2, -0.8 + r * 0.32, w - 0.05, 0.24, 0.08 + bruit(r * 7 + n * 3) * 0.1, true]);
      x += w;
    }
    return rangee;
  }),
  // Matériel : une puce, quatre-vingts cellules de hauteurs inégales.
  Array.from({ length: 80 }, (_, n): Module => {
    const col = n % 10;
    const r = Math.floor(n / 10);
    return [-1.08 + col * 0.24, -0.84 + r * 0.24, 0.17, 0.17, 0.07 + bruit(n) * 0.16, true];
  }),
];

/** Index des couches, dans l'ordre de la pile. */
const INTERFACE = 0;
const RESEAU = 1;
const SERVICE = 2;
const SYSTEME = 3;
const MATERIEL = 4;

/** Pas de la trame de points gravée sur chaque plaque : plus serrée en bas. */
const TRAME = [64, 48, 36, 26, 18];

export interface Pile {
  /** L'étape active a changé : met en avant la couche correspondante. */
  activer(index: number): void;
  /** Redemande une image (retour à l'écran, pointeur, thème…). */
  relancer(): void;
}

interface Options {
  hote: HTMLElement;
  canvas: HTMLCanvasElement;
  couches: string[];
  calme: () => boolean;
  estVisible: () => boolean;
}

export function monterPile({ hote, canvas, couches, calme, estVisible }: Options): Pile | null {
  let renderer: WebGLRenderer;
  try {
    renderer = new WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'low-power' });
  } catch {
    return null; // pas de WebGL : le repli CSS reste affiché
  }
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
  const root = document.documentElement;

  // Couleurs lues dans les jetons du site (OKLCH), converties en RGB par le
  // navigateur lui-même via un canvas d'un pixel.
  const pixel = document.createElement('canvas').getContext('2d', { willReadFrequently: true })!;
  const jeton = (nom: string) => {
    pixel.clearRect(0, 0, 1, 1);
    pixel.fillStyle = getComputedStyle(hote).getPropertyValue(nom).trim();
    pixel.fillRect(0, 0, 1, 1);
    const [r, g, b] = pixel.getImageData(0, 0, 1, 1).data;
    return new Color(r / 255, g / 255, b / 255);
  };

  const scene = new Scene();
  const camera = new PerspectiveCamera(28, 1, 0.1, 100);
  camera.position.set(6.8, 8.6, 8.8);
  camera.lookAt(0, -0.1, 0);
  scene.add(new AmbientLight(0xffffff, 2.3));
  const soleil = new DirectionalLight(0xffffff, 0.9);
  soleil.position.set(3, 10, 4);
  scene.add(soleil);

  const pile = new Group();
  scene.add(pile);

  const ECART = 0.82;
  const L = 3.1;
  const geoPlaque = new RoundedBoxGeometry(L, 0.12, L, 4, 0.14);
  const geoArete = new EdgesGeometry(new BoxGeometry(L, 0.12, L));
  const geoEtiquette = new PlaneGeometry(L, L);
  const geoModule = new BoxGeometry(1, 1, 1);
  const matrice = new Matrix4();
  const teinte = new Color();

  const plaques = couches.map((_, i) => {
    const groupe = new Group();
    const corps = new Mesh(geoPlaque, new MeshStandardMaterial({ roughness: 0.55, metalness: 0.05, transparent: true, opacity: 0.92 }));
    const arete = new LineSegments(geoArete, new LineBasicMaterial({ transparent: true }));
    const dessin = document.createElement('canvas');
    dessin.width = dessin.height = 512;
    const texture = new CanvasTexture(dessin);
    texture.anisotropy = 4;
    const etiquette = new Mesh(geoEtiquette, new MeshBasicMaterial({ map: texture, transparent: true, depthWrite: false }));
    etiquette.rotation.x = -Math.PI / 2;
    etiquette.position.y = 0.065;
    groupe.add(corps, arete, etiquette);

    const motif = MOTIFS[Math.min(i, MOTIFS.length - 1)];
    const modules = new InstancedMesh(geoModule, new MeshStandardMaterial({ roughness: 0.45, metalness: 0.1 }), motif.length);
    groupe.add(modules);
    // Ordre de levée : de gauche à droite, au passage du rideau de lumière.
    const retards = motif.map(([x, z]) => ((x + L / 2) / L) * 0.85 + ((z + L / 2) / L) * 0.15);
    const zeros = () => motif.map(() => 0);

    pile.add(groupe);
    const y = ((couches.length - 1) / 2 - i) * ECART;
    groupe.position.y = y;
    return {
      groupe, corps, arete, dessin, texture, modules, motif, retards,
      allumes: zeros(), // lueur d'un module (0 à 1), qui retombe seule
      enfonce: zeros(), // module pressé (clic, touche)
      libre: zeros(), // bloc mémoire libéré (0 alloué, 1 libre)
      libreCible: zeros(),
      relache: zeros(), // temps avant réallocation
      leve: 0, y, x: 0, lum: 0,
    };
  });

  // Quatre entretoises aux coins, comme une pile de cartes électroniques,
  // et des paquets qui y descendent d'étage en étage, de plus en plus vite.
  const hauteur = couches.length * ECART + 0.5;
  const COIN = 1.42;
  const coins = [[COIN, COIN], [COIN, -COIN], [-COIN, COIN], [-COIN, -COIN]];
  const geoVias = new BufferGeometry();
  geoVias.setAttribute(
    'position',
    new BufferAttribute(new Float32Array(coins.flatMap(([x, z]) => [x, hauteur / 2, z, x, -hauteur / 2, z])), 3),
  );
  const vias = new LineSegments(geoVias, new LineBasicMaterial({ transparent: true, opacity: 0.22 }));
  pile.add(vias);

  const N = 40;
  const positions = new Float32Array(N * 3);
  const vitesses = new Float32Array(N);
  for (let k = 0; k < N; k++) {
    const [x, z] = coins[k % 4];
    positions[k * 3] = x;
    positions[k * 3 + 1] = (Math.random() - 0.5) * hauteur;
    positions[k * 3 + 2] = z;
    vitesses[k] = 0.3 + Math.random() * 0.35;
  }
  const geoFlux = new BufferGeometry();
  geoFlux.setAttribute('position', new BufferAttribute(positions, 3));
  const flux = new Points(geoFlux, new PointsMaterial({ size: 0.075, transparent: true, opacity: 0.9, depthWrite: false }));
  pile.add(flux);

  // Impulsions : des données qui filent sur une plaque, le long d'un
  // chemin de segments, en traînant quelques échos derrière elles. À
  // l'arrivée, le module visé s'allume.
  const IMPULSIONS = 32;
  const TRAINE = 6;
  const PAS_TRAINE = 0.08;
  const impulsionsMesh = new InstancedMesh(new BoxGeometry(0.09, 0.05, 0.09), new MeshBasicMaterial(), IMPULSIONS * TRAINE);
  impulsionsMesh.frustumCulled = false;
  for (let q = 0; q < IMPULSIONS * TRAINE; q++) impulsionsMesh.setMatrixAt(q, new Matrix4().makeScale(0, 0, 0));
  pile.add(impulsionsMesh);
  type Point2 = [number, number];
  const impulsions = Array.from({ length: IMPULSIONS }, () => ({
    couche: 0, pts: [] as Point2[], long: 0, t: 0, cible: -1, vitesse: 2.2, vivante: false, arrivee: false,
  }));

  const lancer = (couche: number, pts: Point2[], cible = -1, vitesse = 2.2) => {
    const imp = impulsions.find((m) => !m.vivante);
    if (!imp) return;
    let long = 0;
    for (let q = 1; q < pts.length; q++) long += Math.hypot(pts[q][0] - pts[q - 1][0], pts[q][1] - pts[q - 1][1]);
    Object.assign(imp, { couche, pts, long, t: 0, cible, vitesse, vivante: true, arrivee: false });
  };

  const surChemin = (pts: Point2[], d: number): Point2 => {
    for (let q = 1; q < pts.length; q++) {
      const [ax, az] = pts[q - 1];
      const [bx, bz] = pts[q];
      const seg = Math.hypot(bx - ax, bz - az);
      if (d <= seg || q === pts.length - 1) {
        const u = seg ? Math.min(1, d / seg) : 1;
        return [ax + (bx - ax) * u, az + (bz - az) * u];
      }
      d -= seg;
    }
    return pts[0];
  };

  const choisir = <T,>(liste: T[]) => liste[Math.floor(Math.random() * liste.length)];

  // ── Interface : un curseur qui va et clique ──────────────────────────
  // La flèche est dessinée à la main, en triangles : ExtrudeGeometry et
  // Shape alourdiraient le module de 40 Ko pour ce seul curseur.
  const [A, B, C, D, E, F, G] = [[0, 0], [0, -0.34], [0.085, -0.255], [0.15, -0.39], [0.2, -0.365], [0.135, -0.235], [0.25, -0.235]];
  const geoFleche = new BufferGeometry();
  geoFleche.setAttribute(
    'position',
    new BufferAttribute(new Float32Array([A, B, C, A, C, F, A, F, G, C, D, E, C, E, F].flatMap(([x, y]) => [x, y, 0])), 3),
  );
  const fer = new Mesh(geoFleche, new MeshBasicMaterial({ side: DoubleSide }));
  fer.rotation.x = -Math.PI / 2;
  const curseur = new Group(); // tourné pour pointer en haut à gauche, comme à l'écran
  curseur.add(fer);
  curseur.rotation.y = 0.6;
  plaques[INTERFACE].groupe.add(curseur);
  const souris = { x: 0.3, z: -0.1, tx: 0.3, tz: -0.1, cible: 0, pause: 0.6, clic: 0 };
  const ondes = Array.from({ length: 4 }, () => {
    const m = new Mesh(new RingGeometry(0.82, 1, 48), new MeshBasicMaterial({ transparent: true, depthWrite: false, side: DoubleSide }));
    m.rotation.x = -Math.PI / 2;
    m.visible = false;
    plaques[INTERFACE].groupe.add(m);
    return { m, age: 9 };
  });

  // ── Service : les liaisons tracées entre services ────────────────────
  const liaisons: Point2[] = [];
  for (let n = 0; n < 16; n++) {
    if (n % 4 !== 3) liaisons.push([n, n + 1]);
    if (n % 3 === 0 && n + 4 < 16) liaisons.push([n, n + 4]);
  }

  // ── Système : un pointeur qui saute d'un bloc à l'autre ─────────────
  const pointeur = new Mesh(new ConeGeometry(0.055, 0.17, 16), new MeshBasicMaterial());
  pointeur.rotation.x = Math.PI; // pointe vers le bas
  plaques[SYSTEME].groupe.add(pointeur);
  const saut = { de: 0, vers: 1, t: 0 };

  // ── Matériel : des électrons sur les bus de la puce ─────────────────
  const ELECTRONS = 150;
  const electrons = Array.from({ length: ELECTRONS }, () => {
    const horizontal = Math.random() < 0.6;
    return {
      horizontal,
      voie: horizontal ? -0.72 + Math.floor(Math.random() * 7) * 0.24 : -0.96 + Math.floor(Math.random() * 9) * 0.24,
      pos: (Math.random() - 0.5) * 2.4,
      v: (Math.random() < 0.5 ? -1 : 1) * (1.2 + Math.random() * 1.8),
    };
  });
  const posElectrons = new Float32Array(ELECTRONS * 3);
  const geoElectrons = new BufferGeometry();
  geoElectrons.setAttribute('position', new BufferAttribute(posElectrons, 3));
  const nuage = new Points(geoElectrons, new PointsMaterial({ size: 0.1, transparent: true, depthWrite: false }));
  nuage.frustumCulled = false;
  plaques[MATERIEL].groupe.add(nuage);

  // Rideau de lumière qui balaie une couche au moment où elle s'active.
  const rideau = new Mesh(
    new PlaneGeometry(L * 0.94, 0.42),
    new MeshBasicMaterial({ transparent: true, opacity: 0, depthWrite: false, side: DoubleSide }),
  );
  rideau.rotation.y = Math.PI / 2;
  const trait = new Mesh(new BoxGeometry(0.025, 0.025, L * 0.94), new MeshBasicMaterial({ transparent: true }));
  const balayage = new Group();
  balayage.add(rideau, trait);
  rideau.position.y = 0.27;
  trait.position.y = 0.07;
  balayage.visible = false;

  let active = -1;
  let c = { accent: new Color(), raised: new Color(), ink: new Color(), inkSoft: new Color() };
  const police = getComputedStyle(root).getPropertyValue('--font-mono').trim() || 'monospace';

  const peindreEtiquette = (i: number) => {
    const p = plaques[i];
    const g = p.dessin.getContext('2d')!;
    const on = i === active;
    g.clearRect(0, 0, 512, 512);
    g.fillStyle = `#${(on ? c.accent : c.inkSoft).getHexString()}`;
    g.font = `600 46px ${police}`;
    g.fillText(couches[i].toUpperCase(), 44, 466);
    g.font = `500 30px ${police}`;
    g.fillText(String(i + 1).padStart(2, '0'), 44, 78);
    // Trame de points, plus serrée à chaque étage : on descend dans le détail.
    const pasTrame = TRAME[Math.min(i, TRAME.length - 1)];
    g.globalAlpha = on ? 0.35 : 0.18;
    for (let py = 128; py < 400; py += pasTrame)
      for (let px = 40; px < 480; px += pasTrame) g.fillRect(px - 1.5, py - 1.5, 3, 3);
    // Pistes entre les modules : les liaisons entre services, le bus de la puce.
    const vers = (v: number) => ((v + L / 2) / L) * 512;
    g.strokeStyle = g.fillStyle;
    g.lineWidth = 3;
    g.globalAlpha = on ? 0.55 : 0.25;
    const motif = p.motif;
    if (i === SERVICE) {
      motif.forEach(([x, z], n) => {
        const droite = motif[n + 1];
        const dessous = motif[n + 4];
        g.beginPath();
        if (droite && n % 4 !== 3) { g.moveTo(vers(x), vers(z)); g.lineTo(vers(droite[0]), vers(droite[1])); }
        if (dessous && n % 3 === 0) { g.moveTo(vers(x), vers(z)); g.lineTo(vers(dessous[0]), vers(dessous[1])); }
        g.stroke();
      });
    } else if (i >= MATERIEL) {
      // Les bus de la puce, que suivent les électrons.
      g.lineWidth = 2;
      for (let r = 0; r < 7; r++) {
        const zb = vers(-0.72 + r * 0.24);
        g.beginPath();
        g.moveTo(vers(-1.2), zb);
        g.lineTo(vers(1.2), zb);
        g.stroke();
      }
      for (let col = 0; col < 9; col++) {
        const xb = vers(-0.96 + col * 0.24);
        g.beginPath();
        g.moveTo(xb, vers(-0.96));
        g.lineTo(xb, vers(0.96));
        g.stroke();
      }
    }
    g.globalAlpha = 1;
    p.texture.needsUpdate = true;
  };

  const appliquerTheme = () => {
    c = { accent: jeton('--color-accent'), raised: jeton('--color-raised'), ink: jeton('--color-ink'), inkSoft: jeton('--color-ink-soft') };
    flux.material.color.copy(c.accent);
    rideau.material.color.copy(c.accent);
    fer.material.color.copy(c.ink);
    ondes.forEach((o) => o.m.material.color.copy(c.accent));
    pointeur.material.color.copy(c.accent);
    nuage.material.color.copy(c.accent);
    trait.material.color.copy(c.accent);
    vias.material.color.copy(c.ink);
    plaques.forEach((_, i) => peindreEtiquette(i));
    relancer();
  };

  // Les couches au-dessus de l'étape active s'écartent pour la dégager ;
  // l'active avance vers le lecteur et prend l'accent.
  const cible = (i: number) =>
    active < 0
      ? { y: plaques[i].y, x: 0, lum: 0 }
      : { y: plaques[i].y + (i < active ? 0.95 : 0), x: i === active ? 0.6 : 0, lum: i === active ? 1 : 0 };

  const taille = () => {
    const { width, height } = hote.getBoundingClientRect();
    if (!width || !height) return;
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    // Sur un cadre étroit, on recule pour garder la pile entière.
    camera.position.setLength(width / height < 0.9 ? 18.5 : 15.2);
    camera.updateProjectionMatrix();
    relancer();
  };

  let rotationCible = 0;
  let inclinaison = 0;
  hote.closest('section')?.addEventListener('pointermove', (e) => {
    if (calme() || !matchMedia('(pointer: fine)').matches) return;
    const r = hote.getBoundingClientRect();
    rotationCible = ((e.clientX - r.left) / r.width - 0.5) * 0.5;
    inclinaison = ((e.clientY - r.top) / r.height - 0.5) * 0.12;
    relancer();
  });

  // ── Ce qui se passe sur la couche active, couche par couche ─────────
  let minuteur = 0;
  const comportement = (dt: number) => {
    if (active < 0) return;
    const p = plaques[active];
    minuteur -= dt;

    if (active === INTERFACE) {
      // Peu de données ici : quelqu'un qui pointe et qui clique.
      if (souris.pause > 0) {
        souris.pause -= dt;
        if (souris.pause <= 0) {
          const r = Math.random();
          souris.cible = r < 0.6 ? 0 : r < 0.88 ? 1 : 2;
          const [mx, mz, w, d] = p.motif[souris.cible];
          souris.tx = mx + (Math.random() - 0.5) * w * 0.75;
          souris.tz = mz + (Math.random() - 0.5) * d * 0.6;
        }
      } else {
        const a = 1 - Math.pow(0.003, dt);
        souris.x += (souris.tx - souris.x) * a;
        souris.z += (souris.tz - souris.z) * a;
        if (Math.hypot(souris.tx - souris.x, souris.tz - souris.z) < 0.012) {
          souris.clic = 1;
          p.allumes[souris.cible] = 1;
          p.enfonce[souris.cible] = 1;
          const onde = ondes.find((o) => o.age > 0.7) ?? ondes[0];
          onde.age = 0;
          onde.m.position.set(souris.tx, 0.06 + p.motif[souris.cible][4] + 0.01, souris.tz);
          souris.pause = 0.35 + Math.random() * 0.9;
        }
      }
      souris.clic = Math.max(0, souris.clic - dt * 5);
      curseur.position.set(souris.x, 0.34 - souris.clic * 0.12, souris.z);
    }

    if (active === RESEAU && minuteur <= 0) {
      // Des paquets partent des diodes vers l'extérieur ; d'autres arrivent.
      minuteur = 0.1 + Math.random() * 0.22;
      const lame = Math.floor(Math.random() * 4) * 2;
      const z = p.motif[lame][1];
      if (Math.random() < 0.6) {
        p.allumes[lame + 1] = 1;
        lancer(RESEAU, [[1.22, z], [2.8, z]], -1, 3.2);
      } else {
        lancer(RESEAU, [[-2.8, z], [-1.2, z]], lame, 3.2);
      }
    }

    if (active === SERVICE && minuteur <= 0) {
      // Les services s'appellent entre eux, le long des liaisons.
      minuteur = 0.18 + Math.random() * 0.3;
      const [a, b] = Math.random() < 0.5 ? choisir(liaisons) : [...choisir(liaisons)].reverse();
      p.allumes[a] = Math.max(p.allumes[a], 0.6);
      lancer(SERVICE, [[p.motif[a][0], p.motif[a][1]], [p.motif[b][0], p.motif[b][1]]], b, 1.8);
    }

    if (active === SYSTEME) {
      // La mémoire vit : des blocs sont libérés, puis réalloués.
      if (minuteur <= 0) {
        minuteur = 0.25 + Math.random() * 0.35;
        const n = Math.floor(Math.random() * p.motif.length);
        if (!p.libreCible[n] && n !== saut.vers) {
          p.libreCible[n] = 1;
          p.relache[n] = 0.8 + Math.random() * 1.8;
        }
      }
      p.libreCible.forEach((l, n) => {
        if (!l) return;
        p.relache[n] -= dt;
        if (p.relache[n] <= 0) {
          p.libreCible[n] = 0;
          p.allumes[n] = 1;
        }
      });
      // Le pointeur saute d'un bloc alloué à l'autre et le lit en se posant.
      saut.t += dt * 1.5;
      if (saut.t >= 1) {
        p.allumes[saut.vers] = 1;
        p.enfonce[saut.vers] = 0.6;
        saut.de = saut.vers;
        let n = saut.de;
        for (let essai = 0; essai < 8 && (n === saut.de || p.libreCible[n]); essai++) n = Math.floor(Math.random() * p.motif.length);
        saut.vers = n;
        saut.t = 0;
      }
      const u = saut.t < 0.5 ? 2 * saut.t * saut.t : 1 - Math.pow(-2 * saut.t + 2, 2) / 2;
      const [ax, az, , , ah] = p.motif[saut.de];
      const [bx, bz, , , bh] = p.motif[saut.vers];
      pointeur.position.set(
        ax + (bx - ax) * u,
        0.06 + ah + (bh - ah) * u + 0.14 + Math.sin(Math.PI * saut.t) * 0.45,
        az + (bz - az) * u,
      );
    }

    if (active === MATERIEL) {
      // Des électrons filent sur les bus, dans les deux sens.
      electrons.forEach((el, n) => {
        el.pos += el.v * dt;
        if (el.pos > 1.2) el.pos -= 2.4;
        if (el.pos < -1.2) el.pos += 2.4;
        posElectrons[n * 3] = el.horizontal ? el.pos : el.voie;
        posElectrons[n * 3 + 1] = 0.075;
        posElectrons[n * 3 + 2] = el.horizontal ? el.voie : el.pos;
      });
      geoElectrons.attributes.position.needsUpdate = true;
    }

    ondes.forEach((o) => {
      o.age += dt;
      o.m.visible = active === INTERFACE && o.age < 0.7;
      const r = 0.04 + o.age * 0.55;
      o.m.scale.set(r, r, r);
      o.m.material.opacity = Math.max(0, 1 - o.age / 0.7);
    });
  };

  const horloge = new Clock();
  let boucle = 0;
  const pas = () => {
    boucle = 0;
    const dt = Math.min(horloge.getDelta(), 0.05);
    const immobile = calme();
    const k = immobile ? 1 : 1 - Math.pow(0.001, dt); // amorti indépendant de la cadence
    let enMouvement = false;

    plaques.forEach((p, i) => {
      const t = cible(i);
      p.groupe.position.y += (t.y - p.groupe.position.y) * k;
      p.x += (t.x - p.x) * k;
      p.lum += (t.lum - p.lum) * k;
      p.groupe.position.x = p.x * 0.7;
      p.groupe.position.z = p.x * 0.7;
      p.corps.material.color.copy(c.raised).lerp(c.accent, p.lum * 0.16);
      p.corps.material.emissive.copy(c.accent).multiplyScalar(p.lum * 0.08);
      p.arete.material.color.copy(c.ink).lerp(c.accent, p.lum);
      p.arete.material.opacity = 0.28 + p.lum * 0.72;
      if (Math.abs(t.y - p.groupe.position.y) + Math.abs(t.x - p.x) + Math.abs(t.lum - p.lum) > 0.001) enMouvement = true;

      // Les modules de la couche active se lèvent au passage du rideau ;
      // ailleurs, ils restent tassés sur leur plaque.
      const leveCible = i === active ? 1 : 0;
      p.leve = immobile ? leveCible : p.leve + Math.sign(leveCible - p.leve) * Math.min(Math.abs(leveCible - p.leve), dt * 0.9);
      if (p.leve !== leveCible) enMouvement = true;
      const actif = i === active && !immobile;
      p.motif.forEach(([x, z, w, d, h, clignote], n) => {
        const f = Math.min(1, Math.max(0, (p.leve - p.retards[n] * 0.6) / 0.4));
        const e = 1 - Math.pow(1 - f, 3);
        let hh = h * (0.3 + 0.7 * e);
        let lueur = 0;
        // La puce calcule : une onde diagonale la traverse, comme dans un
        // réseau systolique qui multiplie des matrices.
        if (i === MATERIEL && actif) {
          const onde = Math.pow(Math.max(0, Math.sin(horloge.elapsedTime * 2.6 - ((n % 10) + Math.floor(n / 10)) * 0.5)), 4);
          hh *= 1 + onde * 0.8 * e;
          lueur = onde * 0.55 * e;
        }
        // Un module pressé s'enfonce ; un bloc libéré s'aplatit.
        p.enfonce[n] = actif ? Math.max(0, p.enfonce[n] - dt * 4) : 0;
        if (!actif) p.libreCible[n] = 0;
        p.libre[n] += (p.libreCible[n] - p.libre[n]) * Math.min(1, dt * 7);
        hh *= (1 - 0.5 * p.enfonce[n]) * (1 - 0.88 * p.libre[n]);
        matrice.makeScale(w, Math.max(hh, 0.004), d).setPosition(x, 0.06 + hh / 2, z);
        p.modules.setMatrixAt(n, matrice);
        // Les diodes du réseau clignotent d'elles-mêmes ; ailleurs, un module
        // ne s'allume que si quelque chose l'atteint.
        if (actif && clignote && i === RESEAU && Math.random() < dt * 0.8) p.allumes[n] = 1;
        p.allumes[n] = actif ? Math.max(0, p.allumes[n] - dt * 0.9) : 0;
        teinte.copy(c.raised).lerp(c.accent, Math.min(1, e * 0.14 * (1 - p.libre[n]) + p.allumes[n] * 0.8 + lueur));
        p.modules.setColorAt(n, teinte);
      });
      p.modules.instanceMatrix.needsUpdate = true;
      if (p.modules.instanceColor) p.modules.instanceColor.needsUpdate = true;
    });

    // Le rideau suit le front de levée de la couche active.
    const pa = active >= 0 ? plaques[active] : null;
    const front = pa ? pa.leve / 0.6 : 1;
    balayage.visible = !!pa && !immobile && front < 1.08;
    if (balayage.visible) {
      balayage.position.x = -L / 2 + L * Math.min(front, 1);
      const fondu = Math.min(1, front * 6, (1.08 - front) * 8);
      rideau.material.opacity = 0.16 * fondu;
      trait.material.opacity = fondu;
    }

    // La pile glisse pour garder la couche active au centre du cadre.
    const centre = pa ? -pa.y * 0.35 : 0;
    pile.position.y += (centre - pile.position.y) * (immobile ? 1 : k * 0.5);
    if (Math.abs(centre - pile.position.y) > 0.001) enMouvement = true;

    if (!immobile) {
      pile.rotation.y += (rotationCible + Math.sin(horloge.elapsedTime * 0.15) * 0.18 - pile.rotation.y) * k * 0.6;
      pile.rotation.x += (inclinaison - pile.rotation.x) * k * 0.6;
      for (let n = 0; n < N; n++) {
        const profondeur = 0.5 - positions[n * 3 + 1] / hauteur; // 0 en haut, 1 en bas
        const avant = positions[n * 3 + 1];
        positions[n * 3 + 1] -= vitesses[n] * (0.6 + profondeur * 1.6) * dt;
        // Le paquet franchit la couche active : il y entre.
        if (pa && active === SERVICE) {
          const surface = pa.groupe.position.y + 0.06;
          if (avant >= surface && positions[n * 3 + 1] < surface) {
            const x0 = positions[n * 3] - pa.groupe.position.x;
            const z0 = positions[n * 3 + 2] - pa.groupe.position.z;
            const cible = Math.floor(Math.random() * pa.motif.length);
            const [mx, mz] = pa.motif[cible];
            lancer(active, [[x0, z0], [mx, z0], [mx, mz]], cible);
          }
        }
        if (positions[n * 3 + 1] < -hauteur / 2) positions[n * 3 + 1] = hauteur / 2;
      }
      geoFlux.attributes.position.needsUpdate = true;

      comportement(dt);

      impulsions.forEach((imp, m) => {
        if (imp.vivante) {
          imp.t += dt * imp.vitesse;
          if (!imp.arrivee && imp.t >= imp.long) {
            imp.arrivee = true;
            if (imp.cible >= 0) plaques[imp.couche].allumes[imp.cible] = 1;
          }
          if (imp.t > imp.long + TRAINE * PAS_TRAINE || imp.couche !== active) imp.vivante = false;
        }
        const g = plaques[imp.couche].groupe.position;
        for (let q = 0; q < TRAINE; q++) {
          const d = Math.min(imp.t - q * PAS_TRAINE, imp.long);
          const index = m * TRAINE + q;
          if (!imp.vivante || d < 0) {
            matrice.makeScale(0, 0, 0);
          } else {
            const [x, z] = surChemin(imp.pts, d);
            // Au-delà du bord de la plaque, la donnée s'efface en s'éloignant.
            const dehors = Math.max(0, Math.max(Math.abs(x), Math.abs(z)) - L / 2);
            const taille = (1 - q / TRAINE) * Math.max(0, 1 - dehors / 1.1);
            matrice.makeScale(taille, 1, taille).setPosition(g.x + x, g.y + 0.1, g.z + z);
          }
          impulsionsMesh.setMatrixAt(index, matrice);
          impulsionsMesh.setColorAt(index, teinte.copy(c.accent).lerp(c.raised, q / TRAINE));
        }
      });
      impulsionsMesh.instanceMatrix.needsUpdate = true;
      if (impulsionsMesh.instanceColor) impulsionsMesh.instanceColor.needsUpdate = true;
      enMouvement = true;
    }

    curseur.visible = active === INTERFACE;
    pointeur.visible = active === SYSTEME;
    nuage.visible = active === MATERIEL && !immobile;
    if (immobile) {
      // Mouvement réduit : le curseur et le pointeur restent posés.
      curseur.position.set(souris.x, 0.3, souris.z);
      const [px, pz] = plaques[SYSTEME].motif[saut.vers];
      pointeur.position.set(px, 0.36, pz);
    }

    renderer.render(scene, camera);
    // La boucle ne tourne que s'il y a quelque chose à animer et que la pile
    // est à l'écran : immobile ou hors champ, elle ne coûte plus rien.
    if (enMouvement && estVisible() && !document.hidden) boucle = requestAnimationFrame(pas);
  };
  function relancer() {
    if (!boucle) boucle = requestAnimationFrame(pas);
  }

  appliquerTheme();
  taille();
  new ResizeObserver(taille).observe(hote);
  new MutationObserver(appliquerTheme).observe(root, { attributes: true, attributeFilter: ['data-theme'] });
  document.addEventListener('themechange', appliquerTheme);
  document.addEventListener('visibilitychange', relancer);

  return {
    activer(index) {
      if (index === active) return;
      active = index;
      if (active >= 0) plaques[active].groupe.add(balayage);
      plaques.forEach((_, i) => peindreEtiquette(i));
      relancer();
    },
    relancer,
  };
}
