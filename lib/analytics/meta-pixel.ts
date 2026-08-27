// Supports multiple simultaneous Pixel IDs — add more via NEXT_PUBLIC_META_PIXEL_IDS
// as a comma-separated list (see TAROT-AI-SPEC-V2.md#4).
export const META_PIXEL_IDS = (process.env.NEXT_PUBLIC_META_PIXEL_IDS ?? '1860942371979605')
  .split(',')
  .map((id) => id.trim())
  .filter(Boolean);

export const metaPixelSnippet = `!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
${META_PIXEL_IDS.map((id) => `fbq('init', '${id}');`).join('\n')}
fbq('track', 'PageView');`;
