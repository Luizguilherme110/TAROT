import { GenieAvatar } from './GenieAvatar';
import { GenieSpeechBubble } from './GenieSpeechBubble';
import type { GenieLine } from '@/lib/genie-lines';

export function GenieCompanion({ mood, line }: GenieLine) {
  return (
    <div className="pointer-events-none fixed right-4 top-36 z-20 md:right-8 md:top-40">
      {/* Avatar sits at a fixed spot; the bubble is positioned absolutely
          above it instead of stacking in flex flow, so the avatar never
          shifts when the bubble mounts/unmounts. */}
      <div className="relative flex justify-end">
        <div className="pointer-events-auto">
          <GenieAvatar mood={mood} size="sm" />
        </div>
        <div className="pointer-events-auto absolute right-0 bottom-full mb-2">
          <GenieSpeechBubble line={line} />
        </div>
      </div>
    </div>
  );
}
