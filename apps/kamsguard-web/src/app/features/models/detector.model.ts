

export interface Device {
  siteId: string;           // Outer site identifier (e.g., "Kamsware-FV3")
  deviceId: string;         // Nested device identifier (e.g., "1-Kamsware-FV3")
  lastActiveTime: Date;   // ISO string format
}
