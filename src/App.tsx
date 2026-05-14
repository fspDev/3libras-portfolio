import { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from 'motion/react';
import {
  ArrowRight,
  Monitor,
  Smartphone,
  Cpu,
  Instagram,
  MessageCircle,
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
    desc: 'Interfaces precisas y funcionales.', 
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
    desc: 'Soluciones móviles nativas.', 
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
    desc: 'Sistemas gráficos analíticos.', 
    icon: Cpu,
    process: [
      { step: '01', title: 'Abstracción', desc: 'Identificación de los axiomas centrales de la marca.' },
      { step: '02', title: 'Geometrización', desc: 'Construcción técnica de símbolos y logotipos.' },
      { step: '03', title: 'Sistema Gráfico', desc: 'Desarrollo de paletas y tipografías coherentes.' },
      { step: '04', title: 'Manual de Uso', desc: 'Protocolos de aplicación y escalabilidad.' }
    ]
  },
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

/**
 * UTILS & HOOKS
 */
function useWindowSize() {
  const [size, setSize] = useState({ width: window.innerWidth, height: window.innerHeight });
  useEffect(() => {
    const updateSize = () => setSize({ width: window.innerWidth, height: window.innerHeight });
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);
  return size;
}

function useCustomCursor() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };

    const onMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest('button, a, .group')) {
        setIsHovering(true);
      } else {
        setIsHovering(false);
      }
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseover', onMouseOver);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseover', onMouseOver);
    };
  }, []);

  return { position, isHovering };
}

/**
 * COMPONENTS
 */

const TransformingLogo = () => {
  const { scrollY } = useScroll();
  const { width, height } = useWindowSize();

  const threshold = 180;

  const rawProgress = useTransform(scrollY, [0, threshold], [0, 1]);
  const progress = useSpring(rawProgress, { stiffness: 80, damping: 20 });

  const finalX = -(width / 2) + 110;
  const finalY = -(height / 2) + 40;

  const x = useTransform(progress, [0, 1], [0, finalX]);
  const y = useTransform(progress, [0, 1], [0, finalY]);

  const threeSize = useTransform(progress, [0, 1], [260, 24]);
  const librasSize = useTransform(progress, [0, 1], [36, 14]);
  const lineW = useTransform(progress, [0, 1], [55, 2]);
  const lineH = useTransform(progress, [0, 1], [2, 24]);
  const letterSpacing = useTransform(progress, [0, 1], ["0.4em", "0.15em"]);

  // Relative positions based on the SVG snippet
  // Hero (p=0): 
  // 3 is at baseline (0)
  // Line is at y=55 (255-200), x starting near 5
  // LIBRAS is at y=65 (265-200), x starting at 80

  // Navbar (p=1):
  // Compact horizontal: 3 [gap] | [gap] LIBRAS
  const lineX = useTransform(progress, [0, 1], [0, 32]);
  const lineY = useTransform(progress, [0, 1], [160, 0]);

  const librasX = useTransform(progress, [0, 1], [0, 100]);
  const librasY = useTransform(progress, [0, 1], [210, 0]);

  return (
    <>
      <motion.div
        className="fixed top-0 left-0 right-0 h-20 bg-void/80 backdrop-blur-xl z-[90] border-b border-white/[0.03] pointer-events-none"
        style={{ opacity: useTransform(scrollY, [150, 250], [0, 1]) }}
      />
      <motion.div
        className="fixed inset-0 flex items-center justify-center z-[100] pointer-events-none"
        style={{ x, y }}
      >
        <div className="relative flex items-center justify-center">
          {/* THE 3 */}
          <motion.div
            style={{ fontSize: threeSize }}
            className="font-display font-normal leading-none select-none text-matter"
          >
            3
          </motion.div>

          {/* THE SEPARATOR (Rule) */}
          <motion.div
            style={{
              width: lineW,
              height: lineH,
              x: lineX,
              y: lineY,
              position: 'absolute',
              backgroundColor: 'var(--color-signal)'
            }}
          />

          {/* LIBRAS */}
          <motion.div
            style={{
              fontSize: librasSize,
              letterSpacing,
              x: librasX,
              y: librasY,
              position: 'absolute'
            }}
            className="font-display font-normal whitespace-nowrap text-matter origin-left"
          >
            LIBRAS
          </motion.div>
        </div>
      </motion.div>
    </>
  );
};

const FibonacciSpiral = () => (
  <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden opacity-[0.20]">
    <motion.div 
      animate={{ 
        rotate: 360,
      }}
      transition={{ 
        duration: 60, 
        repeat: Infinity, 
        ease: "linear" 
      }}
      className="w-full h-full flex items-center justify-center"
    >
      <svg 
        viewBox="0 0 1000 1000" 
        className="w-[180%] h-[180%] text-signal stroke-current fill-none"
      >
        {/* Fibonacci Circles Construction (Right side of the reference image) */}
        <circle cx="500" cy="500" r="377" strokeWidth="0.8" />
        <circle cx="618" cy="500" r="233" strokeWidth="0.6" />
        <circle cx="689" cy="500" r="144" strokeWidth="0.5" />
        <circle cx="733" cy="500" r="89" strokeWidth="0.4" />
        <circle cx="760" cy="500" r="55" strokeWidth="0.3" />
        <circle cx="777" cy="500" r="34" strokeWidth="0.2" />
        <circle cx="788" cy="500" r="21" strokeWidth="0.1" />
        
        {/* Supporting technical lines */}
        <line x1="123" y1="500" x2="877" y2="500" strokeWidth="0.2" strokeDasharray="4 4" />
        <circle cx="500" cy="500" r="2" fill="currentColor" />
      </svg>
    </motion.div>
  </div>
);

const ServiceDetail = ({ service, onClose }: { service: typeof SERVICES[0]; onClose: () => void }) => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-black/95 backdrop-blur-md"
    >
      <motion.div 
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="w-full max-w-4xl bg-noise/5 border border-signal/30 p-13 relative overflow-hidden"
      >
        <button 
          onClick={onClose}
          className="absolute top-8 right-8 text-matter/40 hover:text-signal transition-colors cursor-none z-10"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-13">
          <div className="md:col-span-1">
            <span className="text-signal text-[11px] font-mono mb-2 block uppercase tracking-widest">Protocolo // {service.id}</span>
            <h3 className="text-4xl font-bold uppercase tracking-tighter mb-8 leading-none">{service.name}</h3>
            <p className="text-matter/60 text-sm leading-relaxed mb-8">{service.desc}</p>
            <service.icon className="w-13 h-13 text-signal opacity-20" />
          </div>

          <div className="md:col-span-2">
            <div className="space-y-6">
              {service.process.map((p, i) => (
                <motion.div 
                  key={p.step}
                  initial={{ x: 20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: i * 0.1 }}
                  className="group"
                >
                  <div className="flex items-start gap-6 border-l border-white/10 pl-8 group-hover:border-signal transition-colors py-2">
                    <span className="text-signal text-[10px] font-mono pt-1">{p.step}</span>
                    <div>
                      <h4 className="text-[14px] uppercase font-bold tracking-widest mb-1 group-hover:text-signal transition-colors">{p.title}</h4>
                      <p className="text-[11px] text-matter/50 leading-relaxed max-w-md">{p.desc}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
            
            <div className="mt-13 pt-13 border-t border-white/5 flex justify-end">
              <button 
                onClick={onClose}
                className="text-[10px] uppercase tracking-[0.4em] text-signal font-bold hover:text-matter transition-colors cursor-none"
              >
                Cerrar Protocolo_
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

const SectionHeader = ({ title, prefix }: { title: string; prefix: string }) => (
  <div className="flex items-center gap-4 mb-13 opacity-80 mt-21">
    <span className="text-signal text-[11px] font-mono">{prefix}</span>
    <h2 className="text-[14px] uppercase tracking-widest font-bold">{title}</h2>
    <div className="h-[1px] bg-noise flex-1 opacity-20" />
  </div>
);

const ContactForm = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const [status, setStatus] = useState<'idle' | 'sending' | 'success'>('idle');
  
  const handleSubmit = async (e: React.FormEvent) => {
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

  if (!isOpen) return null;

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-black/95 backdrop-blur-sm"
    >
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="w-full max-w-xl bg-noise/5 border border-signal/30 p-13 relative overflow-hidden"
      >
        <button 
          onClick={onClose}
          className="absolute top-8 right-8 text-matter/40 hover:text-signal transition-colors cursor-none"
        >
          <X className="w-6 h-6" />
        </button>

        {status === 'success' ? (
          <div className="py-21 text-center">
            <motion.div 
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              className="text-signal mb-8 flex justify-center"
            >
              <Send className="w-13 h-13" />
            </motion.div>
            <h3 className="text-2xl font-bold uppercase tracking-tighter mb-4">Mensaje Sincronizado</h3>
            <p className="text-matter/60 text-sm uppercase tracking-widest">Responderemos a la brevedad.</p>
          </div>
        ) : (
          <>
            <div className="mb-13">
              <span className="text-signal text-[11px] font-mono mb-2 block">PROTOCOLO_04</span>
              <h3 className="text-3xl font-bold uppercase tracking-tighter">Iniciar Contacto</h3>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-[0.3em] text-matter/40">Nombre / Organización</label>
                <input 
                  required
                  type="text" 
                  className="w-full bg-transparent border-b border-white/10 py-3 focus:border-signal outline-none transition-colors text-matter font-sans"
                  placeholder="Escribe aquí..."
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-[0.3em] text-matter/40">Email de Retorno</label>
                <input 
                  required
                  type="email" 
                  className="w-full bg-transparent border-b border-white/10 py-3 focus:border-signal outline-none transition-colors text-matter font-sans"
                  placeholder="email@ejemplo.com"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-[0.3em] text-matter/40">Mensaje / Requerimiento</label>
                <textarea 
                  required
                  rows={4}
                  className="w-full bg-transparent border-b border-white/10 py-3 focus:border-signal outline-none transition-colors text-matter font-sans resize-none"
                  placeholder="Describe el objeto de tu consulta..."
                />
              </div>

              <button 
                type="submit"
                disabled={status === 'sending'}
                className="w-full py-4 bg-signal text-void font-bold uppercase tracking-[0.4em] text-[12px] hover:bg-matter transition-all flex items-center justify-center gap-3 group cursor-none"
              >
                {status === 'sending' ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    Transmitir
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>
          </>
        )}
      </motion.div>
    </motion.div>
  );
};

export default function App() {
  const { position, isHovering } = useCustomCursor();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<typeof SERVICES[0] | null>(null);

  return (
    <div className="text-matter selection:bg-signal selection:text-void min-h-screen font-sans overflow-x-hidden cursor-none relative" style={{ backgroundColor: '#000000' }}>
      <FibonacciSpiral />
      {/* CUSTOM CURSOR */}
      <motion.div
        className="fixed top-0 left-0 w-8 h-8 border border-signal rounded-full pointer-events-none z-[9999]"
        animate={{
          x: position.x - 16,
          y: position.y - 16,
          scale: isHovering ? 1.5 : 1,
          backgroundColor: isHovering ? 'rgba(200, 151, 42, 0.2)' : 'rgba(200, 151, 42, 0)'
        }}
        transition={{ type: 'spring', stiffness: 150, damping: 20, mass: 0.5 }}
      />
      <motion.div
        className="fixed top-0 left-0 w-1.5 h-1.5 bg-signal rounded-full pointer-events-none z-[9999]"
        animate={{
          x: position.x - 3,
          y: position.y - 3
        }}
        transition={{ type: 'spring', stiffness: 250, damping: 25, mass: 0.1 }}
      />

      <TransformingLogo />
      <AnimatePresence>
        {isFormOpen && <ContactForm isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} />}
        {selectedService && <ServiceDetail service={selectedService} onClose={() => setSelectedService(null)} />}
      </AnimatePresence>

      {/* HERO */}
      <section className="h-[60vh] flex flex-col items-center justify-end pb-13">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1.5 }}
          className="text-left z-10"
        >
        </motion.div>
      </section>

      {/* CONTENT */}
      <main className="max-w-5xl px-8 mx-auto relative z-10">

        <section id="servicios" className="py-21">
          <SectionHeader prefix="01" title="Capacidades" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {SERVICES.map((s) => (
              <motion.div
                key={s.id}
                whileHover={{ y: -5 }}
                onClick={() => setSelectedService(s)}
                className="border border-signal/30 p-8 h-[233px] flex flex-col justify-between group bg-white/[0.01] cursor-none"
              >
                <div>
                  <s.icon className="w-5 h-5 text-signal mb-8 opacity-30 group-hover:opacity-100 transition-opacity" />
                  <h3 className="text-[15px] uppercase tracking-[0.2em] font-bold mb-3">{s.name}</h3>
                  <p className="text-[12px] opacity-70 leading-relaxed">{s.desc}</p>
                </div>
                <ArrowRight className="w-4 h-4 text-signal opacity-0 group-hover:opacity-100 transition-all translate-x-[-10px] group-hover:translate-x-0" />
              </motion.div>
            ))}
          </div>
        </section>

        <section id="proyectos" className="py-21">
          <SectionHeader prefix="02" title="Selección" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-13">
            {PROJECTS.map((p) => (
              <a
                key={p.id}
                href={p.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group cursor-none overflow-hidden border border-signal/20 block bg-white/[0.01]"
              >
                <div className="aspect-[4/3] overflow-hidden grayscale group-hover:grayscale-0 transition-all duration-1000">
                  <img src={p.img} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition-all duration-1000" />
                </div>
                <div className="p-8">
                  <div className="flex justify-between items-baseline mb-2">
                    <h4 className="text-xl font-bold uppercase tracking-tighter">{p.title}</h4>
                    <span className="text-[9px] font-mono text-signal">{p.year}</span>
                  </div>
                  <p className="text-[10px] text-signal uppercase tracking-widest">{p.category} // {p.tech.join(', ')}</p>
                  <p className="text-[13px] mt-4 leading-relaxed opacity-70 group-hover:opacity-100 transition-opacity">{p.desc}</p>
                </div>
              </a>
            ))}
          </div>
        </section>

        <section id="metodo" className="py-34 border-t border-noise/10 mt-21">
          <SectionHeader prefix="03" title="Filosofía" />
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-[34px] leading-tight font-bold uppercase mb-13 tracking-tighter">
              La precisión es la <span className="text-signal italic">única</span> estética honesta.
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-13 text-[14px] leading-relaxed">
              <p>Descomponemos problemas complejos en axiomas geométricos. El diseño no es arte; es la resolución visual de una ecuación de datos.</p>
              <p>Cada pixel en 3 Libras responde a una intención técnica. Respetamos la arquitectura del pensamiento para construir interfaces que funcionen como extensiones de la mente.</p>
            </div>
          </div>
        </section>

        <section id="contacto" className="py-34 text-center">
          <h3 className="text-[10px] uppercase tracking-[0.6em] text-signal mb-13">Punto de Sincronización</h3>
          <div className="flex flex-col items-center gap-13">
            <button 
              onClick={() => setIsFormOpen(true)}
              className="text-[42px] md:text-[68px] font-bold uppercase tracking-tighter leading-none hover:text-signal transition-colors text-center cursor-none bg-transparent border-none p-0"
            >
              Hablemos<br />del objeto.
            </button>

            <div className="flex gap-8 mt-8">
              <a
                href="https://wa.me/5493513304222"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 px-6 py-3 border border-noise/20 hover:border-signal transition-colors group cursor-none"
              >
                <MessageCircle className="w-4 h-4 text-signal" />
                <span className="text-[11px] uppercase tracking-widest font-bold">WhatsApp</span>
              </a>
              <a
                href="https://www.instagram.com/3libras.studio/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 px-6 py-3 border border-noise/20 hover:border-signal transition-colors group cursor-none"
              >
                <Instagram className="w-4 h-4 text-signal" />
                <span className="text-[11px] uppercase tracking-widest font-bold">Instagram</span>
              </a>
            </div>
          </div>
        </section>
      </main>

      <footer className="py-13 px-8 border-t border-noise/10 opacity-30 text-[9px] uppercase font-mono tracking-widest flex justify-between">
        <div>© 3 LIBRAS studio // 2026</div>
        <div className="hidden sm:block">Analysis / Synthesis / Resolution</div>
      </footer>
    </div>
  );
}
