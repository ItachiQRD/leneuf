import React, { useState, useRef, useCallback } from 'react';
import { MapPin, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { RESTAURANT_COORDS } from '@/config/delivery';

// Format de sortie normalisé (compatible avec le reste du code)
export interface AddressSuggestion {
  display_name: string;
  lat: string;
  lon: string;
  address?: {
    house_number?: string;
    road?: string;
    postcode?: string;
    city?: string;
    country?: string;
  };
}

// Format brut de l'API adresse du gouvernement français
interface GovFeature {
  type: 'Feature';
  geometry: { type: 'Point'; coordinates: [number, number] }; // [lon, lat]
  properties: {
    label: string;
    score: number;
    housenumber?: string;
    name: string;
    postcode?: string;
    city?: string;
    street?: string;
    type: string;
    context: string;
  };
}

function govFeatureToSuggestion(f: GovFeature): AddressSuggestion {
  const [lon, lat] = f.geometry.coordinates;
  return {
    display_name: f.properties.label,
    lat: String(lat),
    lon: String(lon),
    address: {
      house_number: f.properties.housenumber,
      road: f.properties.street || f.properties.name,
      postcode: f.properties.postcode,
      city: f.properties.city,
    },
  };
}

interface AddressAutocompleteProps {
  value: string;
  onChange: (address: string) => void;
  onAddressSelect: (address: AddressSuggestion) => void;
  placeholder?: string;
  className?: string;
}

export function AddressAutocomplete({
  value,
  onChange,
  onAddressSelect,
  placeholder = 'Rechercher votre adresse...',
  className = '',
}: AddressAutocompleteProps) {
  const [suggestions, setSuggestions] = useState<AddressSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeIndex, setActiveIndex] = useState(-1);

  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  // Évite de relancer la recherche après une sélection
  const skipNextSearch = useRef(false);

  const searchAddresses = useCallback(async (query: string) => {
    if (query.trim().length < 3) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // API officielle française, biaisée vers les coords du restaurant
      const url = new URL('https://api-adresse.data.gouv.fr/search/');
      url.searchParams.set('q', query);
      url.searchParams.set('limit', '6');
      url.searchParams.set('lat', String(RESTAURANT_COORDS.lat));
      url.searchParams.set('lon', String(RESTAURANT_COORDS.lon));

      const res = await fetch(url.toString());
      if (!res.ok) throw new Error('Erreur réseau');

      const data = await res.json();
      const features: GovFeature[] = data.features ?? [];
      const mapped = features.map(govFeatureToSuggestion);
      setSuggestions(mapped);
      setShowSuggestions(mapped.length > 0);
      setActiveIndex(-1);
    } catch {
      setError('Impossible de rechercher des adresses. Vérifiez votre connexion.');
      setSuggestions([]);
      setShowSuggestions(false);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value;
    onChange(v);
    setIsConfirmed(false);

    if (skipNextSearch.current) {
      skipNextSearch.current = false;
      return;
    }

    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => searchAddresses(v), 250);
  };

  const confirmSuggestion = (suggestion: AddressSuggestion) => {
    skipNextSearch.current = true;
    onChange(suggestion.display_name);
    onAddressSelect(suggestion);
    setIsConfirmed(true);
    setSuggestions([]);
    setShowSuggestions(false);
    setActiveIndex(-1);
    inputRef.current?.blur();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showSuggestions || suggestions.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex(i => Math.min(i + 1, suggestions.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex(i => Math.max(i - 1, 0));
    } else if (e.key === 'Enter' && activeIndex >= 0) {
      e.preventDefault();
      confirmSuggestion(suggestions[activeIndex]);
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
      setActiveIndex(-1);
    }
  };

  const handleBlur = () => {
    // Délai pour laisser le clic sur une suggestion se déclencher d'abord
    setTimeout(() => setShowSuggestions(false), 150);
  };

  const handleFocus = () => {
    if (!isConfirmed && suggestions.length > 0) setShowSuggestions(true);
  };

  return (
    <div className={`relative ${className}`}>
      {/* Champ de saisie */}
      <div className="relative">
        <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center">
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
          ) : isConfirmed ? (
            <CheckCircle className="h-4 w-4 text-green-500" />
          ) : error ? (
            <AlertCircle className="h-4 w-4 text-red-400" />
          ) : (
            <MapPin className="h-4 w-4 text-gray-400" />
          )}
        </span>
        <input
          ref={inputRef}
          type="text"
          autoComplete="off"
          value={value}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={placeholder}
          className={`w-full rounded-lg border py-2.5 pl-10 pr-4 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-transparent dark:bg-gray-700 dark:text-white ${
            isConfirmed
              ? 'border-green-400 bg-green-50 dark:bg-green-900/20'
              : error
              ? 'border-red-400 bg-red-50 dark:bg-red-900/10'
              : 'border-gray-300 dark:border-gray-600 bg-white'
          }`}
        />
        {/* Croix pour réinitialiser */}
        {value && (
          <button
            type="button"
            tabIndex={-1}
            onMouseDown={(e) => {
              e.preventDefault();
              onChange('');
              setIsConfirmed(false);
              setSuggestions([]);
              setShowSuggestions(false);
              inputRef.current?.focus();
            }}
            className="absolute inset-y-0 right-2 flex items-center px-1 text-gray-400 hover:text-gray-600"
          >
            <span className="text-lg leading-none">&times;</span>
          </button>
        )}
      </div>

      {/* Liste de suggestions */}
      {showSuggestions && suggestions.length > 0 && (
        <ul
          ref={listRef}
          role="listbox"
          className="absolute z-50 mt-1 w-full overflow-hidden rounded-xl border border-gray-200 bg-white shadow-xl dark:border-gray-700 dark:bg-gray-800"
        >
          {suggestions.map((s, i) => {
            const isActive = i === activeIndex;
            const street = s.address?.house_number
              ? `${s.address.house_number} ${s.address.road ?? ''}`
              : (s.address?.road ?? s.display_name);
            const cityLine = [s.address?.postcode, s.address?.city]
              .filter(Boolean)
              .join(' ');

            return (
              <li
                key={i}
                role="option"
                aria-selected={isActive}
                // onMouseDown évite le blur de l'input avant le clic
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => confirmSuggestion(s)}
                className={`flex cursor-pointer items-start gap-3 px-4 py-3 transition-colors ${
                  isActive
                    ? 'bg-red-50 dark:bg-red-900/20'
                    : 'hover:bg-gray-50 dark:hover:bg-gray-700'
                } ${i < suggestions.length - 1 ? 'border-b border-gray-100 dark:border-gray-700' : ''}`}
              >
                <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0 text-red-400" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-gray-900 dark:text-white">
                    {street}
                  </p>
                  {cityLine && (
                    <p className="truncate text-xs text-gray-500 dark:text-gray-400">
                      {cityLine}
                    </p>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      )}

      {/* Message d'erreur */}
      {error && (
        <p className="mt-1 flex items-center gap-1 text-xs text-red-600">
          <AlertCircle className="h-3 w-3" />
          {error}
        </p>
      )}

      {/* Confirmation visible */}
      {isConfirmed && !error && (
        <p className="mt-1 flex items-center gap-1 text-xs text-green-600">
          <CheckCircle className="h-3 w-3" />
          Adresse confirmée
        </p>
      )}
    </div>
  );
}
