'use client';

import { NestWithPets } from '@/types/nest';

interface NestCardProps {
  nest: NestWithPets;
  onSelect?: (nest: NestWithPets) => void;
}

export function NestCard({ nest, onSelect }: NestCardProps) {
  return (
    <div
      onClick={() => onSelect?.(nest)}
      className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 cursor-pointer hover:shadow-md transition"
    >
      <div className="flex items-center gap-3 mb-3">
        <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center text-xl">
          🪺
        </div>
        <div>
          <h3 className="font-bold text-gray-900">{nest.nest_name}</h3>
          <p className="text-xs text-gray-500">
            {nest.pets?.length || 0} สัตว์เลี้ยง
          </p>
        </div>
      </div>

      {nest.description && (
        <p className="text-sm text-gray-600 mb-3">{nest.description}</p>
      )}

      {nest.pets && nest.pets.length > 0 && (
        <div className="flex gap-2">
          {nest.pets.slice(0, 3).map((pet) => (
            <div
              key={pet.id}
              className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center text-sm"
            >
              🐱
            </div>
          ))}
          {nest.pets.length > 3 && (
            <div className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center text-xs text-gray-400">
              +{nest.pets.length - 3}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
