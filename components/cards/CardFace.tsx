import type { Icon as PhosphorIcon } from '@phosphor-icons/react';
import { CompassRose, ArrowsClockwise, Heart, Lightning, Star, Sun } from '@phosphor-icons/react';
import type { TarotCardIcon } from '@/lib/tarot-cards';

const ICONS: Record<TarotCardIcon, PhosphorIcon> = {
  CompassRose,
  ArrowsClockwise,
  Heart,
  Lightning,
  Star,
  Sun,
};

export function CardFace({ icon, size = 48 }: { icon: TarotCardIcon; size?: number }) {
  const Icon = ICONS[icon];
  return <Icon size={size} weight="light" className="text-gold-400" />;
}
