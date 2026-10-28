import { useState, useEffect, useRef, type ReactNode, type FormEvent, type RefObject } from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useSpring, useMotionValue, useVelocity } from 'motion/react';
import {
  ArrowRight,
  ArrowUpRight,
  Monitor,
  Smartphone,
  PanelsTopLeft,
  X,
  Send,
  Loader2
} from 'lucide-react';

/**
 * CONSTANTS & DATA
 */
const SERVICES = [
  {
    id: 'web',
    name: 'Diseño Web',
    ratio: '1.618',
    tagline: 'Interfaces precisas y funcionales.',
    desc: 'Arquitectura de información, UX/UI y desarrollo front-end. Sitios que se entienden al primer vistazo y crecen sin perder su orden.',
    tags: ['UX/UI', 'React', 'TypeScript', 'SEO técnico'],
    icon: Monitor,
    process: [
      { step: '01', title: 'Análisis de Datos', desc: 'Descomposición de requerimientos y objetivos de usuario.' },
      { step: '02', title: 'Arquitectura', desc: 'Estructuración de flujos y jerarquías de información.' },
      { step: '03', title: 'Resolución Visual', desc: 'Síntesis estética basada en principios geométricos.' },
      { step: '04', title: 'Despliegue', desc: 'Optimización de performance y puesta en producción.' }
    ]
  },
  {
    id: 'app',
    name: 'Desarrollo App',
    ratio: '1',
    tagline: 'Soluciones móviles nativas.',
    desc: 'Aplicaciones y web apps que convierten procesos complejos en flujos simples, del panel de gestión al bolsillo.',
    tags: [],
    icon: Smartphone,
    process: [
      { step: '01', title: 'Definición Lógica', desc: 'Mapeo de funcionalidades y casos de borde.' },
      { step: '02', title: 'Sistemas Core', desc: 'Desarrollo de la infraestructura y lógica de negocio.' },
      { step: '03', title: 'Interfaz Dinámica', desc: 'Implementación de componentes reactivos y animaciones.' },
      { step: '04', title: 'Iteración', desc: 'Testeo de estrés y refinamiento continuo.' }
    ]
  },
  {
    id: 'brand',
    name: 'Identidad Visual',
    ratio: '0.618',
    tagline: 'Sistemas gráficos analíticos.',
    desc: 'Marcas construidas sobre geometría: retículas y proporciones que sostienen cada pieza, de la pantalla a la gran escala.',
    tags: [],
    icon: PanelsTopLeft,
    process: [
      { step: '01', title: 'Abstracción', desc: 'Identificación de los axiomas centrales de la marca.' },
      { step: '02', title: 'Geometrización', desc: 'Construcción técnica de símbolos y logotipos.' },
      { step: '03', title: 'Sistema Gráfico', desc: 'Desarrollo de paletas y tipografías coherentes.' },
      { step: '04', title: 'Manual de Uso', desc: 'Protocolos de aplicación y escalabilidad.' }
    ]
  },
];

const METHOD = [
  { mult: '×1', title: 'Análisis', desc: 'Descomponemos el problema en sus axiomas: objetivo, público, restricciones y datos reales. Primero entender, después diseñar.' },
  { mult: '×φ', title: 'Síntesis', desc: 'Cruzamos referencias, datos e intuición. Como en una sinapsis, cada nueva relación abre un camino que antes no existía.' },
  { mult: '×φ²', title: 'Resolución', desc: 'Ordenamos la idea con retícula, jerarquía y ritmo. La solución final es simple porque todo lo complejo quedó resuelto antes.' },
];

const PROJECTS = [
  {
    id: 'summa',
    title: 'Summa',
    category: 'Web App',
    year: '2025',
    tech: ['React', 'Cloud Run', 'Tailwind'],
    desc: 'Plataforma de gestión empresarial con arquitectura cloud escalable.',
    img: '/summa.png',
    url: 'https://summa-version-de-muestra-1031727346698.us-west1.run.app/'
  },
  {
    id: 'cioflex',
    title: 'Cioflex',
    category: 'Web',
    year: '2025',
    tech: ['HTML5', 'CSS', 'JS', 'SEO'],
    desc: 'Arquitectura de información y SEO técnico para especialistas en cartelería corporativa.',
    img: '/cioflex.png',
    url: 'https://www.cioflex.com.ar/'
  },
  {
    id: 'controlx',
    title: 'ControlX Syncro',
    category: 'Dashboard',
    year: '2024',
    tech: ['React', 'D3.js', 'GitHub Pages'],
    desc: 'Sistema de monitoreo y sincronización de procesos industriales en tiempo real.',
    img: '/syncro.png',
    url: 'https://fspdev.github.io/controlx-syncro2/'
  }
];

const NAV = [
  { href: '#capacidades', label: 'Capacidades' },
  { href: '#metodo', label: 'Método' },
  { href: '#proyectos', label: 'Proyectos' },
  { href: '#filosofia', label: 'Filosofía' },
];

const FIBONACCI = [1, 1, 2, 3, 5, 8, 13, 21, 34];

// Nodos sinápticos sobre el cerebro (coordenadas de la imagen 1536×1024)
const SYNAPSES: [number, number][] = [
  [560, 330], [705, 255], [780, 405], [905, 240], [1010, 330], [1140, 300],
  [610, 520], [800, 555], [955, 470], [1095, 525], [1235, 430],
  [700, 690], [885, 650], [1065, 625],
];
const SYNAPSE_LINKS: [number, number][] = [
  [0, 1], [1, 2], [1, 3], [3, 4], [4, 5], [2, 4], [0, 6], [6, 7], [2, 7],
  [7, 8], [8, 4], [8, 9], [9, 10], [5, 10], [6, 11], [11, 12], [7, 12], [12, 13], [9, 13],
];

/**
 * COMPONENTS
 */

function useFinePointer() {
  const [fine, setFine] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(pointer: fine)');
    const update = () => setFine(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);
  return fine;
}

/**
 * Cursor: punto instantáneo + anillo con resorte que se estira según la velocidad,
 * unidos por un filamento (la "sinapsis"). Reacciona a links y a [data-cursor="Etiqueta"].
 */
const CustomCursor = () => {
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const ringX = useSpring(x, { stiffness: 380, damping: 30, mass: 0.6 });
  const ringY = useSpring(y, { stiffness: 380, damping: 30, mass: 0.6 });
  const vx = useVelocity(ringX);
  const vy = useVelocity(ringY);
  const stretch = useTransform(() => Math.min(Math.hypot(vx.get(), vy.get()) / 2600, 0.5));
  const scaleX = useTransform(stretch, (s) => 1 + s);
  const scaleY = useTransform(stretch, (s) => 1 - s * 0.55);
  const rotate = useTransform(() => (Math.atan2(vy.get(), vx.get()) * 180) / Math.PI);
  const filament = useTransform(stretch, [0, 0.08, 0.5], [0, 0.35, 0.9]);

  const [mode, setMode] = useState<'idle' | 'hover' | 'label'>('idle');
  const [label, setLabel] = useState('');
  const [pressed, setPressed] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    document.documentElement.classList.add('has-custom-cursor');
    const move = (e: PointerEvent) => { x.set(e.clientX); y.set(e.clientY); setVisible(true); };
    const over = (e: PointerEvent) => {
      const el = e.target as HTMLElement;
      const labelled = el.closest<HTMLElement>('[data-cursor]');
      if (labelled) { setMode('label'); setLabel(labelled.dataset.cursor ?? ''); }
      else setMode(el.closest('a, button, input, textarea, label') ? 'hover' : 'idle');
    };
    const down = () => setPressed(true);
    const up = () => setPressed(false);
    const leave = () => setVisible(false);
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerover', over);
    window.addEventListener('pointerdown', down);
    window.addEventListener('pointerup', up);
    document.documentElement.addEventListener('pointerleave', leave);
    return () => {
      document.documentElement.classList.remove('has-custom-cursor');
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerover', over);
      window.removeEventListener('pointerdown', down);
      window.removeEventListener('pointerup', up);
      document.documentElement.removeEventListener('pointerleave', leave);
    };
  }, [x, y]);

  const size = mode === 'label' ? 86 : mode === 'hover' ? 54 : 30;
  const fill = mode === 'label' ? 'rgba(200,119,42,0.94)' : mode === 'hover' ? 'rgba(200,119,42,0.14)' : 'rgba(200,119,42,0)';

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-[9999] transition-opacity duration-300" style={{ opacity: visible ? 1 : 0 }}>
      <svg className="absolute inset-0 w-full h-full overflow-visible">
        <motion.line x1={x} y1={y} x2={ringX} y2={ringY} stroke="#C8772A" strokeWidth="1" strokeLinecap="round" style={{ opacity: filament }} />
      </svg>
      <motion.div className="absolute top-0 left-0 w-0 h-0 flex items-center justify-center" style={{ x: ringX, y: ringY }}>
        <motion.div className="flex items-center justify-center" style={{ rotate, scaleX, scaleY }}>
          <motion.div
            className="flex-none rounded-full border border-signal"
            animate={{ width: size, height: size, backgroundColor: fill, scale: pressed ? 0.78 : 1 }}
            transition={{ type: 'spring', stiffness: 320, damping: 22 }}
          />
        </motion.div>
        <AnimatePresence>
          {mode === 'label' && (
            <motion.span
              key={label}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              className="absolute font-mono uppercase text-[10px] tracking-[0.18em] text-cream whitespace-nowrap"
            >
              {label}
            </motion.span>
          )}
        </AnimatePresence>
      </motion.div>
      <motion.div className="absolute top-0 left-0 w-0 h-0 flex items-center justify-center" style={{ x, y }}>
        <motion.span
          className="block flex-none rounded-full bg-signal"
          animate={{ width: mode === 'idle' ? 6 : 0, height: mode === 'idle' ? 6 : 0 }}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        />
      </motion.div>
    </div>
  );
};

// Botón "magnético": se desplaza levemente hacia el puntero
const Magnetic = ({ children, strength = 0.3 }: { children: ReactNode; strength?: number }) => {
  const ref = useRef<HTMLDivElement>(null);
  const mx = useSpring(0, { stiffness: 220, damping: 14, mass: 0.4 });
  const my = useSpring(0, { stiffness: 220, damping: 14, mass: 0.4 });
  return (
    <motion.div
      ref={ref}
      className="inline-flex"
      style={{ x: mx, y: my }}
      onPointerMove={(e) => {
        if (e.pointerType !== 'mouse' || !ref.current) return;
        const r = ref.current.getBoundingClientRect();
        mx.set((e.clientX - (r.left + r.width / 2)) * strength);
        my.set((e.clientY - (r.top + r.height / 2)) * strength);
      }}
      onPointerLeave={() => { mx.set(0); my.set(0); }}
    >
      {children}
    </motion.div>
  );
};

/**
 * LOGO QUE SE TRANSFORMA
 * Arranca grande y apilado en el centro del intro (3 / regla / LIBRAS) y, con el scroll,
 * vuela al hueco de la navbar: la regla gira 90° hasta quedar como separador "3 | LIBRAS".
 */
const BIG_3 = 200;
const BIG_LIBRAS = 34;
const SMALL_3 = 22;
const SMALL_LIBRAS = 11;
const LOGO_GAP = 12;
const LIBRAS = 'LIBRAS'.split('');

type LogoGeo = { w3: number; wL: number; hL: number; vw: number; vh: number; tx: number; ty: number };

const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

const TransformingLogo = ({ slotRef, onSlotWidth }: { slotRef: RefObject<HTMLAnchorElement | null>; onSlotWidth: (w: number) => void }) => {
  const threeRef = useRef<HTMLSpanElement>(null);
  const librasRef = useRef<HTMLSpanElement>(null);
  const geo = useRef<LogoGeo | null>(null);

  const { scrollY } = useScroll();
  const raw = useTransform(scrollY, (v) => Math.min(Math.max(v / (window.innerHeight * 0.7), 0), 1));
  const progress = useSpring(raw, { stiffness: 90, damping: 20, mass: 0.7 });
  const px = useSpring(0, { stiffness: 60, damping: 18 });
  const py = useSpring(0, { stiffness: 60, damping: 18 });

  const tX = useMotionValue(0), tY = useMotionValue(0), tS = useMotionValue(1);
  const rX = useMotionValue(0), rY = useMotionValue(0), rW = useMotionValue(0), rH = useMotionValue(2), rR = useMotionValue(0);
  const lX = useMotionValue(0), lY = useMotionValue(0), lS = useMotionValue(1);
  const glow = useTransform(progress, [0, 0.6], [1, 0]);
  const glowShadow = useTransform(glow, (gl) => `0 0 ${18 * gl}px ${3 * gl}px rgba(200,119,42,${0.55 * gl})`);
  const [ready, setReady] = useState(false);

  const apply = () => {
    const g = geo.current;
    if (!g) return;
    const p = progress.get();
    const fit = Math.min(1, (g.vw - 48) / Math.max(g.w3, g.wL));
    const s3s = SMALL_3 / BIG_3, sLs = SMALL_LIBRAS / BIG_LIBRAS;

    // Estado grande (apilado y centrado), con paralaje del puntero en distintas profundidades
    const h3 = BIG_3 * fit, hL = g.hL * fit, gapA = 20 * fit, gapB = 22 * fit;
    const top = g.vh / 2 - (h3 + gapA + 2 + gapB + hL) / 2;
    const cx = g.vw / 2;
    const par = 1 - p, ox = px.get() * par, oy = py.get() * par;
    const big = {
      t: { x: cx - (g.w3 * fit) / 2 + ox * 22, y: top + oy * 16 },
      r: { cx: cx + ox * 12, cy: top + h3 + gapA + 1 + oy * 9, len: g.wL * fit * 0.618, th: 2 },
      l: { x: cx - (g.wL * fit) / 2 + ox * 7, y: top + h3 + gapA + 2 + gapB + oy * 5 },
    };
    // Estado chico (en línea dentro de la navbar)
    const ruleX = g.tx + g.w3 * s3s + LOGO_GAP;
    const small = {
      t: { x: g.tx, y: g.ty - SMALL_3 / 2 },
      r: { cx: ruleX + 0.5, cy: g.ty, len: 20, th: 1 },
      l: { x: ruleX + 1 + LOGO_GAP, y: g.ty - (g.hL * sLs) / 2 },
    };

    tX.set(lerp(big.t.x, small.t.x, p)); tY.set(lerp(big.t.y, small.t.y, p)); tS.set(lerp(fit, s3s, p));
    const len = lerp(big.r.len, small.r.len, p), th = lerp(big.r.th, small.r.th, p);
    rW.set(len); rH.set(th);
    rX.set(lerp(big.r.cx, small.r.cx, p) - len / 2); rY.set(lerp(big.r.cy, small.r.cy, p) - th / 2);
    rR.set(90 * p);
    lX.set(lerp(big.l.x, small.l.x, p)); lY.set(lerp(big.l.y, small.l.y, p)); lS.set(lerp(fit, sLs, p));
  };

  useEffect(() => {
    let raf = 0;
    const measure = () => {
      if (!threeRef.current || !librasRef.current) return;
      const w3 = threeRef.current.offsetWidth;
      const wL = librasRef.current.offsetWidth;
      const hL = librasRef.current.offsetHeight;
      onSlotWidth(Math.ceil(w3 * (SMALL_3 / BIG_3) + LOGO_GAP * 2 + 1 + wL * (SMALL_LIBRAS / BIG_LIBRAS)));
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const slot = slotRef.current?.getBoundingClientRect();
        geo.current = {
          w3, wL, hL,
          vw: window.innerWidth, vh: window.innerHeight,
          tx: slot?.left ?? 16, ty: slot ? slot.top + slot.height / 2 : 32,
        };
        apply();
        setReady(true);
      });
    };
    measure();
    document.fonts?.ready.then(measure);
    window.addEventListener('resize', measure);
    const unsub = [progress.on('change', apply), px.on('change', apply), py.on('change', apply)];
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return;
      px.set(e.clientX / window.innerWidth - 0.5);
      py.set(e.clientY / window.innerHeight - 0.5);
    };
    window.addEventListener('pointermove', onMove);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', measure);
      window.removeEventListener('pointermove', onMove);
      unsub.forEach((u) => u());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div aria-hidden="true" className="fixed inset-0 z-[60] pointer-events-none" style={{ visibility: ready ? 'visible' : 'hidden' }}>
      <motion.div className="absolute top-0 left-0 origin-top-left" style={{ x: tX, y: tY, scale: tS }}>
        <motion.span
          ref={threeRef}
          className="logo-shimmer block font-display leading-none select-none"
          style={{ fontSize: BIG_3 }}
          initial={{ opacity: 0, y: 40, filter: 'blur(18px)' }}
          animate={ready ? { opacity: 1, y: 0, filter: 'blur(0px)' } : undefined}
          transition={{ duration: 1.3, ease: [0.22, 1, 0.36, 1] }}
        >
          3
        </motion.span>
      </motion.div>

      <motion.div className="absolute top-0 left-0" style={{ x: rX, y: rY, width: rW, height: rH, rotate: rR }}>
        <motion.div
          className="w-full h-full bg-signal"
          style={{ boxShadow: glowShadow }}
          initial={{ scaleX: 0 }}
          animate={ready ? { scaleX: 1 } : undefined}
          transition={{ duration: 1.1, delay: 0.45, ease: [0.65, 0, 0.35, 1] }}
        />
      </motion.div>

      <motion.div className="absolute top-0 left-0 origin-top-left" style={{ x: lX, y: lY, scale: lS }}>
        <span ref={librasRef} className="flex font-display leading-none whitespace-nowrap text-ink-soft" style={{ fontSize: BIG_LIBRAS }}>
          {LIBRAS.map((ch, i) => (
            <motion.span
              key={i}
              className="inline-block"
              style={{ paddingRight: i < LIBRAS.length - 1 ? '0.35em' : 0 }}
              initial={{ opacity: 0, y: '0.7em', rotateX: -80 }}
              animate={ready ? { opacity: 1, y: 0, rotateX: 0 } : undefined}
              transition={{ duration: 0.8, delay: 0.75 + i * 0.07, ease: [0.22, 1, 0.36, 1] }}
            >
              {ch}
            </motion.span>
          ))}
        </span>
      </motion.div>
    </div>
  );
};

// Pantalla de entrada: espiral de círculos áureos que se dibuja detrás del logo
const GOLDEN_RADII = [377, 233, 144, 89, 55, 34, 21];

const Intro = () => {
  const { scrollY } = useScroll();
  const fade = useTransform(scrollY, [0, 450], [1, 0]);
  const spin = useTransform(scrollY, [0, 900], [0, 70]);
  return (
    <section className="sketch-bg relative h-[100svh] overflow-hidden" style={{ ['--sketch-tint' as string]: 'rgba(243, 218, 162, 0.78)' }}>
      <motion.div className="absolute inset-0 flex items-center justify-center" style={{ opacity: fade, rotate: spin }}>
        <svg viewBox="0 0 1000 1000" className="w-[150vmax] h-[150vmax] max-w-none text-signal intro-spin" aria-hidden="true">
          {GOLDEN_RADII.map((r, i) => (
            <motion.circle
              key={r}
              cx={877 - r} cy={500} r={r}
              fill="none" stroke="currentColor"
              strokeWidth={1.1 - i * 0.12}
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 0.55 }}
              transition={{ duration: 2.2, delay: 0.2 + i * 0.18, ease: [0.65, 0, 0.35, 1] }}
            />
          ))}
          <motion.line x1="123" y1="500" x2="877" y2="500" stroke="currentColor" strokeWidth="0.4" strokeDasharray="4 6"
            initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 2.4, delay: 0.6 }} />
        </svg>
      </motion.div>

      <motion.div style={{ opacity: fade }} className="absolute bottom-8 inset-x-0 flex flex-col items-center gap-3 label-mono text-ink-soft">
        <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.8 }}>Estudio de diseño y desarrollo · Ø 1.618</motion.span>
        <span className="relative block w-px h-12 overflow-hidden bg-ink/15">
          <span className="scroll-hint absolute inset-x-0 top-0 h-1/2 bg-signal" />
        </span>
      </motion.div>
    </section>
  );
};

const Navbar = ({ onContact, slotRef, slotWidth }: { onContact: () => void; slotRef: RefObject<HTMLAnchorElement | null>; slotWidth: number }) => {
  const { scrollY } = useScroll();
  const bar = useTransform(scrollY, (v) => Math.min(Math.max((v - window.innerHeight * 0.35) / (window.innerHeight * 0.35), 0), 1));
  return (
    <header className="fixed top-0 inset-x-0 z-50">
      <motion.div className="absolute inset-0 bg-paper/85 backdrop-blur-md border-b border-line/50" style={{ opacity: bar }} />
      <div className="relative max-w-6xl mx-auto px-4 sm:px-8 h-16 flex items-center justify-between">
        {/* Hueco donde aterriza el logo animado (el logo real es decorativo y no recibe clics) */}
        <a ref={slotRef} href="#top" aria-label="3 Libras — inicio" className="block h-6" style={{ width: slotWidth }} />
        <nav className="flex items-center gap-8">
          <ul className="hidden md:flex items-center gap-8">
            {NAV.map((n) => (
              <li key={n.href}>
                <a href={n.href} className="nav-link uppercase text-[11px] tracking-[0.18em] text-ink hover:text-signal transition-colors">
                  {n.label}
                </a>
              </li>
            ))}
          </ul>
          <Magnetic>
            <button onClick={onContact} className="border border-ink/60 px-4 py-2 uppercase text-[11px] tracking-[0.18em] font-semibold hover:bg-ink hover:text-cream transition-colors">
              Hablemos
            </button>
          </Magnetic>
        </nav>
      </div>
    </header>
  );
};

const SynapticBrain = () => (
  <div className="relative w-full aspect-[3/2] scale-[1.12] origin-center">
    <img
      src="/brain.webp"
      alt="Cerebro de papel plegado"
      className="absolute inset-0 w-full h-full object-contain mix-blend-multiply"
    />
    <svg viewBox="0 0 1536 1024" className="absolute inset-0 w-full h-full" aria-hidden="true">
      {SYNAPSE_LINKS.map(([a, b], i) => (
        <line
          key={i}
          x1={SYNAPSES[a][0]} y1={SYNAPSES[a][1]}
          x2={SYNAPSES[b][0]} y2={SYNAPSES[b][1]}
          stroke="#FFF6DE"
          strokeWidth="1.5"
          className="synapse-line"
          style={{ opacity: 0.55, animationDelay: `${i * 0.13}s` }}
        />
      ))}
      {SYNAPSES.map(([x, y], i) => (
        <circle
          key={i}
          cx={x} cy={y} r="7"
          fill="#FFF8E6"
          className="synapse-node"
          style={{ animationDelay: `${(i * 0.37) % 3}s`, filter: 'drop-shadow(0 0 6px rgba(255,240,200,.9))' }}
        />
      ))}
    </svg>
  </div>
);

const FibonacciRuler = () => (
  <div className="border-y border-line/70 bg-paper-2/60" aria-hidden="true">
    <div className="max-w-6xl mx-auto px-4 sm:px-8 flex h-9">
      {FIBONACCI.map((n, i) => (
        <div key={i} className="border-l border-line/70 pl-1.5 flex items-center label-mono text-ink-soft min-w-0" style={{ flexGrow: n, flexBasis: 0 }}>
          <span className="truncate">{n}</span>
        </div>
      ))}
      <div className="border-x border-line/70 flex items-center justify-end pr-2 label-mono text-ink-soft" style={{ flexGrow: 8, flexBasis: 0 }}>
        → ∞
      </div>
    </div>
  </div>
);

const SectionHeader = ({ prefix, label, title, light = false }: { prefix: string; label: string; title: ReactNode; light?: boolean }) => (
  <div>
    <div className={`eyebrow ${light ? 'text-cream/70' : 'text-ink-soft'}`}>
      <span>{prefix}</span>
      <span>{label}</span>
    </div>
    <h2 className={`mt-4 text-[32px] sm:text-[40px] leading-[1.12] ${light ? 'text-cream' : 'text-ink'}`}>{title}</h2>
  </div>
);

// Retícula áurea superpuesta en las capturas de proyectos (varía por índice como en el diseño)
const GoldenOverlay = ({ variant }: { variant: number }) => {
  const paths = [
    'M618 0V618 M618 382H1000 M618 382V618 M764 382V618 M618 472H764 M673 382V472',
    'M382 0V618 M0 382H382 M236 382V618 M236 472H382 M291 382V472',
    'M382 0V618 M0 236H382 M236 0V236 M236 146H382 M291 146V236',
  ];
  return (
    <svg viewBox="0 0 1000 618" preserveAspectRatio="none" className="absolute inset-0 w-full h-full pointer-events-none" aria-hidden="true">
      <path d={paths[variant % paths.length]} stroke="#C9A86B" strokeWidth="1.5" fill="none" vectorEffect="non-scaling-stroke" />
    </svg>
  );
};

const GoldenDiagram = () => (
  <figure className="w-full max-w-md lg:ml-auto">
    <svg viewBox="0 0 420 300" className="w-full" aria-label="Rectángulo áureo: (a + b) / a = a / b = φ">
      <g stroke="#7A6347" strokeWidth="1" fill="none">
        <path d="M10 18H410 M10 13V23 M410 13V23" />
      </g>
      <text x="210" y="10" textAnchor="middle" className="font-mono" fontSize="11" fill="#5A4632">a + b</text>
      <rect x="10" y="32" width="400" height="247" fill="rgba(246,227,184,.55)" stroke="#5A4632" strokeWidth="1.2" />
      <g stroke="#C8772A" strokeWidth="1.2" fill="none">
        <path d="M257 32V279" />
        <path d="M257 185H410 M316 185V279 M257 222H316" />
      </g>
      <path d="M10 32L257 279" stroke="#7A6347" strokeWidth=".8" strokeDasharray="3 4" />
      <text x="133" y="296" textAnchor="middle" fontSize="11" fill="#C8772A" className="font-mono">a</text>
      <text x="333" y="296" textAnchor="middle" fontSize="11" fill="#5A4632" className="font-mono">b</text>
    </svg>
    <figcaption className="mt-4">
      <p className="font-mono text-[13px] text-ink">(a + b) / a = a / b = <span className="text-signal">φ</span></p>
      <p className="label-mono text-ink-soft mt-1">La proporción que ordena la intuición.</p>
    </figcaption>
  </figure>
);

const Modal = ({ onClose, children, wide = false }: { onClose: () => void; children: ReactNode; wide?: boolean }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    onClick={onClose}
    className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-ink/70 backdrop-blur-sm"
  >
    <motion.div
      initial={{ y: 16, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 16, opacity: 0 }}
      onClick={(e) => e.stopPropagation()}
      className={`relative w-full ${wide ? 'max-w-4xl' : 'max-w-xl'} max-h-[90vh] overflow-y-auto bg-paper border border-line p-8 sm:p-12 shadow-2xl`}
    >
      <button onClick={onClose} aria-label="Cerrar" className="absolute top-6 right-6 text-ink-soft hover:text-signal transition-colors">
        <X className="w-5 h-5" />
      </button>
      {children}
    </motion.div>
  </motion.div>
);

const ServiceDetail = ({ service, onClose }: { service: typeof SERVICES[0]; onClose: () => void }) => (
  <Modal onClose={onClose} wide>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
      <div>
        <span className="label-mono text-signal">Protocolo // {service.id}</span>
        <h3 className="text-[34px] leading-none mt-3 mb-6">{service.name}</h3>
        <p className="text-sm leading-relaxed text-ink-soft">{service.desc}</p>
        <service.icon className="w-12 h-12 text-signal opacity-40 mt-8" strokeWidth={1.25} />
      </div>
      <div className="md:col-span-2 space-y-5">
        {service.process.map((p, i) => (
          <motion.div
            key={p.step}
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: i * 0.08 }}
            className="group flex items-start gap-6 border-l border-line pl-6 py-2 hover:border-signal transition-colors"
          >
            <span className="font-mono text-[11px] text-signal pt-1">{p.step}</span>
            <div>
              <h4 className="uppercase text-[13px] tracking-[0.18em] font-semibold mb-1 group-hover:text-signal transition-colors">{p.title}</h4>
              <p className="text-[13px] text-ink-soft leading-relaxed">{p.desc}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </Modal>
);

const ContactForm = ({ onClose }: { onClose: () => void }) => {
  const [status, setStatus] = useState<'idle' | 'sending' | 'success'>('idle');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setStatus('sending');

    // Simulating email send to 3libras.studio@gmail.com
    // In a real scenario, you would use Formspree or a backend API
    await new Promise(resolve => setTimeout(resolve, 2000));
    setStatus('success');
    setTimeout(() => {
      onClose();
      setStatus('idle');
    }, 2500);
  };

  const field = 'w-full bg-transparent border-b border-ink/25 py-3 focus:border-signal outline-none transition-colors text-ink placeholder:text-ink/35';

  return (
    <Modal onClose={onClose}>
      {status === 'success' ? (
        <div className="py-16 text-center">
          <Send className="w-10 h-10 text-signal mx-auto mb-6" strokeWidth={1.25} />
          <h3 className="text-[28px]">Mensaje sincronizado</h3>
          <p className="label-mono text-ink-soft mt-3">Responderemos a la brevedad.</p>
        </div>
      ) : (
        <>
          <span className="label-mono text-signal">Punto de sincronización</span>
          <h3 className="text-[32px] mt-2 mb-10">Iniciar un proyecto</h3>
          <form onSubmit={handleSubmit} className="space-y-7">
            <label className="block">
              <span className="label-mono text-ink-soft">Nombre / Organización</span>
              <input required type="text" className={field} placeholder="Escribí aquí..." />
            </label>
            <label className="block">
              <span className="label-mono text-ink-soft">Email de retorno</span>
              <input required type="email" className={field} placeholder="email@ejemplo.com" />
            </label>
            <label className="block">
              <span className="label-mono text-ink-soft">Mensaje / Requerimiento</span>
              <textarea required rows={4} className={`${field} resize-none`} placeholder="Contanos qué querés resolver..." />
            </label>
            <button type="submit" disabled={status === 'sending'} className="btn-primary w-full group">
              {status === 'sending' ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>Transmitir <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" /></>
              )}
            </button>
          </form>
        </>
      )}
    </Modal>
  );
};

const reveal = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-80px' },
  transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const },
};

export default function App() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<typeof SERVICES[0] | null>(null);
  const openForm = () => setIsFormOpen(true);
  const finePointer = useFinePointer();
  const logoSlot = useRef<HTMLAnchorElement>(null);
  const [slotWidth, setSlotWidth] = useState(120);

  return (
    <div id="top" className="min-h-screen bg-paper text-ink font-sans overflow-x-hidden">
      {finePointer && <CustomCursor />}
      <Navbar onContact={openForm} slotRef={logoSlot} slotWidth={slotWidth} />
      <TransformingLogo slotRef={logoSlot} onSlotWidth={setSlotWidth} />
      <Intro />

      <AnimatePresence>
        {isFormOpen && <ContactForm onClose={() => setIsFormOpen(false)} />}
        {selectedService && <ServiceDetail service={selectedService} onClose={() => setSelectedService(null)} />}
      </AnimatePresence>

      {/* HERO */}
      <section className="sketch-bg pt-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-8 pt-16 lg:pt-20 pb-10 grid lg:grid-cols-[1fr_1.35fr] gap-8 items-center">
          <motion.div {...reveal}>
            <p className="label-mono text-ink-soft flex items-center gap-3">
              <span className="whitespace-nowrap">Ø 1.618</span> <span className="w-10 h-px shrink-0 bg-ink-soft/60" /> Estudio de diseño y desarrollo
            </p>
            <h1 className="mt-6 text-[44px] sm:text-[56px] leading-[1.05] tracking-[-0.03em]">
              Creatividad<br />que conecta.<br />
              <span className="text-ember font-normal">Soluciones en<br />proporción.</span>
            </h1>
            <p className="mt-6 max-w-md text-[15px] leading-relaxed text-ink">
              Pensamos como una red neuronal y construimos como una ecuación: conectamos ideas, datos e intuición, y les damos la forma exacta para resolver lo que tu proyecto necesita.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Magnetic>
                <button onClick={openForm} className="btn-primary group">
                  Iniciar un proyecto <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </Magnetic>
              <Magnetic>
                <a href="#metodo" className="btn-ghost">Ver el método</a>
              </Magnetic>
            </div>
            <p className="mt-8 label-mono text-ink-soft">Diseño web — Desarrollo app — Identidad visual</p>
          </motion.div>

          <motion.div initial={{ opacity: 0, scale: 0.96 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 1.2, delay: 0.2 }}>
            <SynapticBrain />
          </motion.div>
        </div>
        <div className="max-w-6xl mx-auto px-4 sm:px-8 pb-6 hidden sm:flex justify-end gap-24 label-mono text-ink-soft">
          <span>Cada pliegue, una conexión posible.</span>
          <span>Análisis → Síntesis → Resolución</span>
        </div>
      </section>

      <FibonacciRuler />

      {/* 01 CAPACIDADES */}
      <section id="capacidades" className="sketch-bg py-20 sm:py-24 scroll-mt-16" style={{ ['--sketch-tint' as string]: 'rgba(243, 218, 162, 0.72)' }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-8">
          <motion.div {...reveal} className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <SectionHeader prefix="01" label="Capacidades" title={<>Tres disciplinas, un mismo<br className="hidden sm:block" /> sistema de pensamiento.</>} />
            <span className="label-mono text-ink-soft">Retícula 1 : 0,618</span>
          </motion.div>

          <div className="mt-10 grid grid-cols-1 md:grid-cols-[1.618fr_1fr] md:grid-rows-2 gap-4">
            {SERVICES.map((s, i) => (
              <motion.button
                key={s.id}
                {...reveal}
                transition={{ ...reveal.transition, delay: i * 0.1 }}
                onClick={() => setSelectedService(s)}
                data-cursor="Abrir"
                className={`group flex flex-col justify-start text-left bg-card/90 border border-line/80 p-6 sm:p-7 hover:border-signal hover:bg-cream/80 transition-colors ${i === 0 ? 'md:row-span-2' : ''}`}
              >
                <div className="flex justify-between items-start">
                  <s.icon className="w-6 h-6 text-signal" strokeWidth={1.25} />
                  <span className="font-mono text-[10px] text-ink-soft">{s.ratio}</span>
                </div>
                <h3 className="mt-5 uppercase text-[12px] tracking-[0.22em] font-semibold">{s.name}</h3>
                <p className={`mt-3 ${i === 0 ? 'text-[20px]' : 'text-[17px]'} font-light`}>{s.tagline}</p>
                <p className="mt-4 text-[13px] leading-relaxed text-ink-soft max-w-md">{s.desc}</p>
                {s.tags.length > 0 && (
                  <div className="mt-5 flex flex-wrap gap-2">
                    {s.tags.map((t) => <span key={t} className="chip">{t}</span>)}
                  </div>
                )}
                <span className="mt-6 inline-flex items-center gap-2 label-mono text-signal opacity-0 group-hover:opacity-100 transition-opacity">
                  Ver protocolo <ArrowRight className="w-3 h-3" />
                </span>
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      {/* 02 MÉTODO */}
      <section id="metodo" className="bg-ink text-cream py-20 sm:py-24 scroll-mt-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-8">
          <motion.div {...reveal} className="grid lg:grid-cols-[1.618fr_1fr] gap-8 items-end">
            <SectionHeader
              light
              prefix="02"
              label="Método"
              title={<>Pensar como una red.<br /><span className="text-[#E9A866]">Resolver como una ecuación.</span></>}
            />
            <p className="text-[14px] leading-relaxed text-cream/75">
              La creatividad no es un destello aislado: es una conexión nueva entre ideas que ya existían. Nuestro proceso multiplica esas conexiones y después las ordena con proporción, hasta que la solución encaja.
            </p>
          </motion.div>

          <div className="mt-14 grid md:grid-cols-3 gap-10 md:gap-6">
            {METHOD.map((m, i) => (
              <motion.div key={m.title} {...reveal} transition={{ ...reveal.transition, delay: i * 0.15 }}>
                <div className="flex items-center gap-3 h-6">
                  <span className="relative flex items-center justify-center shrink-0" style={{ width: 12 + i * 6, height: 12 + i * 6 }}>
                    {i > 0 && <span className="absolute inset-0 rounded-full border border-signal" />}
                    {i > 1 && <span className="absolute inset-[3px] rounded-full border border-signal/60" />}
                    <span className={`rounded-full ${i === 2 ? 'bg-cream' : 'bg-signal'}`} style={{ width: 8, height: 8 }} />
                  </span>
                  <span className="h-px flex-1 bg-signal/50" />
                </div>
                <p className="mt-5 font-mono text-[11px] text-cream/50">{m.mult}</p>
                <h3 className="mt-2 text-[22px] font-normal">{m.title}</h3>
                <p className="mt-3 text-[13px] leading-relaxed text-cream/70">{m.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 03 SELECCIÓN */}
      <section id="proyectos" className="py-20 sm:py-24 scroll-mt-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-8">
          <motion.div {...reveal}>
            <SectionHeader prefix="03" label="Selección" title={<>Proyectos donde la<br />idea encontró su forma.</>} />
          </motion.div>

          <ul className="mt-12 border-t border-line">
            {PROJECTS.map((p, i) => (
              <motion.li key={p.id} {...reveal} className="border-b border-line">
                <a href={p.url} target="_blank" rel="noopener noreferrer" data-cursor="Ver ↗" className="group grid sm:grid-cols-[1fr_1.618fr] gap-6 sm:gap-10 py-6 items-center">
                  <div className="relative aspect-[1.618/1] overflow-hidden border border-line bg-card">
                    <img
                      src={p.img}
                      alt={`Captura de ${p.title}`}
                      className="w-full h-full object-cover object-top sepia-[.55] opacity-80 group-hover:sepia-0 group-hover:opacity-100 group-hover:scale-[1.03] transition-all duration-700"
                    />
                    <div className="absolute inset-0 group-hover:opacity-0 transition-opacity duration-700">
                      <GoldenOverlay variant={i} />
                    </div>
                    <span className="absolute left-2 bottom-2 bg-ink text-cream label-mono px-2 py-1">[Captura · {p.title}]</span>
                  </div>
                  <div>
                    <div className="flex justify-between font-mono text-[10px] text-ink-soft">
                      <span>{String(i + 1).padStart(2, '0')}</span>
                      <span>{p.year}</span>
                    </div>
                    <h3 className="mt-2 text-[30px] sm:text-[36px] uppercase font-normal tracking-[-0.01em] group-hover:text-signal transition-colors">{p.title}</h3>
                    <p className="mt-1 label-mono text-signal">{p.category} // {p.tech.join(', ')}</p>
                    <p className="mt-3 text-[14px] leading-relaxed max-w-lg">{p.desc}</p>
                    <span className="mt-4 inline-flex items-center gap-2 uppercase text-[10px] tracking-[0.18em] font-semibold">
                      Ver proyecto <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </span>
                  </div>
                </a>
              </motion.li>
            ))}
          </ul>
        </div>
      </section>

      {/* 04 FILOSOFÍA */}
      <section id="filosofia" className="sketch-bg py-20 sm:py-28 scroll-mt-16" style={{ ['--sketch-tint' as string]: 'rgba(232, 200, 140, 0.45)' }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-8 grid lg:grid-cols-[1.35fr_1fr] gap-12 items-center">
          <motion.div {...reveal}>
            <SectionHeader prefix="04" label="Filosofía" title={<>La precisión es la<br />única <span className="text-ember font-normal">estética honesta.</span></>} />
            <div className="mt-8 bg-card/90 border border-line/80 p-6 grid sm:grid-cols-2 gap-6 text-[13px] leading-relaxed">
              <p>Descomponemos problemas complejos en axiomas geométricos. El diseño no es arte; es la resolución visual de una ecuación de datos.</p>
              <p>Cada pixel en 3 Libras responde a una intención técnica. Respetamos la arquitectura del pensamiento para construir interfaces que funcionen como extensiones de la mente.</p>
            </div>
          </motion.div>
          <motion.div {...reveal} transition={{ ...reveal.transition, delay: 0.15 }}>
            <GoldenDiagram />
          </motion.div>
        </div>
      </section>

      {/* 05 CONTACTO */}
      <section id="contacto" className="bg-ink text-cream pt-20 sm:pt-24 pb-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-8 grid lg:grid-cols-[1.618fr_1fr] gap-12 items-start">
          <motion.div {...reveal}>
            <div className="eyebrow text-cream/70"><span>05</span><span>Punto de sincronización</span></div>
            <h2 className="mt-6 text-[64px] sm:text-[88px] leading-[0.95] font-extralight tracking-[-0.03em] text-cream">
              Hablemos<br />del <span className="text-[#E9A866] font-light">objeto.</span>
            </h2>
            <p className="mt-6 max-w-sm text-[14px] leading-relaxed text-cream/75">
              Contanos qué querés resolver. Nosotros buscamos la conexión que falta.
            </p>
          </motion.div>

          <motion.div {...reveal} transition={{ ...reveal.transition, delay: 0.15 }} className="border-y border-cream/15 lg:mt-6">
            {[
              { k: 'Escribinos', label: 'WhatsApp', href: 'https://wa.me/5493513304222' },
              { k: 'Seguinos', label: 'Instagram', href: 'https://www.instagram.com/3libras.studio/' },
            ].map((c) => (
              <a key={c.label} href={c.href} target="_blank" rel="noopener noreferrer" className="group flex items-center justify-between py-4 border-b border-cream/15 hover:text-[#E9A866] transition-colors">
                <span>
                  <span className="block label-mono text-cream/50 text-[9px]">{c.k}</span>
                  <span className="block text-[18px] mt-0.5">{c.label}</span>
                </span>
                <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </a>
            ))}
            <div className="py-6">
              <button onClick={openForm} className="btn-primary w-full group">
                Iniciar un proyecto <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      <footer className="bg-ink text-cream/60 border-t border-cream/10">
        <div className="max-w-6xl mx-auto px-4 sm:px-8 py-6 flex justify-between gap-4 label-mono text-[9px]">
          <span>© 3 Libras Studio // 2026</span>
          <span className="hidden sm:block">Analysis / Synthesis / Resolution</span>
        </div>
      </footer>
    </div>
  );
}
