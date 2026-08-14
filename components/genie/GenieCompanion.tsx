import { GenieAvatar } from './GenieAvatar';
import { GenieSpeechBubble } from './GenieSpeechBubble';
import type { GenieLine } from '@/lib/genie-lines';

export function GenieCompanion({ mood, line }: GenieLine) {
  return (
    // Inline companion, part of the question's own content block instead of
    // fixed to a viewport corner - the genie now reads as talking directly
    // about the question below it, not floating disconnected from it. The
    // avatar's fixed height (88px at size="sm") keeps this row's height
    // stable regardless of whether the bubble is currently showing, so its
    // ~4.5s auto-hide never reflows the question content beneath it.
    <div className="flex min-h-[88px] w-full items-start gap-3">
      <GenieAvatar mood={mood} size="sm" />
      <GenieSpeechBubble line={line} />
    </div>
  );
}
