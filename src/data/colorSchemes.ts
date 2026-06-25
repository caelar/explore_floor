import type { ArchetypeId, ColorScheme } from './types';

// Archetype → color scheme mapping (DESIGN_SYSTEM §3.3). The build logic picks one based on
// the user's dominant archetype after scoring. Accents are the locked ARM brand colors;
// never invent a new color for an archetype. `arm-gold` is reserved for global brand
// signature, so it backs the neutral default used before scoring resolves.

export const colorSchemes: Record<ArchetypeId, ColorScheme> = {
  builder: {
    id: 'builder',
    accentToken: 'arm-orange',
    accentHex: '#F56A00',
    name: 'Builder orange',
  },
  innovator: {
    id: 'innovator',
    accentToken: 'arm-blue',
    accentHex: '#38A5EE',
    name: 'Innovator blue',
  },
  architect: {
    id: 'architect',
    accentToken: 'arm-teal',
    accentHex: '#117289',
    name: 'Architect teal',
  },
};

/** Used by assembleRobot before a dominant archetype is known (live build). */
export const defaultColorScheme: ColorScheme = {
  id: 'default',
  accentToken: 'arm-gold',
  accentHex: '#FFB81C',
  name: 'Default gold',
};
