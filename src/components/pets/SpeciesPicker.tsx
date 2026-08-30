'use client';

import { SpeciesType, SPECIES_CONFIG, getSpeciesList } from '@/types/species';

interface SpeciesPickerProps {
  selected: SpeciesType | null;
  onSelect: (species: SpeciesType) => void;
}

export function SpeciesPicker({ selected, onSelect }: SpeciesPickerProps) {
  const speciesList = getSpeciesList();

  return (
    <div className="grid grid-cols-3 gap-3">
      {speciesList.map((species) => (
        <button
          key={species.id}
          onClick={() => onSelect(species.id)}
          className={`
            p-4 rounded-2xl border-2 transition-all text-center
            ${selected === species.id
              ? 'border-orange-500 bg-orange-50 shadow-md'
              : 'border-gray-200 bg-white hover:border-gray-300'
            }
          `}
        >
          <div className="text-3xl mb-2">{species.icon}</div>
          <div className="font-medium text-gray-900">{species.nameThai}</div>
          <div className="text-xs text-gray-500 mt-1">
            {species.features.length} ฟีเจอร์
          </div>
        </button>
      ))}
    </div>
  );
}

interface SpeciesFeaturesProps {
  species: SpeciesType;
}

export function SpeciesFeatures({ species }: SpeciesFeaturesProps) {
  const config = SPECIES_CONFIG[species];

  if (!config) return null;

  return (
    <div className="mt-4 p-4 bg-gray-50 rounded-2xl">
      <h4 className="font-medium text-gray-900 mb-3">
        {config.icon} ฟีเจอร์สำหรับ{config.nameThai}
      </h4>
      <div className="space-y-2">
        {config.features.map((feature) => (
          <div key={feature.key} className="flex items-center gap-3 text-sm">
            <span>{feature.icon}</span>
            <div>
              <span className="font-medium text-gray-700">{feature.nameThai}</span>
              <span className="text-gray-400 ml-2">{feature.description}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
