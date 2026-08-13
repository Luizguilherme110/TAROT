import { GenieAvatar } from '@/components/genie/GenieAvatar';

export default function CartaLoading() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-6 px-6 text-center">
      <GenieAvatar mood="excited" size="md" priority />
      <p className="font-display text-lg text-parchment-100">Preparando as cartas...</p>
      <div className="h-1 w-48 overflow-hidden rounded-full bg-white/10">
        <div className="h-full w-1/3 rounded-full bg-gold-400 [animation:loading-sweep_1.2s_ease-in-out_infinite]" />
      </div>
    </div>
  );
}
