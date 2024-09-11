export interface EventData {
    id: any;
    timestamp: string;
    eventType: string;
    siteId: string;
    details: {
      [key: string]: any;
      thresholds?: Array<{
        botright: { x: number; y: number };
        topleft: { x: number; y: number };
        mean: any;
        peak: any; 
        threshold: number;
      }>;
    };
    isCritical?: boolean;
    threshold?: number; 
    trigger?: boolean;
    thresholds?: Array<{ threshold: number }>;
  }