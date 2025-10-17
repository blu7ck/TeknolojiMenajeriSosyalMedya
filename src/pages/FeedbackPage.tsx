"use client"

import { useState, useEffect } from "react"
import { createClient } from "../lib/supabase/client"
import { CheckCircle, Star, MessageSquare, ThumbsUp, ThumbsDown } from "lucide-react"

interface FeedbackData {
  requestId: string
  name: string
  email: string
  website: string
}

interface FeedbackForm {
  overallRating: number
  reportQuality: number
  recommendations: number
  communication: number
  wouldRecommend: boolean
  comments: string
  improvements: string
  additionalServices: string[]
}

export function FeedbackPage() {
  const [feedbackData, setFeedbackData] = useState<FeedbackData | null>(null)
  const [formData, setFormData] = useState<FeedbackForm>({
    overallRating: 0,
    reportQuality: 0,
    recommendations: 0,
    communication: 0,
    wouldRecommend: false,
    comments: '',
    improvements: '',
    additionalServices: []
  })
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')

  const supabase = createClient()

  useEffect(() => {
    // Get request ID from URL params
    const urlParams = new URLSearchParams(window.location.search)
    const requestId = urlParams.get('id')
    
    if (!requestId) {
      setError('Geçersiz feedback linki')
      setLoading(false)
      return
    }

    fetchRequestData(requestId)
  }, [])

  const fetchRequestData = async (requestId: string) => {
    try {
      const { data, error } = await supabase
        .from('digital_analysis_requests')
        .select('id, name, email, website, status')
        .eq('id', requestId)
        .single()

      if (error || !data) {
        setError('Talep bulunamadı')
        return
      }

      if (data.status !== 'completed') {
        setError('Bu talep henüz tamamlanmamış')
        return
      }

      setFeedbackData({
        requestId: data.id,
        name: data.name,
        email: data.email,
        website: data.website
      })
    } catch (err) {
      setError('Bir hata oluştu')
    } finally {
      setLoading(false)
    }
  }

  const handleRatingChange = (field: keyof FeedbackForm, value: number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleCheckboxChange = (field: keyof FeedbackForm, value: boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleTextChange = (field: keyof FeedbackForm, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleServiceToggle = (service: string) => {
    setFormData(prev => ({
      ...prev,
      additionalServices: prev.additionalServices.includes(service)
        ? prev.additionalServices.filter(s => s !== service)
        : [...prev.additionalServices, service]
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      const { error } = await supabase
        .from('digital_analysis_requests')
        .update({
          feedback_data: formData,
          feedback_completed_at: new Date().toISOString()
        })
        .eq('id', feedbackData?.requestId)

      if (error) {
        throw error
      }

      setSubmitted(true)
    } catch (err) {
      setError('Feedback gönderilirken bir hata oluştu')
    } finally {
      setSubmitting(false)
    }
  }

  const StarRating = ({ value, onChange, label }: { value: number, onChange: (value: number) => void, label: string }) => (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">{label}</label>
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => onChange(star)}
            className={`p-1 transition-colors ${
              star <= value ? 'text-yellow-400' : 'text-gray-300'
            }`}
          >
            <Star className="w-6 h-6 fill-current" />
          </button>
        ))}
        <span className="ml-2 text-sm text-gray-600">{value}/5</span>
      </div>
    </div>
  )

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md mx-auto text-center">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        </div>
      </div>
    )
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md mx-auto text-center">
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
            <CheckCircle className="w-8 h-8 mx-auto mb-2" />
            <h2 className="text-xl font-semibold">Teşekkürler!</h2>
            <p>Feedback'iniz başarıyla gönderildi.</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Dijital Analiz Feedback</h1>
            <p className="text-gray-600">
              Merhaba <strong>{feedbackData?.name}</strong>, aldığınız hizmet hakkında görüşlerinizi paylaşın.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Overall Rating */}
            <StarRating
              value={formData.overallRating}
              onChange={(value) => handleRatingChange('overallRating', value)}
              label="Genel Değerlendirme"
            />

            {/* Detailed Ratings */}
            <div className="grid md:grid-cols-2 gap-6">
              <StarRating
                value={formData.reportQuality}
                onChange={(value) => handleRatingChange('reportQuality', value)}
                label="Rapor Kalitesi"
              />
              <StarRating
                value={formData.recommendations}
                onChange={(value) => handleRatingChange('recommendations', value)}
                label="Önerilerin Faydalılığı"
              />
              <StarRating
                value={formData.communication}
                onChange={(value) => handleRatingChange('communication', value)}
                label="İletişim Kalitesi"
              />
            </div>

            {/* Would Recommend */}
            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-700">
                Hizmetimizi başkalarına tavsiye eder misiniz?
              </label>
              <div className="flex gap-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    checked={formData.wouldRecommend === true}
                    onChange={() => handleCheckboxChange('wouldRecommend', true)}
                    className="mr-2"
                  />
                  <ThumbsUp className="w-5 h-5 text-green-500 mr-1" />
                  Evet
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    checked={formData.wouldRecommend === false}
                    onChange={() => handleCheckboxChange('wouldRecommend', false)}
                    className="mr-2"
                  />
                  <ThumbsDown className="w-5 h-5 text-red-500 mr-1" />
                  Hayır
                </label>
              </div>
            </div>

            {/* Comments */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Genel Yorumlarınız
              </label>
              <textarea
                value={formData.comments}
                onChange={(e) => handleTextChange('comments', e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Hizmetimiz hakkında düşüncelerinizi paylaşın..."
              />
            </div>

            {/* Improvements */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Geliştirilmesi Gereken Alanlar
              </label>
              <textarea
                value={formData.improvements}
                onChange={(e) => handleTextChange('improvements', e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Hangi konularda daha iyi olabiliriz?"
              />
            </div>

            {/* Additional Services */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                İlgilenebileceğiniz Ek Hizmetler
              </label>
              <div className="grid grid-cols-2 gap-3">
                {[
                  'SEO Optimizasyonu',
                  'Sosyal Medya Yönetimi',
                  'İçerik Pazarlama',
                  'Google Ads Yönetimi',
                  'Website Tasarım',
                  'E-ticaret Çözümleri',
                  'Email Pazarlama',
                  'Analytics Raporlama'
                ].map((service) => (
                  <label key={service} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.additionalServices.includes(service)}
                      onChange={() => handleServiceToggle(service)}
                      className="mr-2"
                    />
                    <span className="text-sm">{service}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <div className="text-center">
              <button
                type="submit"
                disabled={submitting || formData.overallRating === 0}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-3 px-8 rounded-lg transition-colors"
              >
                {submitting ? 'Gönderiliyor...' : 'Feedback Gönder'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
