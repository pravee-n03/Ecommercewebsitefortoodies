import { motion } from 'motion/react';
import { Sparkles, ShoppingBag, Palette, Phone, Mail, MapPin, MessageCircle, Users, Facebook, Instagram, Twitter, Linkedin, Shield, Star, Zap, Award, ChevronRight, ArrowRight } from 'lucide-react';
import { Button } from './ui/button';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { ToodiesLogoSVG } from './ToodiesLogoSVG';

interface LandingPageProps {
  businessInfo: any;
  adminSettings: any;
  onGoToCustomer: () => void;
  onGoToAdmin: () => void;
  onGoToPrivacy: () => void;
  onGoToTerms: () => void;
}

const HERO_IMG = 'https://images.unsplash.com/photo-1535395567430-827184ae2eda?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBzdHJlZXR3ZWFyJTIwZGFyayUyMGZhc2hpb24lMjBtb2RlbHxlbnwxfHx8fDE3NzU0OTQ1MzZ8MA&ixlib=rb-4.1.0&q=80&w=1080';
const CARD_IMG = 'https://images.unsplash.com/photo-1571754338920-1ba712024258?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjdXN0b20lMjBwcmludGVkJTIwaG9vZGllJTIwZ29sZCUyMGJsYWNrJTIwcHJlbWl1bXxlbnwxfHx8fDE3NzU0OTQ1NDZ8MA&ixlib=rb-4.1.0&q=80&w=1080';
const COLLECTION_IMGS = [
  'https://images.unsplash.com/photo-1571754338920-1ba712024258?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600',
  'https://images.unsplash.com/photo-1604384809954-c6f6a74d56fa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600',
  'https://images.unsplash.com/photo-1535395567430-827184ae2eda?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600',
  'https://images.unsplash.com/photo-1571754338920-1ba712024258?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600',
];

export function LandingPage({ businessInfo, adminSettings, onGoToCustomer, onGoToAdmin, onGoToPrivacy, onGoToTerms }: LandingPageProps) {
  const heroImage = businessInfo.hero_image || HERO_IMG;

  // Collection images: use admin-uploaded ones if available, else fall back to defaults
  const collImages: string[] =
    Array.isArray(businessInfo.collection_images) && businessInfo.collection_images.length >= 4
      ? businessInfo.collection_images
      : COLLECTION_IMGS;

  const scrollToContact = () => {
    document.getElementById('contact-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#000000] text-white selection:bg-[#d4af37]/30 overflow-x-hidden">
      
      {/* ── NAVIGATION ── */}
      <nav className="fixed top-0 w-full z-50 backdrop-blur-xl" style={{ background: 'rgba(0,0,0,0.88)', borderBottom: '1px solid rgba(212,175,55,0.12)' }}>
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          {/* Logo */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="flex items-center">
            <ToodiesLogoSVG height={48} />
          </motion.div>

          {/* Nav Links */}
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="hidden md:flex items-center gap-8"
          >
            {[
              { label: 'Shop', action: onGoToCustomer },
              { label: 'Collections', action: onGoToCustomer },
              { label: 'Bulk Orders', action: scrollToContact },
            ].map(({ label, action }) => (
              <button
                key={label}
                onClick={action}
                className="nav-link text-sm tracking-wider"
                style={{ background: 'transparent', border: 'none', outline: 'none', cursor: 'pointer' }}
              >
                {label}
              </button>
            ))}
            <button
              onClick={onGoToAdmin}
              className="text-sm tracking-wider transition-colors duration-300"
              style={{ background: 'transparent', border: 'none', outline: 'none', cursor: 'pointer', color: 'rgba(212,175,55,0.6)' }}
              title="Admin Dashboard"
            >
              <Shield className="w-3.5 h-3.5 inline-block mr-1 opacity-60" />
              Admin
            </button>
          </motion.div>

          {/* CTA */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
            <Button onClick={onGoToCustomer} className="glow-button font-semibold rounded-full px-6 py-2 text-sm tracking-wider">
              Get Started
            </Button>
          </motion.div>
        </div>
      </nav>

      {/* ── HERO SECTION ── */}
      <section className="relative min-h-screen flex items-center pt-20 overflow-hidden">
        {/* Background layers */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          <ImageWithFallback src={heroImage} alt="" className="absolute inset-0 w-full h-full object-cover opacity-15" />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(105deg, #000 40%, rgba(0,0,0,0.75) 100%)' }} />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, #000 0%, transparent 50%)' }} />
          {/* Ambient gold glows */}
          <div className="absolute top-1/4 -left-32 w-[700px] h-[700px] rounded-full" style={{ background: 'radial-gradient(circle, rgba(212,175,55,0.07) 0%, transparent 70%)' }} />
          <div className="absolute bottom-0 right-0 w-[600px] h-[600px] rounded-full" style={{ background: 'radial-gradient(circle, rgba(212,175,55,0.05) 0%, transparent 70%)' }} />
        </div>

        <div className="max-w-7xl mx-auto px-6 w-full grid lg:grid-cols-2 gap-16 items-center relative z-10 py-20">
          {/* ── Left copy ── */}
          <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, ease: 'easeOut' }}>
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.25 }}
              className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full mb-8"
              style={{ background: 'rgba(212,175,55,0.08)', border: '1px solid rgba(212,175,55,0.28)' }}
            >
              <div className="w-1.5 h-1.5 rounded-full bg-[#d4af37] animate-pulse" />
              <span className="text-[#d4af37] tracking-[0.22em] uppercase" style={{ fontSize: '0.68rem', fontWeight: 700 }}>
                Premium Streetwear
              </span>
            </motion.div>

            {/* Headline */}
            <div className="mb-6 overflow-hidden">
              <motion.div
                initial={{ y: 60, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.8 }}
                className="text-white"
                style={{ fontSize: 'clamp(3.2rem, 6vw, 5.2rem)', fontWeight: 900, lineHeight: 1.05, letterSpacing: '-0.02em' }}
              >
                Design Your
              </motion.div>
              <motion.div
                initial={{ y: 60, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.45, duration: 0.8 }}
                className="gradient-text glow-text"
                style={{ fontSize: 'clamp(3.2rem, 7vw, 5.8rem)', fontWeight: 900, lineHeight: 1.05, letterSpacing: '-0.02em' }}
              >
                Statement
              </motion.div>
            </div>

            {/* Sub-copy */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.65 }}
              className="text-slate-400 mb-10 max-w-lg leading-relaxed"
              style={{ fontSize: 'clamp(0.95rem, 1.5vw, 1.1rem)' }}
            >
              Where luxury meets creativity. Premium fabrics, cutting-edge customization, and timeless designs that speak your language.
            </motion.p>

            {/* Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.75 }}
              className="flex flex-wrap gap-4 mb-8"
            >
              <Button
                onClick={onGoToCustomer}
                className="glow-button rounded-full px-8 py-6 flex items-center gap-2"
                style={{ fontSize: '0.95rem' }}
              >
                Start Designing
                <motion.span animate={{ x: [0, 4, 0] }} transition={{ duration: 1.6, repeat: Infinity }}>
                  <ArrowRight className="w-4 h-4" />
                </motion.span>
              </Button>
              <Button
                variant="outline"
                onClick={onGoToCustomer}
                className="rounded-full px-8 py-6 flex items-center gap-2 transition-all duration-300 hover:bg-white/5"
                style={{ fontSize: '0.95rem', borderColor: 'rgba(255,255,255,0.18)', color: 'white', background: 'transparent' }}
              >
                Explore Collection
                <ChevronRight className="w-4 h-4" />
              </Button>
            </motion.div>

            {/* Bulk Orders link */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }}>
              <button
                onClick={scrollToContact}
                className="flex items-center gap-2 text-slate-500 hover:text-[#d4af37] transition-colors duration-300 text-sm"
                style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: 0 }}
              >
                <Users className="w-4 h-4" />
                Contact for Bulk Orders
                <ChevronRight className="w-3 h-3" />
              </button>
            </motion.div>

            {/* Stats row */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.05 }}
              className="mt-12 flex items-center gap-0"
            >
              {[
                { val: '10k+', lbl: 'Designs Made' },
                { val: '4.9★', lbl: 'User Rating' },
                { val: '500+', lbl: 'Happy Clients' },
              ].map((s, i) => (
                <div key={i} className="flex items-center">
                  <div className="px-6 first:pl-0 flex flex-col">
                    <span className="text-white" style={{ fontSize: '1.6rem', fontWeight: 800 }}>{s.val}</span>
                    <span className="text-slate-600 uppercase tracking-widest" style={{ fontSize: '0.6rem', fontWeight: 700 }}>{s.lbl}</span>
                  </div>
                  {i < 2 && <div className="w-px h-8" style={{ background: 'rgba(212,175,55,0.2)' }} />}
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* ── Right image card ── */}
          <motion.div
            initial={{ opacity: 0, scale: 0.85, rotate: 4 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 1.1, ease: 'easeOut', delay: 0.3 }}
            className="relative hidden lg:block"
          >
            {/* Ambient glow */}
            <div
              className="absolute inset-0 -z-10"
              style={{ background: 'radial-gradient(ellipse at center, rgba(212,175,55,0.22) 0%, transparent 65%)', filter: 'blur(50px)', transform: 'scale(1.15)' }}
            />

            <div
              className="relative rounded-[32px] overflow-hidden group"
              style={{ border: '1px solid rgba(212,175,55,0.22)', background: 'rgba(15,15,15,0.6)', padding: '5px' }}
            >
              <ImageWithFallback
                src={CARD_IMG}
                alt="Premium Streetwear"
                className="rounded-[28px] w-full object-cover transition-transform duration-700 group-hover:scale-105"
                style={{ aspectRatio: '4/5' }}
              />

              {/* Gradient overlay on image */}
              <div className="absolute inset-[5px] rounded-[28px] pointer-events-none" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.75) 0%, transparent 55%)' }} />

              {/* Bottom card */}
              <div className="absolute bottom-7 left-5 right-5">
                <div
                  className="rounded-2xl p-4 flex items-center gap-3"
                  style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(24px)', border: '1px solid rgba(212,175,55,0.18)' }}
                >
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: 'rgba(212,175,55,0.12)', border: '1px solid rgba(212,175,55,0.28)' }}
                  >
                    <Palette className="w-5 h-5 text-[#d4af37]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[#d4af37] uppercase tracking-widest truncate" style={{ fontSize: '0.58rem', fontWeight: 700 }}>2D Designer Active</p>
                    <p className="text-white truncate" style={{ fontSize: '0.88rem', fontWeight: 600 }}>Customize Your Design</p>
                  </div>
                  <motion.div animate={{ scale: [1, 1.3, 1] }} transition={{ duration: 2, repeat: Infinity }} className="w-2 h-2 rounded-full bg-[#d4af37] flex-shrink-0" />
                </div>
              </div>

              {/* Top-right badge */}
              <motion.div
                animate={{ y: [0, -9, 0] }}
                transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute top-7 right-7"
              >
                <div
                  className="rounded-xl px-3 py-2 flex items-center gap-1.5"
                  style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(20px)', border: '1px solid rgba(212,175,55,0.2)' }}
                >
                  <Star className="w-3.5 h-3.5 text-[#d4af37] fill-[#d4af37]" />
                  <span className="text-white" style={{ fontSize: '0.8rem', fontWeight: 600 }}>4.9 / 5.0</span>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-10"
          animate={{ opacity: [1, 0.3, 1] }}
          transition={{ duration: 2.5, repeat: Infinity }}
        >
          <div className="w-5 h-8 rounded-full flex items-start justify-center pt-1.5" style={{ border: '1px solid rgba(212,175,55,0.3)' }}>
            <motion.div className="w-1 h-2 rounded-full bg-[#d4af37]" animate={{ y: [0, 10, 0] }} transition={{ duration: 1.5, repeat: Infinity }} />
          </div>
        </motion.div>
      </section>

      {/* ── COLLECTIONS GRID ── */}
      <section className="py-24 relative" style={{ background: '#070707', borderTop: '1px solid rgba(212,175,55,0.06)' }}>
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-end justify-between mb-12"
          >
            <div>
              <p className="text-[#d4af37] uppercase tracking-[0.22em] mb-2" style={{ fontSize: '0.68rem', fontWeight: 700 }}>Our Collections</p>
              <h2 className="text-white" style={{ fontSize: 'clamp(1.8rem, 4vw, 3rem)', fontWeight: 800, letterSpacing: '-0.01em' }}>Crafted for the Bold</h2>
            </div>
            <button
              onClick={onGoToCustomer}
              className="hidden md:flex items-center gap-2 text-[#d4af37] hover:text-white transition-colors duration-300 text-sm font-medium"
              style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}
            >
              View All <ArrowRight className="w-4 h-4" />
            </button>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4" style={{ gridTemplateRows: 'auto' }}>
            {[
              { label: 'Hoodies', img: collImages[0], col: 'col-span-2', minH: '380px' },
              { label: 'T-Shirts', img: collImages[1], col: '', minH: '180px' },
              { label: 'Streetwear', img: collImages[2], col: '', minH: '180px' },
              { label: 'Custom Prints', img: collImages[3], col: 'col-span-2', minH: '190px' },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                whileHover={{ scale: 1.02 }}
                onClick={onGoToCustomer}
                className={`relative rounded-2xl overflow-hidden cursor-pointer group ${item.col}`}
                style={{ minHeight: item.minH, border: '1px solid rgba(212,175,55,0.1)' }}
              >
                <img src={item.img} alt={item.label} className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.15) 60%, transparent 100%)' }} />
                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                  <span className="text-white" style={{ fontWeight: 700, fontSize: i === 0 ? '1.25rem' : '0.95rem' }}>{item.label}</span>
                  <div className="w-7 h-7 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity" style={{ background: 'rgba(212,175,55,0.25)', border: '1px solid rgba(212,175,55,0.5)' }}>
                    <ArrowRight className="w-3 h-3 text-[#d4af37]" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHY TOODIES ── */}
      <section className="py-24" style={{ background: '#0a0a0a', borderTop: '1px solid rgba(212,175,55,0.06)' }}>
        <div className="max-w-7xl mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-14">
            <p className="text-[#d4af37] uppercase tracking-[0.22em] mb-3" style={{ fontSize: '0.68rem', fontWeight: 700 }}>Why Toodies</p>
            <h2 className="text-white" style={{ fontSize: 'clamp(1.8rem, 4vw, 3rem)', fontWeight: 800, letterSpacing: '-0.01em' }}>Why Choose Toodies?</h2>
            <div className="h-0.5 w-14 mx-auto mt-4 rounded-full" style={{ background: 'linear-gradient(90deg, #d4af37, #c9a227)' }} />
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: <Palette className="w-7 h-7 text-[#d4af37]" />, title: 'Premium Fabrics', desc: 'High-grade 100% cotton and recycled blends for ultimate comfort and durability.' },
              { icon: <Zap className="w-7 h-7 text-[#d4af37]" />, title: 'HD Printing', desc: 'State-of-the-art DTG and screen printing that won\'t fade or crack over time.' },
              { icon: <Award className="w-7 h-7 text-[#d4af37]" />, title: 'Fast Delivery', desc: 'Custom designed, printed, and delivered to your doorstep within 7-10 business days.' },
            ].map((f, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12 }}
                whileHover={{ y: -6 }}
                className="group p-8 rounded-3xl transition-all duration-500"
                style={{ background: 'rgba(18,18,18,0.6)', border: '1px solid rgba(212,175,55,0.12)', backdropFilter: 'blur(16px)' }}
              >
                <div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500"
                  style={{ background: 'rgba(212,175,55,0.08)', border: '1px solid rgba(212,175,55,0.18)' }}
                >
                  {f.icon}
                </div>
                <h3 className="text-white mb-3" style={{ fontSize: '1.15rem', fontWeight: 700 }}>{f.title}</h3>
                <p className="text-slate-400 leading-relaxed" style={{ fontSize: '0.9rem' }}>{f.desc}</p>
                <div className="mt-6 h-px w-0 group-hover:w-full rounded-full transition-all duration-500" style={{ background: 'linear-gradient(90deg, #d4af37, transparent)' }} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="py-20" style={{ background: '#050505', borderTop: '1px solid rgba(212,175,55,0.06)' }}>
        <div className="max-w-7xl mx-auto px-6">
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-center mb-12">
            <p className="text-[#d4af37] uppercase tracking-[0.22em] mb-2" style={{ fontSize: '0.68rem', fontWeight: 700 }}>Testimonials</p>
            <h2 className="text-white" style={{ fontSize: 'clamp(1.5rem, 3vw, 2.4rem)', fontWeight: 800 }}>What Our Customers Say</h2>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-5">
            {[
              { name: 'Arjun S.', role: 'Streetwear Brand Owner', text: 'Toodies delivered 200+ custom hoodies for our drop and the quality was insane. Every detail was perfect.', rating: 5 },
              { name: 'Priya M.', role: 'Content Creator', text: 'Used the 2D designer to create my merch. Super easy, looks amazing. Will be ordering every month!', rating: 5 },
              { name: 'Rahul K.', role: 'Corporate Events Head', text: 'Ordered 500 units for our company event. On time, premium quality, and the team was super responsive.', rating: 5 },
            ].map((t, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-6 rounded-2xl"
                style={{ background: 'rgba(18,18,18,0.5)', border: '1px solid rgba(212,175,55,0.1)' }}
              >
                <div className="flex gap-0.5 mb-4">
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <Star key={j} className="w-4 h-4 text-[#d4af37] fill-[#d4af37]" />
                  ))}
                </div>
                <p className="text-slate-300 leading-relaxed mb-5 italic" style={{ fontSize: '0.9rem' }}>"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-black flex-shrink-0" style={{ background: 'linear-gradient(135deg, #d4af37, #c9a227)' }}>
                    {t.name[0]}
                  </div>
                  <div>
                    <p className="text-white" style={{ fontSize: '0.85rem', fontWeight: 600 }}>{t.name}</p>
                    <p className="text-slate-500" style={{ fontSize: '0.75rem' }}>{t.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CONTACT / BULK ORDERS ── */}
      <section id="contact-section" className="py-24" style={{ background: '#0a0a0a', borderTop: '1px solid rgba(212,175,55,0.06)' }}>
        <div className="max-w-7xl mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-4" style={{ background: 'rgba(212,175,55,0.08)', border: '1px solid rgba(212,175,55,0.22)' }}>
              <Users className="w-3 h-3 text-[#d4af37]" />
              <span className="text-[#d4af37] tracking-[0.2em] uppercase" style={{ fontSize: '0.68rem', fontWeight: 700 }}>Bulk Orders</span>
            </div>
            <h2 className="text-white mb-4" style={{ fontSize: 'clamp(1.8rem, 4vw, 3rem)', fontWeight: 800 }}>Get in Touch</h2>
            <p className="text-slate-400 max-w-xl mx-auto" style={{ fontSize: '0.95rem' }}>
              Looking to place a bulk order? We offer special pricing and dedicated support for large quantities.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-4 max-w-4xl mx-auto mb-10">
            {[
              { icon: <Phone className="w-5 h-5" />, title: 'Phone', value: businessInfo.phone || '+91 98865 10858', link: `tel:${businessInfo.phone || '+919886510858'}` },
              { icon: <Mail className="w-5 h-5" />, title: 'Email', value: businessInfo.email || 'hello@toodies.com', link: `mailto:${businessInfo.email || 'hello@toodies.com'}` },
              { icon: <MapPin className="w-5 h-5" />, title: 'Location', value: businessInfo.city && businessInfo.state ? `${businessInfo.city}, ${businessInfo.state}` : 'Bangalore, India', link: null },
            ].map((item, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                {item.link ? (
                  <a href={item.link} className="block p-6 rounded-2xl group transition-all duration-300 hover:border-[#d4af37]/40" style={{ background: 'rgba(18,18,18,0.5)', border: '1px solid rgba(212,175,55,0.12)' }}>
                    <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform" style={{ background: 'rgba(212,175,55,0.08)', border: '1px solid rgba(212,175,55,0.18)' }}>
                      <span className="text-[#d4af37]">{item.icon}</span>
                    </div>
                    <p className="text-slate-600 uppercase tracking-wider mb-1" style={{ fontSize: '0.62rem', fontWeight: 700 }}>{item.title}</p>
                    <p className="text-white group-hover:text-[#d4af37] transition-colors" style={{ fontSize: '0.9rem', fontWeight: 500 }}>{item.value}</p>
                  </a>
                ) : (
                  <div className="p-6 rounded-2xl" style={{ background: 'rgba(18,18,18,0.5)', border: '1px solid rgba(212,175,55,0.12)' }}>
                    <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-4" style={{ background: 'rgba(212,175,55,0.08)', border: '1px solid rgba(212,175,55,0.18)' }}>
                      <span className="text-[#d4af37]">{item.icon}</span>
                    </div>
                    <p className="text-slate-600 uppercase tracking-wider mb-1" style={{ fontSize: '0.62rem', fontWeight: 700 }}>{item.title}</p>
                    <p className="text-white" style={{ fontSize: '0.9rem', fontWeight: 500 }}>{item.value}</p>
                  </div>
                )}
              </motion.div>
            ))}
          </div>

          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="max-w-2xl mx-auto">
            <div className="p-8 rounded-3xl" style={{ background: 'rgba(18,18,18,0.5)', border: '1px solid rgba(212,175,55,0.12)' }}>
              <h3 className="text-white mb-5" style={{ fontSize: '1.1rem', fontWeight: 700 }}>Bulk Order Benefits</h3>
              <ul className="space-y-3 mb-7">
                {[
                  'Special pricing for orders of 50+ units',
                  'Dedicated account manager for your project',
                  'Priority production and faster turnaround times',
                  'Custom packaging and branding options available',
                ].map((benefit, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5" style={{ background: 'rgba(212,175,55,0.12)', border: '1px solid rgba(212,175,55,0.28)' }}>
                      <div className="w-1.5 h-1.5 rounded-full bg-[#d4af37]" />
                    </div>
                    <span className="text-slate-300" style={{ fontSize: '0.9rem' }}>{benefit}</span>
                  </li>
                ))}
              </ul>
              <Button onClick={onGoToCustomer} className="glow-button w-full rounded-2xl py-4">
                Start Your Order
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="py-12" style={{ borderTop: '1px solid rgba(212,175,55,0.07)' }}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-8">
            <ToodiesLogoSVG height={28} className="opacity-35" />

            {/* Social Icons */}
            {(() => {
              const showSocial = businessInfo.visibility?.website?.showSocialMedia !== false;
              const socialLinks = businessInfo.socialMedia;
              if (!showSocial || !socialLinks) return null;
              const icons = [
                { Icon: Facebook, url: socialLinks.facebook, label: 'Facebook', hover: 'hover:text-blue-500' },
                { Icon: Instagram, url: socialLinks.instagram, label: 'Instagram', hover: 'hover:text-pink-500' },
                { Icon: Twitter, url: socialLinks.twitter, label: 'Twitter', hover: 'hover:text-sky-400' },
                { Icon: Linkedin, url: socialLinks.linkedin, label: 'LinkedIn', hover: 'hover:text-blue-600' },
              ].filter(i => i.url?.trim());
              if (!icons.length) return null;
              return (
                <div className="flex items-center gap-3">
                  {icons.map(({ Icon, url, label, hover }) => (
                    <a
                      key={label}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={label}
                      className={`w-8 h-8 rounded-lg flex items-center justify-center text-slate-700 ${hover} transition-all hover:scale-110`}
                      style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}
                    >
                      <Icon className="w-3.5 h-3.5" />
                    </a>
                  ))}
                </div>
              );
            })()}

            <div className="flex gap-5">
              <span className="text-slate-700 hover:text-[#d4af37] cursor-pointer text-sm transition-colors" onClick={onGoToPrivacy}>Privacy</span>
              <span className="text-slate-700 hover:text-[#d4af37] cursor-pointer text-sm transition-colors" onClick={onGoToTerms}>Terms</span>
            </div>
          </div>
          <div className="text-center pt-6" style={{ borderTop: '1px solid rgba(212,175,55,0.05)' }}>
            <p className="text-slate-800 text-sm">© 2026 Toodies Apparel. All rights reserved.</p>
          </div>
        </div>
      </footer>

      {/* ── WHATSAPP FLOATING BUTTON ── */}
      {(() => {
        const number = (businessInfo.whatsapp || '+919886510858').replace(/[^0-9]/g, '');
        const msg = encodeURIComponent("Hi! I'm interested in Toodies products.");
        return (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 1.2, type: 'spring', stiffness: 200 }}
            style={{ position: 'fixed', bottom: '24px', right: '24px', zIndex: 50 }}
          >
            <a
              href={`https://wa.me/${number}?text=${msg}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center w-14 h-14 rounded-2xl shadow-2xl relative group overflow-hidden transition-all hover:scale-110 active:scale-95"
              style={{ background: 'linear-gradient(135deg, #25D366, #128C7E)' }}
            >
              <div className="absolute inset-0 bg-white/10 translate-y-14 group-hover:translate-y-0 transition-transform duration-300" />
              <MessageCircle className="w-7 h-7 text-white relative z-10" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-ping" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full" />
            </a>
          </motion.div>
        );
      })()}
    </div>
  );
}