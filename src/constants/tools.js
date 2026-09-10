import { BrickWall, Eraser, MapPin, Flag } from '@lucide/vue';
export const tools = [
  { id: 'wall', label: 'Draw walls', icon: BrickWall, key: 'W' },
  { id: 'erase', label: 'Erase', icon: Eraser, key: 'E' },
  { id: 'start', label: 'Start point', icon: MapPin, key: 'S' },
  { id: 'finish', label: 'End point', icon: Flag, key: 'F' },
];
