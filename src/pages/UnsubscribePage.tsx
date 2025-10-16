import { useState, useEffect } from "react"
import { useSearchParams, useNavigate } from "react-router-dom"
import { createClient } from "../lib/supabase/client"
import { Mail, CheckCircle, XCircle, ArrowLeft } from "lucide-react"

export function UnsubscribePage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [status, setStatus] = useState<"loading" | "success" | "error" | "idle">("idle")
  const [message, setMessage] = useState("")
  const [email, setEmail] = useState("")
  const [subscriber, setSubscriber] = useState<any>(null)

  useEffect(() => {
    const emailParam = searchParams.get("email")
    if (emailParam) {
      setEmail(emailParam)
      checkSubscriber(emailParam)
    } else {
      setStatus("error")
      setMessage("Geçersiz abonelikten ayrılma linki.")
    }
  }, [searchParams])

  const checkSubscriber = async (email: string) => {
    setStatus("loading")
    const supabase = createClient()
    
    const { data, error } = await supabase
      .from("newsletter_subscribers")
      .select("*")
      .eq("email", email)
      .eq("is_active", true)
      .single()

    if (error || !data) {
      setStatus("error")
      setMessage("Bu e-posta adresi ile kayıtlı aktif abonelik bulunamadı.")
    } else {
      setSubscriber(data)
      setStatus("idle")
    }
  }

  const handleUnsubscribe = async () => {
    setStatus("loading")
    const supabase = createClient()
    
    const { error } = await supabase
      .from("newsletter_subscribers")
      .update({ 
        is_active: false,
        unsubscribed_at: new Date().toISOString()
      })
      .eq("email", email)

    if (error) {
      setStatus("error")
      setMessage("Abonelikten ayrılırken bir hata oluştu. Lütfen tekrar deneyin.")
    } else {
      setStatus("success")
      setMessage(`${subscriber?.first_name} ${subscriber?.last_name}, başarıyla abonelikten ayrıldınız.`)
    }
  }

  const handleResubscribe = async () => {
    setStatus("loading")
    const supabase = createClient()
    
    const { error } = await supabase
      .from("newsletter_subscribers")
      .update({ 
        is_active: true,
        unsubscribed_at: null
      })
      .eq("email", email)

    if (error) {
      setStatus("error")
      setMessage("Tekrar abone olurken bir hata oluştu. Lütfen tekrar deneyin.")
    } else {
      setStatus("success")
      setMessage(`${subscriber?.first_name} ${subscriber?.last_name}, tekrar abone oldunuz!`)
      setSubscriber({ ...subscriber, is_active: true })
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-card rounded-2xl shadow-xl border border-border p-8">
          {/* Logo */}
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold tracking-tight text-gray-900">
              <span className="font-mono">Teknoloji</span>
              <span className="text-red-500">Menajeri</span>
            </h1>
            <p className="text-muted-foreground mt-2">Newsletter Yönetimi</p>
          </div>

          {/* Status Messages */}
          {status === "loading" && (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-4 border-red-500 border-t-transparent"></div>
              <span className="ml-3 text-muted-foreground">İşleniyor...</span>
            </div>
          )}

          {status === "error" && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <div className="flex items-center">
                <XCircle className="h-5 w-5 text-red-500 mr-2" />
                <span className="text-red-700 text-sm">{message}</span>
              </div>
            </div>
          )}

          {status === "success" && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                <span className="text-green-700 text-sm">{message}</span>
              </div>
            </div>
          )}

          {/* Subscriber Info */}
          {subscriber && status === "idle" && (
            <div className="mb-6">
              <div className="bg-muted rounded-lg p-4 mb-4">
                <div className="flex items-center mb-2">
                  <Mail className="h-4 w-4 text-muted-foreground mr-2" />
                  <span className="text-sm font-medium">Abone Bilgileri</span>
                </div>
                <p className="text-sm text-muted-foreground">
                  <strong>{subscriber.first_name} {subscriber.last_name}</strong>
                </p>
                <p className="text-sm text-muted-foreground">{subscriber.email}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Abone olma tarihi: {new Date(subscriber.subscribed_at).toLocaleDateString("tr-TR")}
                </p>
              </div>

              <div className="space-y-3">
                {subscriber.is_active ? (
                  <>
                    <button
                      onClick={handleUnsubscribe}
                      className="w-full bg-red-500 hover:bg-red-600 text-white font-medium py-3 px-4 rounded-lg transition-colors clickable"
                    >
                      Abonelikten Ayrıl
                    </button>
                    <p className="text-xs text-muted-foreground text-center">
                      Abonelikten ayrıldığınızda yeni blog yazıları hakkında e-posta almayacaksınız.
                    </p>
                  </>
                ) : (
                  <>
                    <button
                      onClick={handleResubscribe}
                      className="w-full bg-green-500 hover:bg-green-600 text-white font-medium py-3 px-4 rounded-lg transition-colors clickable"
                    >
                      Tekrar Abone Ol
                    </button>
                    <p className="text-xs text-muted-foreground text-center">
                      Tekrar abone olarak yeni blog yazılarından haberdar olabilirsiniz.
                    </p>
                  </>
                )}
              </div>
            </div>
          )}

          {/* Back to Home */}
          <div className="text-center">
            <button
              onClick={() => navigate("/")}
              className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors clickable"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Ana sayfaya dön
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-xs text-muted-foreground">
            Sorularınız için:{" "}
            <a 
              href="mailto:gulsah@teknolojimenajeri.com" 
              className="text-red-500 hover:text-red-600 transition-colors clickable"
            >
              gulsah@teknolojimenajeri.com
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
