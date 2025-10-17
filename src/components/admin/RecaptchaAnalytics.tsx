"use client"

import { useState, useEffect } from "react"
import { createClient } from "../../lib/supabase/client"
import { Shield, CheckCircle, XCircle, Clock, BarChart3, RefreshCw } from "lucide-react"

interface RecaptchaStats {
  totalRequests: number
  successfulRequests: number
  failedRequests: number
  pendingRequests: number
  successRate: number
  dailyStats: Array<{
    date: string
    count: number
    success_rate: number
  }>
}

export function RecaptchaAnalytics() {
  const [stats, setStats] = useState<RecaptchaStats>({
    totalRequests: 0,
    successfulRequests: 0,
    failedRequests: 0,
    pendingRequests: 0,
    successRate: 0,
    dailyStats: []
  })
  const [loading, setLoading] = useState(true)

  const supabase = createClient()

  const fetchRecaptchaStats = async () => {
    try {
      setLoading(true)
      
      // Toplam istek sayısı
      const { count: totalCount } = await supabase
        .from('digital_analysis_requests')
        .select('*', { count: 'exact', head: true })

      // Başarılı istekler (onaylanan, işlenen, tamamlanan)
      const { count: successCount } = await supabase
        .from('digital_analysis_requests')
        .select('*', { count: 'exact', head: true })
        .in('status', ['approved', 'processing', 'completed'])

      // Bekleyen istekler
      const { count: pendingCount } = await supabase
        .from('digital_analysis_requests')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'pending')

      // Başarısız istekler
      const { count: failedCount } = await supabase
        .from('digital_analysis_requests')
        .select('*', { count: 'exact', head: true })
        .in('status', ['rejected', 'failed'])

      // Günlük istatistikler (son 7 gün)
      const { data: dailyData } = await supabase
        .from('digital_analysis_requests')
        .select('created_at, status')
        .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())

      // Günlük verileri grupla
      const dailyStats = dailyData?.reduce((acc: any, item: any) => {
        const date = new Date(item.created_at).toLocaleDateString('tr-TR')
        if (!acc[date]) {
          acc[date] = { total: 0, successful: 0 }
        }
        acc[date].total++
        if (['approved', 'processing', 'completed'].includes(item.status)) {
          acc[date].successful++
        }
        return acc
      }, {}) || {}

      const formattedDailyStats = Object.entries(dailyStats).map(([date, data]: [string, any]) => ({
        date,
        count: data.total,
        success_rate: data.total > 0 ? Math.round((data.successful / data.total) * 100) : 0
      }))

      const successRate = totalCount && totalCount > 0 ? Math.round((successCount / totalCount) * 100) : 0

      setStats({
        totalRequests: totalCount || 0,
        successfulRequests: successCount || 0,
        failedRequests: failedCount || 0,
        pendingRequests: pendingCount || 0,
        successRate,
        dailyStats: formattedDailyStats
      })
    } catch (error) {
      console.error('Error fetching reCAPTCHA stats:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchRecaptchaStats()
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="w-8 h-8 animate-spin text-blue-500" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">reCAPTCHA Analizi</h2>
          <p className="text-gray-600">Form doğrulama istatistikleri</p>
        </div>
        <button
          onClick={fetchRecaptchaStats}
          className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          Yenile
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Shield className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Toplam İstek</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalRequests}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Başarılı</p>
              <p className="text-2xl font-bold text-gray-900">{stats.successfulRequests}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Bekleyen</p>
              <p className="text-2xl font-bold text-gray-900">{stats.pendingRequests}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-2 bg-red-100 rounded-lg">
              <XCircle className="w-6 h-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Başarısız</p>
              <p className="text-2xl font-bold text-gray-900">{stats.failedRequests}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Success Rate */}
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Başarı Oranı</h3>
          <div className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-gray-400" />
            <span className="text-2xl font-bold text-blue-600">{stats.successRate}%</span>
          </div>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div 
            className="bg-blue-600 h-3 rounded-full transition-all duration-500"
            style={{ width: `${stats.successRate}%` }}
          ></div>
        </div>
        <p className="text-sm text-gray-600 mt-2">
          {stats.successfulRequests} başarılı / {stats.totalRequests} toplam istek
        </p>
      </div>

      {/* Daily Stats */}
      {stats.dailyStats.length > 0 && (
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Son 7 Gün</h3>
          <div className="space-y-3">
            {stats.dailyStats.map((day, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-sm text-gray-600">{day.date}</span>
                <div className="flex items-center gap-4">
                  <span className="text-sm font-medium text-gray-900">{day.count} istek</span>
                  <span className="text-sm text-blue-600">{day.success_rate}% başarı</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recommendations */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-blue-900 mb-3">Öneriler</h3>
        <div className="space-y-2 text-sm text-blue-800">
          {stats.successRate < 70 && (
            <p>• Başarı oranı düşük. reCAPTCHA ayarlarını gözden geçirin.</p>
          )}
          {stats.failedRequests > stats.successfulRequests && (
            <p>• Çok fazla başarısız istek var. Bot koruması güçlendirilebilir.</p>
          )}
          {stats.pendingRequests > 10 && (
            <p>• Bekleyen istek sayısı yüksek. İşlem süreçlerini hızlandırın.</p>
          )}
          {stats.successRate >= 90 && (
            <p>• Mükemmel! reCAPTCHA ayarlarınız optimal çalışıyor.</p>
          )}
        </div>
      </div>
    </div>
  )
}
