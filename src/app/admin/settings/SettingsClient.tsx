'use client'

import { useState, useActionState } from 'react'
import Image from 'next/image'
import { updateSiteSettings } from '@/actions/settings'
import { uploadFile } from '@/lib/firebase/storage'
import type { SiteSettings } from '@/lib/firestore/settings'

interface Props { settings: SiteSettings }

type Tab = 'branding' | 'hero' | 'about' | 'colours' | 'seo'

const TABS: { id: Tab; label: string }[] = [
  { id: 'branding', label: 'Branding' },
  { id: 'hero',     label: 'Hero'     },
  { id: 'about',    label: 'About'    },
  { id: 'colours',  label: 'Colours'  },
  { id: 'seo',      label: 'SEO'      },
]

const inputCls = 'w-full rounded-lg border border-[var(--color-charcoal)]/15 bg-white px-4 py-2.5 text-sm text-[var(--color-charcoal)] focus:outline-none focus:ring-2 focus:ring-[var(--color-lavender)]'
const textareaCls = `${inputCls} resize-y`
const labelCls = 'block text-sm font-medium text-[var(--color-charcoal)] mb-1.5'
const sectionTitle = 'font-[var(--font-heading)] text-lg font-semibold text-[var(--color-plum-deep)] mb-4'

export default function SettingsClient({ settings }: Props) {
  const [tab, setTab] = useState<Tab>('branding')
  const [s, setS] = useState<SiteSettings>(settings)
  const [uploadingField, setUploadingField] = useState<string | null>(null)
  const [state, formAction] = useActionState(updateSiteSettings, {})

  function field(key: keyof SiteSettings) {
    return {
      name: key,
      value: s[key] as string,
      onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
        setS((prev) => ({ ...prev, [key]: e.target.value })),
    }
  }

  async function handleImageUpload(
    e: React.ChangeEvent<HTMLInputElement>,
    fieldKey: keyof SiteSettings,
    folder: string
  ) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploadingField(fieldKey)
    try {
      const { url } = await uploadFile(file, folder)
      setS((prev) => ({ ...prev, [fieldKey]: url }))
    } catch {
      alert('Upload failed. Please try again.')
    } finally {
      setUploadingField(null)
      e.target.value = ''
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-[var(--font-heading)] text-3xl font-semibold text-[var(--color-plum-deep)]">
          Site Settings
        </h1>
        {state.success && (
          <span className="text-sm text-green-700 bg-green-50 border border-green-200 rounded-lg px-4 py-2">
            ✓ Saved successfully
          </span>
        )}
        {state.error && (
          <span className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-4 py-2">
            {state.error}
          </span>
        )}
      </div>

      {/* Tab bar */}
      <div className="flex gap-1 mb-8 bg-[var(--color-mist)] rounded-xl p-1 w-fit">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              tab === t.id
                ? 'bg-[var(--color-plum-deep)] text-[var(--color-cream)]'
                : 'text-[var(--color-charcoal)]/60 hover:text-[var(--color-charcoal)]'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <form action={formAction} className="max-w-2xl">
        {/* Hidden inputs for ALL fields so the form always submits everything */}
        {(Object.keys(s) as (keyof SiteSettings)[]).map((key) => (
          <input key={key} type="hidden" name={key} value={s[key] as string} />
        ))}

        {/* ── BRANDING ─────────────────────────────────────────────────── */}
        {tab === 'branding' && (
          <div className="flex flex-col gap-6">
            <p className={sectionTitle}>Brand & Identity</p>

            <div>
              <label className={labelCls}>Site Name</label>
              <input type="text" className={inputCls} {...field('siteName')} />
            </div>
            <div>
              <label className={labelCls}>Tagline</label>
              <input type="text" className={inputCls} {...field('tagline')} />
            </div>
            <div>
              <label className={labelCls}>Coach Name</label>
              <input type="text" className={inputCls} {...field('coachName')} />
            </div>
            <div>
              <label className={labelCls}>Twitter / X Handle</label>
              <input type="text" className={inputCls} placeholder="@handle" {...field('twitterHandle')} />
            </div>

            {/* Coach photo */}
            <div>
              <label className={labelCls}>Coach Photo</label>
              {s.coachPhoto && (
                <div className="relative h-48 w-36 rounded-xl overflow-hidden mb-3 border border-[var(--color-lavender)]/20">
                  <Image src={s.coachPhoto} alt="Coach photo" fill className="object-cover" sizes="144px" />
                </div>
              )}
              <label className="flex cursor-pointer items-center gap-2 self-start rounded-lg border border-[var(--color-plum-deep)]/25 bg-white px-4 py-2 text-sm font-medium text-[var(--color-plum-deep)] hover:bg-[var(--color-plum-deep)]/5 transition-colors w-fit">
                {uploadingField === 'coachPhoto' ? 'Uploading…' : s.coachPhoto ? 'Replace photo' : 'Upload photo'}
                <input
                  type="file" accept="image/*" className="sr-only"
                  disabled={uploadingField !== null}
                  onChange={(e) => handleImageUpload(e, 'coachPhoto', 'coach')}
                />
              </label>
            </div>

            <p className={`${sectionTitle} mt-4`}>Social Links</p>
            <div>
              <label className={labelCls}>Instagram URL</label>
              <input type="url" className={inputCls} {...field('instagramUrl')} />
            </div>
            <div>
              <label className={labelCls}>Twitter / X URL</label>
              <input type="url" className={inputCls} {...field('twitterUrl')} />
            </div>
            <div>
              <label className={labelCls}>Facebook URL</label>
              <input type="url" className={inputCls} {...field('facebookUrl')} />
            </div>
          </div>
        )}

        {/* ── HERO ─────────────────────────────────────────────────────── */}
        {tab === 'hero' && (
          <div className="flex flex-col gap-6">
            <p className={sectionTitle}>Homepage Hero Section</p>
            <div>
              <label className={labelCls}>Headline (line 1)</label>
              <input type="text" className={inputCls} {...field('heroHeadline')} />
              <p className="text-xs text-[var(--color-charcoal)]/40 mt-1">e.g. "Find Your Path."</p>
            </div>
            <div>
              <label className={labelCls}>Headline (line 2 — gold colour)</label>
              <input type="text" className={inputCls} {...field('heroSubheadline')} />
              <p className="text-xs text-[var(--color-charcoal)]/40 mt-1">e.g. "Trust Your Soul."</p>
            </div>
            <div>
              <label className={labelCls}>Hero Body Text</label>
              <textarea rows={4} className={textareaCls} {...field('heroBody')} />
            </div>
          </div>
        )}

        {/* ── ABOUT ────────────────────────────────────────────────────── */}
        {tab === 'about' && (
          <div className="flex flex-col gap-6">
            <p className={sectionTitle}>About / Bio Section</p>
            <div>
              <label className={labelCls}>Section Headline</label>
              <input type="text" className={inputCls} {...field('aboutHeadline')} />
            </div>
            <div>
              <label className={labelCls}>Bio — Paragraph 1</label>
              <textarea rows={4} className={textareaCls} {...field('aboutBio1')} />
            </div>
            <div>
              <label className={labelCls}>Bio — Paragraph 2</label>
              <textarea rows={4} className={textareaCls} {...field('aboutBio2')} />
            </div>
            <div>
              <label className={labelCls}>Bio — Paragraph 3</label>
              <textarea rows={4} className={textareaCls} {...field('aboutBio3')} />
            </div>
            <div>
              <label className={labelCls}>Credentials (one per line)</label>
              <textarea rows={6} className={textareaCls} {...field('credentials')} />
              <p className="text-xs text-[var(--color-charcoal)]/40 mt-1">
                Each line becomes one credential badge.
              </p>
            </div>
          </div>
        )}

        {/* ── COLOURS ──────────────────────────────────────────────────── */}
        {tab === 'colours' && (
          <div className="flex flex-col gap-6">
            <p className={sectionTitle}>Colour Palette</p>
            <p className="text-sm text-[var(--color-charcoal)]/55 -mt-3">
              Changes apply site-wide instantly on save.
            </p>

            {([
              ['colorCream',    'Background (Warm Cream)',       '#F7F3EE'],
              ['colorMist',     'Surface / Cards (Soft Mist)',   '#EEE8F2'],
              ['colorLavender', 'Primary Brand (Dusty Lavender)','#8E79A8'],
              ['colorPlumDeep', 'Dark Brand (Deep Plum)',        '#4A365A'],
              ['colorSage',     'CTA Buttons (Sage Green)',      '#9CAF9A'],
              ['colorGold',     'Accent / Gold',                 '#C9A86A'],
              ['colorCharcoal', 'Body Text (Charcoal Plum)',     '#2C2433'],
            ] as [keyof SiteSettings, string, string][]).map(([key, label, placeholder]) => (
              <div key={key} className="flex items-center gap-4">
                <div
                  className="h-10 w-10 rounded-lg border border-[var(--color-charcoal)]/10 flex-shrink-0 shadow-sm"
                  style={{ background: (s[key] as string) || placeholder }}
                />
                <div className="flex-1">
                  <label className={labelCls}>{label}</label>
                  <div className="flex gap-2 items-center">
                    <input
                      type="color"
                      value={(s[key] as string) || placeholder}
                      onChange={(e) => setS((prev) => ({ ...prev, [key]: e.target.value }))}
                      className="h-9 w-14 rounded cursor-pointer border border-[var(--color-charcoal)]/15 p-0.5 bg-white"
                    />
                    <input
                      type="text"
                      className={`${inputCls} font-mono`}
                      placeholder={placeholder}
                      {...field(key)}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── SEO ──────────────────────────────────────────────────────── */}
        {tab === 'seo' && (
          <div className="flex flex-col gap-6">
            <p className={sectionTitle}>SEO & Meta</p>
            <div>
              <label className={labelCls}>Site Description (meta description)</label>
              <textarea rows={4} className={textareaCls} {...field('siteDescription')} />
              <p className="text-xs text-[var(--color-charcoal)]/40 mt-1">
                Aim for 150–160 characters.
              </p>
            </div>

            {/* OG Image */}
            <div>
              <label className={labelCls}>OG / Social Share Image</label>
              {s.ogImage && (
                <div className="relative h-32 w-full rounded-xl overflow-hidden mb-3 border border-[var(--color-lavender)]/20">
                  <Image src={s.ogImage} alt="OG image" fill className="object-cover" sizes="600px" />
                </div>
              )}
              <label className="flex cursor-pointer items-center gap-2 self-start rounded-lg border border-[var(--color-plum-deep)]/25 bg-white px-4 py-2 text-sm font-medium text-[var(--color-plum-deep)] hover:bg-[var(--color-plum-deep)]/5 transition-colors w-fit">
                {uploadingField === 'ogImage' ? 'Uploading…' : s.ogImage ? 'Replace image' : 'Upload OG image'}
                <input
                  type="file" accept="image/*" className="sr-only"
                  disabled={uploadingField !== null}
                  onChange={(e) => handleImageUpload(e, 'ogImage', 'og')}
                />
              </label>
              <p className="text-xs text-[var(--color-charcoal)]/40 mt-2">
                Recommended: 1200 × 630 px
              </p>
            </div>
          </div>
        )}

        {/* Save button */}
        <div className="mt-8 pt-6 border-t border-[var(--color-charcoal)]/10">
          <button
            type="submit"
            className="rounded-lg bg-[var(--color-plum-deep)] px-8 py-3 text-sm font-semibold text-[var(--color-cream)] hover:opacity-90 transition-opacity"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  )
}
