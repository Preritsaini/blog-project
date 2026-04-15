'use server'

import { revalidatePath, revalidateTag } from 'next/cache'
import { saveSiteSettings, type SiteSettings } from '@/lib/firestore/settings'

export async function updateSiteSettings(
  _prevState: { success?: boolean; error?: string },
  formData: FormData
): Promise<{ success?: boolean; error?: string }> {
  try {
    const data: Partial<SiteSettings> = {
      siteName:        (formData.get('siteName')        as string) || undefined,
      tagline:         (formData.get('tagline')         as string) || undefined,
      coachName:       (formData.get('coachName')       as string) || undefined,
      coachPhoto:      (formData.get('coachPhoto')      as string) ?? undefined,
      twitterHandle:   (formData.get('twitterHandle')   as string) || undefined,

      heroHeadline:    (formData.get('heroHeadline')    as string) || undefined,
      heroSubheadline: (formData.get('heroSubheadline') as string) || undefined,
      heroBody:        (formData.get('heroBody')        as string) || undefined,

      aboutHeadline:   (formData.get('aboutHeadline')   as string) || undefined,
      aboutBio1:       (formData.get('aboutBio1')       as string) || undefined,
      aboutBio2:       (formData.get('aboutBio2')       as string) || undefined,
      aboutBio3:       (formData.get('aboutBio3')       as string) || undefined,
      credentials:     (formData.get('credentials')     as string) || undefined,

      instagramUrl:    (formData.get('instagramUrl')    as string) || undefined,
      twitterUrl:      (formData.get('twitterUrl')      as string) || undefined,
      facebookUrl:     (formData.get('facebookUrl')     as string) || undefined,

      colorCream:      (formData.get('colorCream')      as string) || undefined,
      colorMist:       (formData.get('colorMist')       as string) || undefined,
      colorLavender:   (formData.get('colorLavender')   as string) || undefined,
      colorPlumDeep:   (formData.get('colorPlumDeep')   as string) || undefined,
      colorSage:       (formData.get('colorSage')       as string) || undefined,
      colorGold:       (formData.get('colorGold')       as string) || undefined,
      colorCharcoal:   (formData.get('colorCharcoal')   as string) || undefined,

      siteDescription: (formData.get('siteDescription') as string) || undefined,
      ogImage:         (formData.get('ogImage')         as string) ?? undefined,
    }

    const clean = Object.fromEntries(
      Object.entries(data).filter(([, v]) => v !== undefined)
    ) as Partial<SiteSettings>

    await saveSiteSettings(clean)

    // Bust the settings cache tag — all pages using getSiteSettings() will re-fetch
    revalidateTag('settings')
    // Also bust path-level ISR cache for every public page
    revalidatePath('/', 'layout')

    return { success: true }
  } catch (err) {
    console.error('updateSiteSettings error:', err)
    return { error: 'Failed to save settings. Please try again.' }
  }
}
