
// Interface personnalisée pour les entrées de changement de mise en page
interface LayoutShiftEntry extends PerformanceEntry {
    hadRecentInput: boolean;
    value: number;
    sources: Array<{
      node?: Node;
      currentRect?: DOMRectReadOnly;
      previousRect?: DOMRectReadOnly;
    }>;
  }
  
  // Interface pour les entrées de plus grand rendu
  interface LargestContentfulPaintEntry extends PerformanceEntry {
    element: Element;
    renderTime: number;
    loadTime: number;
    size: number;
    url: string;
    id: string;
  }
  
  // Interface pour les entrées de première peinture
  interface PaintEntry extends PerformanceEntry {
    duration: number;
    entryType: 'paint';
    name: 'first-paint' | 'first-contentful-paint';
    startTime: number;
  }
  
  export function usePerformanceMonitoring() {
    // Mesure le First Contentful Paint (FCP)
    const measureFCP = () => {
      if (typeof window === 'undefined') return;
  
      const fcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach(entry => {
          const paintEntry = entry as PaintEntry;
          if (paintEntry.name === 'first-contentful-paint') {
            console.log(`First Contentful Paint: ${paintEntry.startTime}ms`);
          }
        });
      });
  
      try {
        fcpObserver.observe({ entryTypes: ['paint'] });
      } catch (e) {
        console.warn('Paint timing not supported:', e);
      }
    };
  
    // Mesure le Largest Contentful Paint (LCP)
    const measureLCP = () => {
      if (typeof window === 'undefined') return;
  
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach(entry => {
          const lcpEntry = entry as LargestContentfulPaintEntry;
          console.log(`Largest Contentful Paint: ${lcpEntry.renderTime || lcpEntry.loadTime}ms`);
        });
      });
  
      try {
        lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
      } catch (e) {
        console.warn('Largest Contentful Paint not supported:', e);
      }
    };
  
    // Mesure le Cumulative Layout Shift (CLS)
    const measureCLS = () => {
      if (typeof window === 'undefined') return;
  
      let clsValue = 0;
      let clsEntries: LayoutShiftEntry[] = [];
      
      const clsObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries() as LayoutShiftEntry[];
        
        entries.forEach(entry => {
          // Ne pas compter le changement de mise en page si l'utilisateur a interagi récemment
          if (!entry.hadRecentInput) {
            clsValue += entry.value;
            clsEntries.push(entry);
            
            // Garder seulement les 5 dernières entrées pour le débogage
            if (clsEntries.length > 5) {
              clsEntries = clsEntries.slice(-5);
            }
            
            console.log('Current CLS:', {
              total: clsValue.toFixed(4),
              entries: clsEntries.map(e => ({
                value: e.value.toFixed(4),
                timestamp: new Date(e.startTime).toISOString()
              }))
            });
          }
        });
      });
  
      try {
        clsObserver.observe({ entryTypes: ['layout-shift'] });
      } catch (e) {
        console.warn('Layout Shift observation not supported:', e);
      }
  
      // Nettoyer l'observateur quand le composant est démonté
      return () => clsObserver.disconnect();
    };
  
    const startMonitoring = () => {
      measureFCP();
      measureLCP();
      measureCLS();
    };
  
    return {
      startMonitoring
    };
  }