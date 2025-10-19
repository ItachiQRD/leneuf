import React, { useState, useEffect, useRef } from 'react';
import { MapPin, Search, CheckCircle, AlertCircle } from 'lucide-react';

interface AddressSuggestion {
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
  placeholder = "Rechercher une adresse...",
  className = ""
}: AddressAutocompleteProps) {
  const [suggestions, setSuggestions] = useState<AddressSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isValid, setIsValid] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Fonction pour rechercher des adresses via l'API Nominatim
  const searchAddresses = async (query: string) => {
    if (query.length < 3) {
      setSuggestions([]);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5&addressdetails=1&countrycodes=fr`
      );
      
      if (!response.ok) {
        throw new Error('Erreur lors de la recherche d\'adresse');
      }

      const data = await response.json();
      setSuggestions(data);
      setShowSuggestions(true);
    } catch (err) {
      setError('Erreur lors de la recherche d\'adresse');
      setSuggestions([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Debounce pour éviter trop de requêtes
  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      if (value.trim()) {
        searchAddresses(value);
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
        setIsValid(false);
      }
    }, 300);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [value]);

  // Vérifier si l'adresse est valide
  useEffect(() => {
    if (value.trim() && suggestions.length > 0) {
      const exactMatch = suggestions.find(suggestion => 
        suggestion.display_name.toLowerCase().includes(value.toLowerCase())
      );
      setIsValid(!!exactMatch);
    } else {
      setIsValid(false);
    }
  }, [value, suggestions]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    onChange(newValue);
  };

  const handleSuggestionClick = (suggestion: AddressSuggestion) => {
    const cleanAddress = formatCleanAddress(suggestion);
    onChange(cleanAddress);
    onAddressSelect(suggestion);
    setShowSuggestions(false);
    setIsValid(true);
  };

  const handleInputFocus = () => {
    if (suggestions.length > 0) {
      setShowSuggestions(true);
    }
  };

  const handleInputBlur = () => {
    // Délai pour permettre le clic sur les suggestions
    setTimeout(() => {
      setShowSuggestions(false);
    }, 200);
  };

  const formatAddress = (suggestion: AddressSuggestion) => {
    const parts = [];
    if (suggestion.address?.house_number) parts.push(suggestion.address.house_number);
    if (suggestion.address?.road) parts.push(suggestion.address.road);
    if (suggestion.address?.postcode) parts.push(suggestion.address.postcode);
    if (suggestion.address?.city) parts.push(suggestion.address.city);
    
    return parts.join(' ') || suggestion.display_name;
  };

  const formatSimpleAddress = (suggestion: AddressSuggestion) => {
    const parts = [];
    if (suggestion.address?.house_number) parts.push(suggestion.address.house_number);
    if (suggestion.address?.road) parts.push(suggestion.address.road);
    if (suggestion.address?.postcode) parts.push(suggestion.address.postcode);
    if (suggestion.address?.city) parts.push(suggestion.address.city);
    
    return parts.join(' ') || suggestion.display_name;
  };

  const formatCleanAddress = (suggestion: AddressSuggestion) => {
    // Extraire seulement les informations essentielles
    const address = suggestion.address;
    if (!address) return suggestion.display_name;

    const parts = [];
    
    // Numéro et rue
    if (address.house_number && address.road) {
      parts.push(`${address.house_number} ${address.road}`);
    } else if (address.road) {
      parts.push(address.road);
    }
    
    // Code postal et ville
    if (address.postcode && address.city) {
      parts.push(`${address.postcode} ${address.city}`);
    }
    
    return parts.join(', ') || suggestion.display_name;
  };

  return (
    <div className={`relative ${className}`}>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          {isLoading ? (
            <Search className="h-4 w-4 text-gray-400 animate-spin" />
          ) : isValid ? (
            <CheckCircle className="h-4 w-4 text-green-500" />
          ) : error ? (
            <AlertCircle className="h-4 w-4 text-red-500" />
          ) : (
            <MapPin className="h-4 w-4 text-gray-400" />
          )}
        </div>
        
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
          placeholder={placeholder}
          className={`
            w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent
            ${isValid ? 'border-green-300 bg-green-50' : error ? 'border-red-300 bg-red-50' : 'border-gray-300'}
          `}
        />
      </div>

      {/* Suggestions */}
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {suggestions.map((suggestion, index) => (
            <div
              key={index}
              onClick={() => handleSuggestionClick(suggestion)}
              className="px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
            >
              <div className="flex items-start">
                <MapPin className="h-4 w-4 text-gray-400 mt-0.5 mr-3 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-gray-900">
                    {formatCleanAddress(suggestion)}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Messages d'état */}
      {error && (
        <div className="mt-1 text-xs text-red-600 flex items-center">
          <AlertCircle className="h-3 w-3 mr-1" />
          {error}
        </div>
      )}
      
      {isValid && !error && (
        <div className="mt-1 text-xs text-green-600 flex items-center">
          <CheckCircle className="h-3 w-3 mr-1" />
          Adresse valide
        </div>
      )}
    </div>
  );
}
