import { GenieAvatar } from './GenieAvatar';
import { GenieSpeechBubble } from './GenieSpeechBubble';
import type { GenieLine } from '@/lib/genie-lines';

export function GenieCompanion({ mood, line }: GenieLine) {
  return (
    <div className="pointer-events-none fixed right-4 top-4 z-20 flex flex-col items-end gap-2 md:right-8 md:top-8">
      <div className="pointer-events-auto">
        <GenieSpeechBubble line={line} />
      </div>
      <div className="pointer-events-auto">
        <GenieAvatar mood={mood} size="sm" />
      </div>
    </div>
  );
}
