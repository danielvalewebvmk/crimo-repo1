import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useOutletContext } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowLeft, 
  MapPin, 
  Info,
  Building2,
  ShieldCheck,
  Waves,
  Trees,
  Car,
  X,
  Eye
} from 'lucide-react';
import { useCondos } from '../context/CondoContext';
import { useProperties } from '../context/PropertyContext';
import PropertyCard from '../components/PropertyCard';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useTexture, Sphere } from '@react-three/drei';
import * as THREE from 'three';

function Sphere360({ imageUrl }: { imageUrl: string }) {
  const texture = useTexture(imageUrl);
  return (
    <Sphere args={[500, 60, 40]}>
      <meshBasicMaterial map={texture} side={THREE.BackSide} />
    </Sphere>
  );
}

export default function CondoDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { condos } = useCondos();
  const { properties } = useProperties();
  const { favorites, toggleFavorite } = useOutletContext<{ favorites: number[], toggleFavorite: (id: number) => void }>();
  
  const [is360Open, setIs360Open] = useState(false);
  const [visibleProperties, setVisibleProperties] = useState(8);

  const condo = condos.find(c => c.id.toString() === id);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  if (!condo) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-brand-cream">
        <h2 className="text-2xl font-serif font-bold text-marromescuro mb-2">Condomínio não encontrado</h2>
        <button 
          onClick={() => navigate('/')}
          className="px-8 py-4 bg-marromescuro text-white rounded-2xl font-bold hover:bg-marromescuro/90 transition-all"
        >
          Voltar para o Início
        </button>
      </div>
    );
  }

  const condoProperties = properties.filter(p => p.condoId === condo.id || p.location.includes(condo.name));

  const loadMore = () => {
    setVisibleProperties(prev => prev + 8);
  };

  return (
    <div className="min-h-screen bg-brand-cream pb-20">
      {/* Top 360 Image Section */}
      <div className="relative w-full h-[60vh] md:h-[80vh] overflow-hidden bg-black">
        <motion.img 
          src="https://i.imgur.com/Gp90UvK.png" 
          alt="Vista 360" 
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
          animate={is360Open ? { scale: 1.5, opacity: 0 } : { scale: 1, opacity: 1 }}
          transition={{ duration: 1.2, ease: [0.4, 0, 0.2, 1] }}
        />
        
        <AnimatePresence>
          {!is360Open && (
            <motion.div 
              initial={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.2 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="absolute inset-0 bg-black/30 flex flex-col items-center justify-center"
            >
              <img 
                src="https://i.imgur.com/tn6v6kz.png" 
                alt="Logo" 
                className="w-[60%] max-w-[800px] mb-4 drop-shadow-2xl"
                referrerPolicy="no-referrer"
              />
              <div className="flex flex-col items-center">
                <button 
                  onClick={() => setIs360Open(true)}
                  className="px-8 py-4 bg-white/20 backdrop-blur-md border border-white/40 text-white rounded-full font-bold uppercase tracking-widest hover:bg-gradient-to-r hover:from-[#BBDA00] hover:to-[#839702] hover:border-transparent transition-all flex items-center gap-3 shadow-[0_0_15px_rgba(255,255,255,0.2)] hover:shadow-[0_0_25px_rgba(187,218,0,0.4)]"
                >
                  <Eye className="w-5 h-5" />
                  Ver em 360º
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Back Button Overlay */}
        <AnimatePresence>
          {!is360Open && (
            <motion.button 
              initial={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              onClick={() => navigate(-1)}
              className="absolute top-32 left-8 flex items-center gap-2 text-white/80 hover:text-white transition-colors font-bold group bg-black/20 px-4 py-2 rounded-full backdrop-blur-sm z-10"
            >
              <ArrowLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
              Voltar
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 space-y-20">
        
        {/* Properties Gallery */}
        <div className="space-y-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <h2 className="text-3xl md:text-4xl font-bold text-marromescuro" style={{ fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif' }}>
              Bem-vindo ao Alphaville
            </h2>
            
            {/* Amenities moved here */}
            <div className="flex flex-wrap items-center gap-6">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-xl bg-marromescuro/5 flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5 text-terracota" />
                </div>
                <span className="text-[9px] font-bold text-marromescuro/60 uppercase tracking-widest hidden sm:block">Segurança 24h</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-xl bg-marromescuro/5 flex items-center justify-center">
                  <Waves className="w-5 h-5 text-terracota" />
                </div>
                <span className="text-[9px] font-bold text-marromescuro/60 uppercase tracking-widest hidden sm:block">Piscina</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-xl bg-marromescuro/5 flex items-center justify-center">
                  <Trees className="w-5 h-5 text-terracota" />
                </div>
                <span className="text-[9px] font-bold text-marromescuro/60 uppercase tracking-widest hidden sm:block">Área Verde</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-xl bg-marromescuro/5 flex items-center justify-center">
                  <Car className="w-5 h-5 text-terracota" />
                </div>
                <span className="text-[9px] font-bold text-marromescuro/60 uppercase tracking-widest hidden sm:block">Estacionamento</span>
              </div>
            </div>
          </div>

          {condoProperties.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {condoProperties.slice(0, visibleProperties).map((prop) => (
                  <PropertyCard 
                    key={prop.id} 
                    prop={prop} 
                    onClick={() => navigate(`/imovel/${prop.id}`)} 
                    isFavorite={favorites.includes(prop.id)}
                    onToggleFavorite={(e) => {
                      e.stopPropagation();
                      toggleFavorite(prop.id);
                    }}
                  />
                ))}
              </div>
              {visibleProperties < condoProperties.length && (
                <div className="flex justify-center pt-8">
                  <button 
                    onClick={loadMore}
                    className="px-8 py-4 bg-marromescuro/5 text-marromescuro rounded-2xl font-bold hover:bg-marromescuro/10 transition-all"
                  >
                    Carregar mais imóveis
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="bg-white p-12 rounded-[40px] text-center shadow-sm border border-marromescuro/5">
              <Building2 className="w-12 h-12 text-marromescuro/20 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-marromescuro mb-2">Nenhum imóvel cadastrado</h3>
              <p className="text-marromescuro/60">Ainda não há imóveis disponíveis neste condomínio.</p>
            </div>
          )}
        </div>

        {/* Condo Bio & Characteristics */}
        <div className="bg-white p-8 md:p-12 rounded-[40px] shadow-xl border border-marromescuro/5">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-marromescuro">{condo.name}</h2>
            <div className="flex items-center gap-2 text-terracota font-bold">
              <MapPin className="w-5 h-5" />
              <span>{condo.location}</span>
            </div>
          </div>

          <div className="space-y-8">
            <div>
              <h3 className="text-xl font-bold text-marromescuro mb-4 flex items-center gap-3">
                <Info className="w-6 h-6 text-terracota" />
                Sobre o Condomínio
              </h3>
              <p className="text-marromescuro/70 leading-relaxed text-lg font-medium">
                {condo.bio}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 360 Modal */}
      <AnimatePresence>
        {is360Open && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            className="fixed inset-0 z-[100] bg-black"
          >
            <motion.div
              initial={{ scale: 1.2, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 1.2, ease: [0.4, 0, 0.2, 1] }}
              className="w-full h-full relative"
            >
              <button 
                onClick={() => setIs360Open(false)}
                className="absolute top-8 right-8 z-50 p-4 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white rounded-full transition-all border border-white/20"
              >
                <X className="w-6 h-6" />
              </button>
              
              <div className="absolute top-8 left-8 z-50 bg-black/40 backdrop-blur-md px-6 py-3 rounded-full text-white text-xs font-bold flex items-center gap-3 border border-white/10">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                MODO IMERSIVO: ARRASTE PARA EXPLORAR
              </div>
              
              <Canvas 
                camera={{ position: [0, 0, 0.1], fov: 75 }}
                style={{ width: '100vw', height: '100vh' }}
                gl={{ antialias: true }}
              >
                <OrbitControls 
                  enableZoom={false} 
                  autoRotate 
                  autoRotateSpeed={0.4}
                  rotateSpeed={-0.5} // Reverse for more natural feel
                />
                <React.Suspense fallback={null}>
                  <Sphere360 imageUrl="https://i.imgur.com/Gp90UvK.png" />
                </React.Suspense>
              </Canvas>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
