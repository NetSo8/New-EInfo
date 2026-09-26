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
  DirectionalLight,
  EdgesGeometry,
  Group,
  LineBasicMaterial,
  LineSegments,
  Mesh,
  MeshBasicMaterial,
  MeshStandardMaterial,
  PerspectiveCamera,
  PlaneGeometry,
  Points,
  PointsMaterial,
  Scene,
  WebGLRenderer,
} from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';

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
    pile.add(groupe);
    const y = ((couches.length - 1) / 2 - i) * ECART;
    groupe.position.y = y;
    return { groupe, corps, arete, dessin, texture, y, x: 0, lum: 0 };
  });

  // Flux de données qui descend à travers la pile, d'étage en étage.
  const N = 70;
  const hauteur = couches.length * ECART + 1.2;
  const positions = new Float32Array(N * 3);
  const vitesses = new Float32Array(N);
  for (let k = 0; k < N; k++) {
    positions[k * 3] = (Math.random() - 0.5) * 2.2;
    positions[k * 3 + 1] = (Math.random() - 0.5) * hauteur;
    positions[k * 3 + 2] = (Math.random() - 0.5) * 2.2;
    vitesses[k] = 0.25 + Math.random() * 0.45;
  }
  const geoFlux = new BufferGeometry();
  geoFlux.setAttribute('position', new BufferAttribute(positions, 3));
  const flux = new Points(geoFlux, new PointsMaterial({ size: 0.045, transparent: true, opacity: 0.75, depthWrite: false }));
  pile.add(flux);

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
    // Trame discrète : quelques pistes, comme un circuit vu de dessus.
    g.strokeStyle = g.fillStyle;
    g.globalAlpha = on ? 0.5 : 0.22;
    g.lineWidth = 3;
    for (let k = 0; k < 4; k++) {
      const y0 = 150 + k * 60;
      g.beginPath();
      g.moveTo(300 + (k % 2) * 40, y0);
      g.lineTo(440, y0);
      g.lineTo(470, y0 + 30);
      g.stroke();
    }
    g.globalAlpha = 1;
    p.texture.needsUpdate = true;
  };

  const appliquerTheme = () => {
    c = { accent: jeton('--color-accent'), raised: jeton('--color-raised'), ink: jeton('--color-ink'), inkSoft: jeton('--color-ink-soft') };
    flux.material.color.copy(c.accent);
    plaques.forEach((_, i) => peindreEtiquette(i));
    relancer();
  };

  // Les couches au-dessus de l'étape active s'écartent pour la dégager ;
  // l'active avance vers le lecteur et prend l'accent.
  const cible = (i: number) =>
    active < 0
      ? { y: plaques[i].y, x: 0, lum: 0 }
      : { y: plaques[i].y + (i < active ? 0.7 : 0), x: i === active ? 0.6 : 0, lum: i === active ? 1 : 0 };

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
    });

    if (!immobile) {
      pile.rotation.y += (rotationCible + Math.sin(horloge.elapsedTime * 0.15) * 0.18 - pile.rotation.y) * k * 0.6;
      pile.rotation.x += (inclinaison - pile.rotation.x) * k * 0.6;
      for (let n = 0; n < N; n++) {
        positions[n * 3 + 1] -= vitesses[n] * dt;
        if (positions[n * 3 + 1] < -hauteur / 2) positions[n * 3 + 1] = hauteur / 2;
      }
      geoFlux.attributes.position.needsUpdate = true;
      enMouvement = true;
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
      plaques.forEach((_, i) => peindreEtiquette(i));
      relancer();
    },
    relancer,
  };
}
