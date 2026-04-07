import { motion } from 'motion/react';
import { Search } from 'lucide-react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import React from 'react';
import { useProperties } from '../context/PropertyContext';
import PropertyCard from '../components/PropertyCard';

export default function AltoPadrao() {
  const navigate = useNavigate();
  const { properties } = useProperties();
  const { favorites, toggleFavorite } = useOutletContext<{ favorites: number[], toggleFavorite: (id: number) => void }>();
  
  const filteredProperties = properties.filter(p => p.category === "Alto padrão");

  return (
    <div className="pt-32 pb-20 px-6 bg-brancobg min-h-screen">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2">
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-marromescuro">
              Imóveis de Alto Padrão
            </h1>
            <p className="text-marromescuro/60 max-w-2xl">
              Uma seleção exclusiva dos melhores imóveis de luxo, com acabamentos impecáveis e localizações privilegiadas.
            </p>
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProperties.length > 0 ? (
            filteredProperties.map((prop) => (
              <PropertyCard 
                key={prop.id} 
                prop={prop} 
                onClick={() => navigate(`/imovel/${prop.id}`)} 
                isFavorite={favorites.includes(prop.id)}
                onToggleFavorite={() => toggleFavorite(prop.id)}
              />
            ))
          ) : (
            <div className="col-span-full py-20 text-center space-y-4">
              <div className="bg-white w-20 h-20 rounded-full flex items-center justify-center mx-auto shadow-sm">
                <Search className="w-8 h-8 text-gray-300" />
              </div>
              <h3 className="text-xl font-bold text-marromescuro">Nenhum imóvel encontrado</h3>
              <button 
                onClick={() => navigate('/comprar')}
                className="text-terracota font-bold hover:underline"
              >
                Ver todos os imóveis
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
