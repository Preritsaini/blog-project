import type { SiteSettings } from '@/lib/firestore/settings'

interface Props {
  settings: SiteSettings
}

/**
 * Injects a <style> tag that overrides the CSS custom properties
 * with whatever colours are stored in Firestore.
 * Rendered server-side — zero JS overhead.
 */
export default function DynamicStyles({ settings: s }: Props) {
  const css = `
    :root {
      --color-cream:     ${s.colorCream     || '#F7F3EE'};
      --color-mist:      ${s.colorMist      || '#EEE8F2'};
      --color-lavender:  ${s.colorLavender  || '#8E79A8'};
      --color-plum-deep: ${s.colorPlumDeep  || '#4A365A'};
      --color-sage:      ${s.colorSage      || '#9CAF9A'};
      --color-gold:      ${s.colorGold      || '#C9A86A'};
      --color-charcoal:  ${s.colorCharcoal  || '#2C2433'};
      --background: var(--color-cream);
      --foreground: var(--color-charcoal);
    }
  `.trim()

  return <style dangerouslySetInnerHTML={{ __html: css }} />
}
