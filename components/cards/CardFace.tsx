import type { Icon as PhosphorIcon } from '@phosphor-icons/react';
import { CompassRose, ArrowsClockwise, Heart, Lightning, Star, Sun } from '@phosphor-icons/react';
import { LockSimple } from '@phosphor-icons/react/dist/ssr';
import type { TarotCardIcon } from '@/lib/tarot-cards';

const ICONS: Record<TarotCardIcon, PhosphorIcon> = {
  CompassRose,
  ArrowsClockwise,
  Heart,
  Lightning,
  Star,
  Sun,
};

const SIZE_CLASSES = {
  sm: { frame: 'w-16', icon: 24 },
  md: { frame: 'w-24', icon: 34 },
  lg: { frame: 'w-40', icon: 52 },
} as const;

type Props = {
  icon?: TarotCardIcon;
  size?: keyof typeof SIZE_CLASSES;
  locked?: boolean;
};

// A tarot card, not a bare icon: gold-veined frame with a radial glow behind the
// glyph when revealed, or a woven card-back pattern with a lock when it isn't.
export function CardFace({ icon, size = 'md', locked = false }: Props) {
  const { frame, icon: iconSize } = SIZE_CLASSES[size];
  const Icon = icon ? ICONS[icon] : null;

  if (locked || !Icon) {
    return (
      <div
        className={`relative aspect-[3/4] ${frame} shrink-0 overflow-hidden rounded-xl border border-white/10 bg-ink-900`}
      >
        <div
          aria-hidden="true"
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage:
              'repeating-linear-gradient(135deg, rgba(212,162,78,0.12) 0px, rgba(212,162,78,0.12) 1px, transparent 1px, transparent 8px)',
          }}
        />
        <div className="absolute inset-2 rounded-lg border border-dashed border-white/10" />
        <div className="relative flex h-full items-center justify-center">
          <LockSimple size={iconSize * 0.6} weight="light" className="text-parchment-400/70" />
        </div>
      </div>
    );
  }

  return (
    <div
      className={`relative aspect-[3/4] ${frame} shrink-0 overflow-hidden rounded-xl border border-gold-400/40 bg-ink-900`}
    >
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(circle at 50% 38%, rgba(212,162,78,0.22), transparent 65%)',
        }}
      />
      <div className="absolute inset-2 rounded-lg border border-gold-400/20" />
      <div className="relative flex h-full items-center justify-center">
        <Icon size={iconSize} weight="light" className="text-gold-400" />
      </div>
    </div>
  );
}
