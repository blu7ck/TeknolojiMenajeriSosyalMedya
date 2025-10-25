"use client"

import { useState, useEffect } from "react"
import { X, Plus } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { Instagram, Youtube, Music2, Twitter, Facebook, Linkedin } from "lucide-react"

const socialMediaPlatforms = [
  { value: "Instagram", label: "Instagram", icon: Instagram },
  { value: "YouTube", label: "YouTube", icon: Youtube },
  { value: "TikTok", label: "TikTok", icon: Music2 },
  { value: "Twitter", label: "Twitter", icon: Twitter },
  { value: "Facebook", label: "Facebook", icon: Facebook },
  { value: "LinkedIn", label: "LinkedIn", icon: Linkedin },
]

interface AnimatedQuoteButtonProps {
  packageTitle?: string
  packagePrice?: string
  selectedModules?: string[]
}

export default function AnimatedQuoteButton({ 
  packageTitle = "Özel Paket", 
  packagePrice = "Fiyat Teklifi", 
  selectedModules = [] 
}: AnimatedQuoteButtonProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [socialMediaFields, setSocialMediaFields] = useState<Array<{ id: string; platform: string; value: string }>>([])
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)

  const handleExpand = () => {
    setIsExpanded(true)
  }

  const handleClose = () => {
    setIsExpanded(false)
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

  useEffect(() => {
    if (isExpanded) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }
  }, [isExpanded])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Form verilerini topla
    const formData = new FormData(e.target as HTMLFormElement)
    const data = {
      name: formData.get('name'),
      surname: formData.get('surname'),
      email: formData.get('email'),
      phone: formData.get('phone'),
      corporateInfo: formData.get('corporate-info'),
      packageTitle,
      packagePrice,
      selectedModules,
      socialMediaAccounts: socialMediaFields
    }

    console.log('Teklif formu gönderildi:', data)
    
    // Burada API çağrısı yapılabilir
    // await submitQuoteRequest(data)
    
    // Başarı mesajı göster
    alert('Teklif talebiniz başarıyla gönderildi! En kısa sürede size dönüş yapacağız.')
    
    // Formu kapat
    handleClose()
  }

  return (
    <>
      <div className="relative flex items-center justify-center">
        <AnimatePresence initial={false}>
          {!isExpanded && (
            <motion.div className="inline-block relative">
              <motion.div
                style={{
                  borderRadius: "100px",
                }}
                layout
                layoutId="cta-card"
                className="absolute inset-0 bg-[#DC2626] items-center justify-center transform-gpu will-change-transform"
              ></motion.div>
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                exit={{ opacity: 0, scale: 0.8 }}
                layout={false}
                onClick={handleExpand}
                className="h-15 px-6 sm:px-8 py-3 text-lg sm:text-xl font-regular text-[#DBDBDB] tracking-[-0.01em] relative"
              >
                TEKLİF AL
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence initial={false}>
        {isExpanded && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-2">
            <motion.div
              layoutId="cta-card"
              transition={{ duration: 0.3 }}
              style={{
                borderRadius: "24px",
              }}
              layout
              className="relative flex h-full w-full overflow-y-auto bg-[#DC2626] transform-gpu will-change-transform"
            >
              <motion.div
                initial={{ opacity: 0, scale: 2 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                layout={false}
                transition={{ duration: 0.15, delay: 0.05 }}
                className="absolute h-full inset-0 overflow-hidden pointer-events-none"
                style={{
                  borderRadius: "24px",
                }}
              >
                {/* Gradient background */}
                <div className="inset-0 sticky top-0 bg-gradient-to-br from-[#DC2626] via-[#991B1B] to-[#7F1D1D]" style={{ height: "100%", width: "100%" }} />
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.15, duration: 0.4 }}
                className="relative z-10 flex flex-col h-full w-full max-w-[1200px] mx-auto p-6 sm:p-8 lg:p-12 gap-6"
              >
                <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 h-full overflow-y-auto">
                  <div className="space-y-5">
                    <h2 className="text-xl sm:text-2xl font-semibold text-[#DBDBDB] mb-6 tracking-tight">
                      Kişisel Bilgiler
                    </h2>

                    <div>
                      <label
                        htmlFor="name"
                        className="block text-[10px] font-mono font-normal text-[#DBDBDB] mb-2 tracking-[0.5px] uppercase"
                      >
                        İSİM *
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        required
                        className="w-full px-4 py-2.5 rounded-lg bg-[#DBDBDB]/10 backdrop-blur-sm border border-[#DBDBDB]/20 text-[#DBDBDB] placeholder:text-[#DBDBDB]/50 focus:outline-none focus:ring-2 focus:ring-[#DBDBDB]/40 transition-all text-sm"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="surname"
                        className="block text-[10px] font-mono font-normal text-[#DBDBDB] mb-2 tracking-[0.5px] uppercase"
                      >
                        SOY İSİM *
                      </label>
                      <input
                        type="text"
                        id="surname"
                        name="surname"
                        required
                        className="w-full px-4 py-2.5 rounded-lg bg-[#DBDBDB]/10 backdrop-blur-sm border border-[#DBDBDB]/20 text-[#DBDBDB] placeholder:text-[#DBDBDB]/50 focus:outline-none focus:ring-2 focus:ring-[#DBDBDB]/40 transition-all text-sm"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="email"
                        className="block text-[10px] font-mono font-normal text-[#DBDBDB] mb-2 tracking-[0.5px] uppercase"
                      >
                        E-POSTA *
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        required
                        className="w-full px-4 py-2.5 rounded-lg bg-[#DBDBDB]/10 backdrop-blur-sm border border-[#DBDBDB]/20 text-[#DBDBDB] placeholder:text-[#DBDBDB]/50 focus:outline-none focus:ring-2 focus:ring-[#DBDBDB]/40 transition-all text-sm"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="phone"
                        className="block text-[10px] font-mono font-normal text-[#DBDBDB] mb-2 tracking-[0.5px] uppercase"
                      >
                        TELEFON *
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        required
                        className="w-full px-4 py-2.5 rounded-lg bg-[#DBDBDB]/10 backdrop-blur-sm border border-[#DBDBDB]/20 text-[#DBDBDB] placeholder:text-[#DBDBDB]/50 focus:outline-none focus:ring-2 focus:ring-[#DBDBDB]/40 transition-all text-sm"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="corporate-info"
                        className="block text-[10px] font-mono font-normal text-[#DBDBDB] mb-2 tracking-[0.5px] uppercase"
                      >
                        KURUMSAL BİLGİ (İSTEĞE BAĞLI)
                      </label>
                      <textarea
                        id="corporate-info"
                        name="corporate-info"
                        rows={4}
                        className="w-full px-4 py-3 rounded-lg bg-[#DBDBDB]/10 backdrop-blur-sm border border-[#DBDBDB]/20 text-[#DBDBDB] placeholder:text-[#DBDBDB]/50 focus:outline-none focus:ring-2 focus:ring-[#DBDBDB]/40 transition-all resize-none text-sm"
                      />
                    </div>
                  </div>

                  <div className="space-y-5">
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-xl sm:text-2xl font-semibold text-[#DBDBDB] tracking-tight">
                        Sosyal Medya Hesapları
                      </h2>
                      <button
                        type="button"
                        onClick={addSocialMediaField}
                        className="flex items-center justify-center w-8 h-8 rounded-full bg-[#DBDBDB]/20 hover:bg-[#DBDBDB]/30 transition-colors"
                        aria-label="Sosyal medya hesabı ekle"
                      >
                        <Plus className="w-5 h-5 text-[#DBDBDB]" />
                      </button>
                    </div>

                    <div className="space-y-4">
                      {socialMediaFields.map((field) => {
                        const selectedPlatform = socialMediaPlatforms.find((p) => p.value === field.platform)
                        const SelectedIcon = selectedPlatform?.icon || Instagram

                        return (
                          <div key={field.id} className="space-y-2">
                            <div className="flex items-center gap-2">
                              <div className="relative">
                                <button
                                  type="button"
                                  onClick={() => setOpenDropdown(openDropdown === field.id ? null : field.id)}
                                  className="flex items-center gap-2 px-3 py-2 rounded-lg bg-[#1a1a1a] border border-[#333333] text-[#DBDBDB] hover:bg-[#252525] focus:outline-none focus:ring-2 focus:ring-[#DBDBDB]/40 transition-all text-sm min-w-[140px]"
                                >
                                  <SelectedIcon className="w-4 h-4" />
                                  <span>{field.platform}</span>
                                </button>

                                {openDropdown === field.id && (
                                  <div className="absolute top-full left-0 mt-1 w-full bg-[#1a1a1a] border border-[#333333] rounded-lg shadow-lg overflow-hidden z-10">
                                    {socialMediaPlatforms.map((platform) => {
                                      const Icon = platform.icon
                                      return (
                                        <button
                                          key={platform.value}
                                          type="button"
                                          onClick={() => updatePlatform(field.id, platform.value)}
                                          className="flex items-center gap-2 w-full px-3 py-2 text-[#DBDBDB] hover:bg-[#252525] transition-colors text-sm"
                                        >
                                          <Icon className="w-4 h-4" />
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
                                placeholder="@kullaniciadi, @kullanici2"
                                className="flex-1 px-4 py-2 rounded-lg bg-[#DBDBDB]/10 backdrop-blur-sm border border-[#DBDBDB]/20 text-[#DBDBDB] placeholder:text-[#DBDBDB]/40 focus:outline-none focus:ring-2 focus:ring-[#DBDBDB]/40 transition-all text-sm"
                              />
                              <button
                                type="button"
                                onClick={() => removeSocialMediaField(field.id)}
                                className="flex items-center justify-center w-8 h-8 rounded-full bg-[#DBDBDB]/10 hover:bg-[#DBDBDB]/20 transition-colors"
                                aria-label="Kaldır"
                              >
                                <X className="w-4 h-4 text-[#DBDBDB]" />
                              </button>
                            </div>
                          </div>
                        )
                      })}

                      {socialMediaFields.length === 0 && (
                        <p className="text-[#DBDBDB]/60 text-sm text-center py-8">
                          Sosyal medya hesabı eklemek için + butonuna tıklayın
                        </p>
                      )}
                    </div>

                    <div className="pt-6">
                      <button
                        type="submit"
                        className="w-full px-8 py-3 rounded-full bg-[#DBDBDB] text-[#DC2626] font-semibold hover:bg-[#DBDBDB]/90 transition-colors tracking-[-0.01em] text-base"
                      >
                        Gönder
                      </button>
                    </div>
                  </div>
                </form>
              </motion.div>

              <motion.button
                onClick={handleClose}
                className="absolute right-4 top-4 sm:right-6 sm:top-6 z-10 flex h-10 w-10 items-center justify-center text-[#DBDBDB] bg-[#DBDBDB]/10 hover:bg-[#DBDBDB]/20 transition-colors rounded-full"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </motion.button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  )
}
