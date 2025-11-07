"use client"

import { useState } from "react"
import { X, Plus } from "lucide-react"
import { motion } from "framer-motion"
import { Instagram, Youtube, Music2, Twitter, Facebook, Linkedin } from "lucide-react"
import { createClient } from "../lib/supabase/client"
import { getUserIP } from "../lib/blog-utils"
import { useTranslation } from "react-i18next"
import styled, { keyframes } from "styled-components"

const socialMediaPlatforms = [
  { value: "Instagram", label: "Instagram", icon: Instagram },
  { value: "YouTube", label: "YouTube", icon: Youtube },
  { value: "TikTok", label: "TikTok", icon: Music2 },
  { value: "Twitter", label: "Twitter", icon: Twitter },
  { value: "Facebook", label: "Facebook", icon: Facebook },
  { value: "LinkedIn", label: "LinkedIn", icon: Linkedin }
]

const glitchSlices = keyframes`
  0% {
    clip-path: var(--move1);
    transform: translate(0px, -8px);
  }
  10% {
    clip-path: var(--move2);
    transform: translate(-10px, 8px);
  }
  20% {
    clip-path: var(--move3);
    transform: translate(8px, -2px);
  }
  30% {
    clip-path: var(--move4);
    transform: translate(-6px, 10px);
  }
  40% {
    clip-path: var(--move5);
    transform: translate(10px, -8px);
  }
  50% {
    clip-path: var(--move6);
    transform: translate(-8px, 6px);
  }
  60% {
    clip-path: var(--move1);
    transform: translate(6px, -8px);
  }
  70% {
    clip-path: var(--move3);
    transform: translate(-8px, 8px);
  }
  80% {
    clip-path: var(--move2);
    transform: translate(8px, -8px);
  }
  90% {
    clip-path: var(--move4);
    transform: translate(-10px, 10px);
  }
  100% {
    clip-path: var(--move1);
    transform: translate(0);
  }
`

const GlitchButton = styled(motion.button)`
  --move1: inset(50% 50% 50% 50%);
  --move2: inset(35% 0 42% 0);
  --move3: inset(40% 0 15% 0);
  --move4: inset(48% 0 38% 0);
  --move5: inset(46% 0 10% 0);
  --move6: inset(18% 0 60% 0);

  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.85rem 3rem;
  border: none;
  border-radius: 999px;
  background: linear-gradient(135deg, #f43f5e 0%, #ec4899 45%, #fbbf24 100%);
  color: #ffffff;
  font-size: 0.95rem;
  font-weight: 700;
  letter-spacing: 0.24em;
  text-transform: uppercase;
  cursor: pointer;
  box-shadow: 0 24px 52px -22px rgba(244, 63, 94, 0.65);
  transition: transform 0.2s ease, box-shadow 0.2s ease, filter 0.2s ease;
  overflow: hidden;
  isolation: isolate;

  &::before {
    content: "";
    position: absolute;
    inset: -2px;
    border-radius: inherit;
    border: 2px solid rgba(255, 255, 255, 0.4);
    opacity: 0;
    transition: opacity 0.25s ease;
    pointer-events: none;
  }

  &::after {
    content: attr(data-label);
    position: absolute;
    inset: 0;
    display: grid;
    place-items: center;
    border-radius: inherit;
    color: #ffffff;
    clip-path: var(--move1);
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.15), rgba(255, 255, 255, 0));
    text-shadow: -3px -3px 0px rgba(29, 242, 240, 0.8), 3px 3px 0px rgba(233, 75, 232, 0.8);
    opacity: 0;
    pointer-events: none;
  }

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 28px 60px -24px rgba(244, 63, 94, 0.72);
  }

  &:hover::before {
    opacity: 1;
  }

  &:hover::after {
    animation: ${glitchSlices} 1s steps(2, end);
    opacity: 1;
  }

  &:focus-visible {
    outline: none;
    box-shadow: 0 0 0 4px rgba(244, 114, 182, 0.35), 0 24px 52px -22px rgba(244, 63, 94, 0.65);
  }

  &:disabled,
  &[aria-disabled="true"] {
    cursor: not-allowed;
    filter: grayscale(0.4);
    box-shadow: none;
  }

  &:disabled::after,
  &[aria-disabled="true"]::after {
    display: none;
  }
`
interface QuoteButtonProps {
  packageTitle?: string
  packagePrice?: string
  selectedModules?: string[]
  disabled?: boolean
  expanded?: boolean
  onExpandChange?: (expanded: boolean) => void
}

export default function QuoteButton({
  packageTitle,
  packagePrice,
  selectedModules = [],
  disabled = false,
  expanded,
  onExpandChange
}: QuoteButtonProps) {
  const { t } = useTranslation()
  const safePackageTitle = packageTitle ?? t("packages.section.fallbackTitle")
  const safePackagePrice = packagePrice ?? t("packages.section.fallbackPrice")
  const [internalExpanded, setInternalExpanded] = useState(false)
  const [socialMediaFields, setSocialMediaFields] = useState<Array<{ id: string; platform: string; value: string }>>([])
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)

  const isControlled = typeof expanded === "boolean"
  const isExpanded = isControlled ? expanded : internalExpanded

  const setExpanded = (value: boolean) => {
    if (!isControlled) {
      setInternalExpanded(value)
    }
    onExpandChange?.(value)
  }

  const handleExpand = () => {
    if (disabled) return
    setExpanded(!isExpanded)
  }

  const handleClose = () => {
    setExpanded(false)
  }

  const addSocialMediaField = () => {
    setSocialMediaFields([...socialMediaFields, { id: Date.now().toString(), platform: "Instagram", value: "" }])
  }

  const removeSocialMediaField = (id: string) => {
    setSocialMediaFields(socialMediaFields.filter((field) => field.id !== id))
  }

  const updatePlatform = (id: string, platform: string) => {
    setSocialMediaFields(socialMediaFields.map((field) => (field.id === id ? { ...field, platform } : field)))
    setOpenDropdown(null)
  }

  const updateValue = (id: string, value: string) => {
    setSocialMediaFields(socialMediaFields.map((field) => (field.id === id ? { ...field, value } : field)))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      // Form verilerini topla
      const formData = new FormData(e.target as HTMLFormElement)
      const data = {
        name: formData.get('name') as string,
        surname: formData.get('surname') as string,
        email: formData.get('email') as string,
        phone: formData.get('phone') as string,
        corporateInfo: formData.get('corporate-info') as string,
        packageTitle,
        packagePrice,
        selectedModules,
        socialMediaAccounts: socialMediaFields,
        createdAt: new Date().toISOString()
      }

      console.log('Teklif formu gönderiliyor:', data)

      // Supabase client oluştur
      const supabase = createClient()

      // Veritabanına kaydet
      const { data: quoteData, error: quoteError } = await supabase
        .from('package_requests')
        .insert([
          {
            first_name: data.name,
            last_name: data.surname,
            email: data.email,
            phone: data.phone,
            company_info: data.corporateInfo,
            package_type: 'custom', // veya packageTitle'dan türetilebilir
            package_title: data.packageTitle,
            selected_modules: data.selectedModules,
            social_media_accounts: data.socialMediaAccounts,
            status: 'pending',
            ip_address: await getUserIP(),
            user_agent: navigator.userAgent
          }
        ])
        .select()

      if (quoteError) {
        console.error('Veritabanı hatası:', quoteError)
        alert(t("quote.notifications.dbError"))
        return
      }

      console.log('Teklif başarıyla kaydedildi:', quoteData)

      // Mail gönderimi için mevcut send-email function'ını kullan
      try {
        console.log('Mail gönderim parametreleri:', {
          type: 'package_request',
          to: 'furkan@fixurelabs.dev,mucahit@fixurelabs.dev',
          data: {
            package: data.packageTitle,
            modules: data.selectedModules,
            formData: {
              firstName: data.name,
              lastName: data.surname,
              email: data.email,
              phone: data.phone,
              companyInfo: data.corporateInfo,
              socialMedia: data.socialMediaAccounts.map(account => ({
                platform: account.platform,
                username: account.value || ''
              }))
            }
          }
        })

        const { data: emailData, error: emailError } = await supabase.functions.invoke('send-email', {
          body: {
            type: 'package_request',
            to: 'furkan@fixurelabs.dev,mucahit@fixurelabs.dev',
            data: {
              package: data.packageTitle,
              modules: data.selectedModules,
              formData: {
                firstName: data.name,
                lastName: data.surname,
                email: data.email,
                phone: data.phone,
                companyInfo: data.corporateInfo,
              socialMedia: data.socialMediaAccounts.map(account => ({
                platform: account.platform,
                username: account.value || ''
              }))
              }
            }
          }
        })

        if (emailError) {
          console.error('Mail gönderim hatası:', emailError)
          console.error('Email error details:', JSON.stringify(emailError, null, 2))
          // Mail hatası olsa bile veritabanına kaydedildi, kullanıcıya bilgi ver
          alert(t("quote.notifications.emailError"))
        } else {
          console.log('Mail başarıyla gönderildi:', emailData)
          alert(t("quote.notifications.success"))
        }
      } catch (emailError) {
        console.error('Mail gönderim hatası:', emailError)
        // Mail hatası olsa bile veritabanına kaydedildi, kullanıcıya bilgi ver
        alert(t("quote.notifications.emailError"))
      }
      
      // Formu kapat
      handleClose()
      
    } catch (error) {
      console.error('Form gönderim hatası:', error)
      alert(t("quote.notifications.genericError"))
    }
  }

  const buttonText = isExpanded
    ? t("quote.closeButtonLabel", { defaultValue: "Formu Kapat" })
    : t("quote.buttonLabel")

  if (!isExpanded) {
    return (
      <div className="flex justify-center">
        <GlitchButton
          data-label={buttonText}
          layoutId="quote-card"
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.25 }}
          onClick={handleExpand}
          disabled={disabled}
          aria-disabled={disabled}
          aria-expanded={isExpanded}
          whileHover={disabled ? undefined : { translateY: -2 }}
          whileTap={disabled ? undefined : { scale: 0.97 }}
        >
          {buttonText}
        </GlitchButton>
      </div>
    )
  }

  return (
    <motion.div
      layoutId="quote-card"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 30 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="relative mx-auto w-full max-w-5xl overflow-hidden rounded-[32px] border border-rose-100 bg-white/85 px-6 py-10 shadow-[0_45px_140px_-60px_rgba(244,114,182,0.55)] backdrop-blur"
    >
      <div className="pointer-events-none absolute inset-0 opacity-70 bg-[radial-gradient(circle_at_20%_20%,rgba(255,228,230,0.85),transparent_65%),radial-gradient(circle_at_80%_10%,rgba(236,233,254,0.9),transparent_60%),radial-gradient(circle_at_50%_80%,rgba(254,249,245,0.9),transparent_60%)]" />

      <button
        type="button"
        onClick={handleClose}
        className="absolute right-6 top-6 z-20 flex h-10 w-10 items-center justify-center rounded-full border border-white/60 bg-white/95 text-rose-400 transition-colors hover:text-rose-600"
        aria-label={t("quote.form.aria.close")}
      >
        <X className="h-5 w-5" />
      </button>

      <div className="relative z-10 flex flex-col gap-10">
        <div className="rounded-3xl border border-rose-100 bg-white/80 p-6 shadow-[0_20px_55px_-45px_rgba(244,114,182,0.65)]">
          <h3 className="text-[11px] font-semibold uppercase tracking-[0.32em] text-rose-500">
            {t("quote.summary.selectedPackage")}
          </h3>
          <p className="mt-3 text-2xl font-bold tracking-tight text-slate-900">{safePackageTitle}</p>
          <p className="text-sm text-slate-500">{safePackagePrice}</p>

          {selectedModules.length > 0 && (
            <div className="mt-4">
              <h4 className="text-xs font-semibold uppercase tracking-[0.2em] text-rose-400">
                {t("quote.summary.selectedModules")}
              </h4>
              <div className="mt-2 flex flex-wrap gap-2">
                {selectedModules.map((module, index) => (
                  <span
                    key={index}
                    className="rounded-full border border-rose-100 bg-rose-50/80 px-3 py-1 text-xs font-medium text-rose-500 shadow-sm"
                  >
                    {module}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:gap-12"
        >
          <div className="space-y-6 rounded-3xl border border-slate-200 bg-white/85 p-6 shadow-sm">
            <h2 className="text-xl font-semibold tracking-tight text-slate-900 sm:text-2xl">
              {t("quote.form.personalInfoTitle")}
            </h2>

            <fieldset className="space-y-4">
              <label className="block space-y-2">
                <span className="text-xs font-semibold uppercase tracking-[0.32em] text-slate-500">
                  {t("quote.form.labels.name")}
                </span>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  className="w-full rounded-xl border border-slate-200 bg-white/90 px-4 py-2.5 text-sm text-slate-900 shadow-inner transition-all focus:border-rose-300 focus:outline-none focus:ring-2 focus:ring-rose-200"
                />
              </label>
              <label className="block space-y-2">
                <span className="text-xs font-semibold uppercase tracking-[0.32em] text-slate-500">
                  {t("quote.form.labels.surname")}
                </span>
                <input
                  type="text"
                  id="surname"
                  name="surname"
                  required
                  className="w-full rounded-xl border border-slate-200 bg-white/90 px-4 py-2.5 text-sm text-slate-900 shadow-inner transition-all focus:border-rose-300 focus:outline-none focus:ring-2 focus:ring-rose-200"
                />
              </label>
              <label className="block space-y-2">
                <span className="text-xs font-semibold uppercase tracking-[0.32em] text-slate-500">
                  {t("quote.form.labels.email")}
                </span>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  className="w-full rounded-xl border border-slate-200 bg-white/90 px-4 py-2.5 text-sm text-slate-900 shadow-inner transition-all focus:border-rose-300 focus:outline-none focus:ring-2 focus:ring-rose-200"
                />
              </label>
              <label className="block space-y-2">
                <span className="text-xs font-semibold uppercase tracking-[0.32em] text-slate-500">
                  {t("quote.form.labels.phone")}
                </span>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  required
                  className="w-full rounded-xl border border-slate-200 bg-white/90 px-4 py-2.5 text-sm text-slate-900 shadow-inner transition-all focus:border-rose-300 focus:outline-none focus:ring-2 focus:ring-rose-200"
                />
              </label>
              <label className="block space-y-2">
                <span className="text-xs font-semibold uppercase tracking-[0.32em] text-slate-500">
                  {t("quote.form.labels.corporateInfo")}
                </span>
                <input
                  type="text"
                  id="corporate-info"
                  name="corporate-info"
                  className="w-full rounded-xl border border-slate-200 bg-white/90 px-4 py-2.5 text-sm text-slate-900 shadow-inner transition-all focus:border-rose-300 focus:outline-none focus:ring-2 focus:ring-rose-200"
                />
              </label>
            </fieldset>
          </div>

          <div className="space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-3xl border border-slate-200 bg-white/85 p-6 shadow-sm">
              <h2 className="text-xl font-semibold tracking-tight text-slate-900 sm:text-2xl">
                {t("quote.form.socialAccountsTitle")}
              </h2>
              <button
                type="button"
                onClick={addSocialMediaField}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-rose-100 bg-rose-50/80 text-rose-500 transition-colors hover:bg-rose-100"
                aria-label={t("quote.form.aria.add")}
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-4 rounded-3xl border border-dashed border-rose-100/70 bg-white/70 p-4 shadow-inner">
              {socialMediaFields.length === 0 && (
                <p className="py-8 text-center text-sm text-rose-400">
                  {t("quote.form.emptySocialInfo")}
                </p>
              )}

              {socialMediaFields.map((field) => {
                const selectedPlatform = socialMediaPlatforms.find((p) => p.value === field.platform)
                const SelectedIcon = selectedPlatform?.icon || Instagram

                return (
                  <div key={field.id} className="rounded-2xl border border-slate-200 bg-white/90 p-4 shadow-sm">
                    <div className="flex flex-col gap-3 md:flex-row md:items-center">
                      <div className="relative">
                        <button
                          type="button"
                          onClick={() => setOpenDropdown(openDropdown === field.id ? null : field.id)}
                          className="flex min-w-[160px] items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-inner transition-all hover:border-rose-200 focus:outline-none focus:ring-2 focus:ring-rose-200"
                        >
                          <SelectedIcon className="h-4 w-4 text-rose-400" />
                          <span>{field.platform}</span>
                        </button>

                        {openDropdown === field.id && (
                          <div className="absolute top-full left-0 z-10 mt-2 w-full overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl">
                            {socialMediaPlatforms.map((platform) => {
                              const Icon = platform.icon
                              return (
                                <button
                                  key={platform.value}
                                  type="button"
                                  onClick={() => updatePlatform(field.id, platform.value)}
                                  className="flex w-full items-center gap-2 px-3 py-2 text-sm text-slate-700 transition-colors hover:bg-rose-50"
                                >
                                  <Icon className="h-4 w-4 text-rose-400" />
                                  <span>{platform.label}</span>
                                </button>
                              )
                            })}
                          </div>
                        )}
                      </div>

                      <input
                        type="text"
                        value={field.value}
                        onChange={(e) => updateValue(field.id, e.target.value)}
                        placeholder={t("quote.form.placeholderUsername")}
                        className="flex-1 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm text-slate-700 shadow-inner transition-all placeholder:text-slate-400 focus:border-rose-200 focus:outline-none focus:ring-2 focus:ring-rose-200"
                      />
                      <button
                        type="button"
                        onClick={() => removeSocialMediaField(field.id)}
                        className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-400 transition-colors hover:text-rose-400"
                        aria-label={t("quote.form.aria.remove")}
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-sm">
              <button
                type="submit"
                className="w-full rounded-full bg-gradient-to-r from-rose-500 via-pink-500 to-amber-400 px-8 py-3 text-base font-semibold uppercase tracking-[0.18em] text-white shadow-[0_22px_45px_-20px_rgba(244,114,182,0.65)] transition-all hover:shadow-[0_28px_60px_-24px_rgba(244,114,182,0.7)] focus:outline-none focus:ring-2 focus:ring-rose-200 focus:ring-offset-2 focus:ring-offset-white"
              >
                {t("quote.form.submit")}
              </button>
            </div>
          </div>
        </form>
      </div>
    </motion.div>
  )
}
