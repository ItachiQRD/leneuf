// Coordonnées du restaurant : 9 Route de Bétheny, 51450 Bétheny
// Ajustez si nécessaire avec des coordonnées GPS plus précises
export const RESTAURANT_COORDS = { lat: 49.2891, lon: 4.0592 };

export interface DeliveryZone {
  maxKm: number;
  fee: number;
  minOrder: number;
  label: string;
}

export const DELIVERY_ZONES: DeliveryZone[] = [
  { maxKm: 3,   fee: 0,    minOrder: 15, label: '0 – 3 km'  },
  { maxKm: 5,   fee: 2,    minOrder: 20, label: '3 – 5 km'  },
  { maxKm: 7,   fee: 3.50, minOrder: 25, label: '5 – 7 km'  },
];

export const MAX_DELIVERY_KM = 7;

export function getDeliveryZone(km: number): DeliveryZone | null {
  for (const zone of DELIVERY_ZONES) {
    if (km <= zone.maxKm) return zone;
  }
  return null; // hors zone
}
