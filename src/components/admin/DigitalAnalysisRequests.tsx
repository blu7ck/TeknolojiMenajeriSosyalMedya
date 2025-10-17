"use client"

import { useState, useEffect } from "react"
import { createClient } from "../../lib/supabase/client"
import { createAdminClient } from "../../lib/supabase/admin-client"
// Email service removed - using Edge Functions instead
import { CheckCircle, XCircle, Clock, Eye, ExternalLink, RefreshCw, Play } from "lucide-react"

interface DigitalAnalysisRequest {
  id: string
  name: string
  email: string
  website: string
  status: 'pending' | 'approved' | 'rejected' | 'processing' | 'completed' | 'failed'
  created_at: string
  updated_at: string
  approved_at?: string
  processed_at?: string
  completed_at?: string
  ip_address?: string
  user_agent?: string
}

export function DigitalAnalysisRequests() {
  const [requests, setRequests] = useState<DigitalAnalysisRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected' | 'processing' | 'completed'>('all')
  const [rejectModalOpen, setRejectModalOpen] = useState(false)
  const [selectedRequest, setSelectedRequest] = useState<DigitalAnalysisRequest | null>(null)
  const [rejectReason, setRejectReason] = useState('')

  const supabase = createClient()
  const adminSupabase = createAdminClient()

  const rejectReasons = [
    'Website erişilebilir değil',
    'Geçersiz website URL\'si',
    'Spam içerik tespit edildi',
    'Uygunsuz içerik',
    'Teknik sorunlar',
    'Diğer (açıklama gerekli)'
  ]

  const fetchRequests = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('digital_analysis_requests')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching requests:', error)
        return
      }

      setRequests(data || [])
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateRequestStatus = async (id: string, status: string, reason?: string) => {
    try {
      console.log('🔄 Updating request status:', { id, status, reason })
      
      // Get current request data for email
      const { data: requestData, error: selectError } = await supabase
        .from('digital_analysis_requests')
        .select('name, email, website')
        .eq('id', id)
        .single()

      if (selectError) {
        console.error('Error fetching request data:', selectError)
        return
      }

      console.log('📧 Request data for email:', requestData)

      const updateData: any = { 
        status,
        updated_at: new Date().toISOString()
      }
      
      if (status === 'approved') {
        updateData.approved_at = new Date().toISOString()
      } else if (status === 'processing') {
        updateData.processed_at = new Date().toISOString()
      } else if (status === 'completed') {
        updateData.completed_at = new Date().toISOString()
      } else if (status === 'rejected') {
        updateData.rejected_at = new Date().toISOString()
        updateData.reject_reason = reason || 'Belirtilmemiş'
      }

      console.log('📝 Update data:', updateData)

      const { data: updateResult, error } = await adminSupabase
        .from('digital_analysis_requests')
        .update(updateData)
        .eq('id', id)
        .select()

      if (error) {
        console.error('❌ Error updating request:', error)
        alert(`Database update error: ${error.message}`)
        return
      }

      console.log('✅ Update successful:', updateResult)

      // Send status update email to user via Edge Function
      if (requestData) {
        try {
          const emailData = {
            name: requestData.name,
            email: requestData.email,
            website: requestData.website,
            requestId: id,
            status: status,
            reason: reason
          }
          
          await supabase.functions.invoke('send-email', {
            body: {
              type: 'status_update',
              to: requestData.email,
              data: emailData
            }
          })
          console.log('Status update email sent via Edge Function')
        } catch (emailError) {
          console.error('Email send error:', emailError)
          // Don't fail the status update if email fails
        }
      }

      // Refresh the list
      fetchRequests()
    } catch (error) {
      console.error('Error:', error)
    }
  }

  const handleReject = (request: DigitalAnalysisRequest) => {
    setSelectedRequest(request)
    setRejectModalOpen(true)
  }

  const handleRejectSubmit = async () => {
    if (!selectedRequest || !rejectReason) return
    
    await updateRequestStatus(selectedRequest.id, 'rejected', rejectReason)
    setRejectModalOpen(false)
    setSelectedRequest(null)
    setRejectReason('')
  }

  const startAnalysis = async (id: string, website: string, name: string, email: string) => {
    try {
      console.log(`🚀 Starting analysis for: ${website}`)
      console.log('📝 Request data:', { requestId: id, website, name, email })
      
      // First, update status to 'processing'
      console.log('🔄 Updating status to processing...')
      await updateRequestStatus(id, 'processing')
      
      // Refresh the list to show processing status immediately
      await fetchRequests()
      console.log('🔄 List refreshed to show processing status')
      
      // Call Edge Function
      const { data, error } = await supabase.functions.invoke('analyze-website', {
        body: {
          requestId: id,
          website,
          name,
          email
        }
      })

      console.log('📨 Edge Function response:', { data, error })

      if (error) {
        console.error('❌ Analysis error:', error)
        // Update status to failed if analysis fails
        await updateRequestStatus(id, 'failed')
        alert(`Analiz başlatılamadı: ${error.message}`)
        return
      }

      if (data) {
        console.log('✅ Analysis completed:', data)
        if (data.success) {
          alert('Analiz başarıyla tamamlandı! Email gönderildi.')
        }
      }
      
      // Refresh the list to show updated status
      await fetchRequests()
      console.log('🔄 List refreshed')
    } catch (error) {
      console.error('❌ Analysis start error:', error)
      // Update status to failed if there's an error
      try {
        await updateRequestStatus(id, 'failed')
      } catch (updateError) {
        console.error('Failed to update status to failed:', updateError)
      }
      alert(`Bir hata oluştu: ${error}`)
    }
  }

  useEffect(() => {
    fetchRequests()
  }, [])

  const filteredRequests = requests.filter(request => {
    if (filter === 'all') return true
    return request.status === filter
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'approved': return 'bg-green-100 text-green-800'
      case 'rejected': return 'bg-red-100 text-red-800'
      case 'processing': return 'bg-blue-100 text-blue-800'
      case 'completed': return 'bg-purple-100 text-purple-800'
      case 'failed': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="w-4 h-4" />
      case 'approved': return <CheckCircle className="w-4 h-4" />
      case 'rejected': return <XCircle className="w-4 h-4" />
      case 'processing': return <RefreshCw className="w-4 h-4" />
      case 'completed': return <CheckCircle className="w-4 h-4" />
      case 'failed': return <XCircle className="w-4 h-4" />
      default: return <Clock className="w-4 h-4" />
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('tr-TR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

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
          <h2 className="text-2xl font-bold text-gray-900">Dijital Analiz Talepleri</h2>
          <p className="text-gray-600">Toplam {requests.length} talep</p>
        </div>
        <button
          onClick={fetchRequests}
          className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          Yenile
        </button>
      </div>

      {/* Filter */}
      <div className="flex gap-2 flex-wrap">
        {[
          { key: 'all', label: 'Tümü' },
          { key: 'pending', label: 'Bekleyen' },
          { key: 'approved', label: 'Onaylanan' },
          { key: 'processing', label: 'İşleniyor' },
          { key: 'completed', label: 'Tamamlanan' },
          { key: 'rejected', label: 'Reddedilen' }
        ].map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setFilter(key as any)}
            className={`px-4 py-2 rounded-lg transition-colors ${
              filter === key
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Requests List */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {filteredRequests.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <Clock className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p>Henüz talep bulunmuyor</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Talep
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Durum
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tarih
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    İşlemler
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredRequests.map((request) => (
                  <tr key={request.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{request.name}</div>
                        <div className="text-sm text-gray-500">{request.email}</div>
                        <div className="flex items-center gap-2 mt-1">
                          <ExternalLink className="w-3 h-3 text-gray-400" />
                          <a
                            href={request.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-blue-600 hover:text-blue-800"
                          >
                            {request.website}
                          </a>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                        {getStatusIcon(request.status)}
                        {request.status === 'pending' && 'Bekleyen'}
                        {request.status === 'approved' && 'Onaylandı'}
                        {request.status === 'rejected' && 'Reddedildi'}
                        {request.status === 'processing' && 'İşleniyor'}
                        {request.status === 'completed' && 'Tamamlandı'}
                        {request.status === 'failed' && 'Başarısız'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {formatDate(request.created_at)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        {request.status === 'pending' && (
                          <>
                            <button
                              onClick={() => updateRequestStatus(request.id, 'approved')}
                              className="flex items-center gap-1 px-3 py-1 bg-green-500 text-white text-xs rounded hover:bg-green-600 transition-colors"
                            >
                              <CheckCircle className="w-3 h-3" />
                              Onayla
                            </button>
                            <button
                              onClick={() => handleReject(request)}
                              className="flex items-center gap-1 px-3 py-1 bg-red-500 text-white text-xs rounded hover:bg-red-600 transition-colors"
                            >
                              <XCircle className="w-3 h-3" />
                              Reddet
                            </button>
                          </>
                        )}
                        {request.status === 'approved' && (
                          <button
                            onClick={() => startAnalysis(request.id, request.website, request.name, request.email)}
                            className="flex items-center gap-1 px-3 py-1 bg-green-500 text-white text-xs rounded hover:bg-green-600 transition-colors"
                          >
                            <Play className="w-3 h-3" />
                            Analizi Başlat
                          </button>
                        )}
                        {request.status === 'processing' && (
                          <button
                            onClick={() => updateRequestStatus(request.id, 'completed')}
                            className="flex items-center gap-1 px-3 py-1 bg-purple-500 text-white text-xs rounded hover:bg-purple-600 transition-colors"
                          >
                            <CheckCircle className="w-3 h-3" />
                            Tamamla
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Reject Modal */}
      {rejectModalOpen && selectedRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold mb-4">Talebi Reddet</h3>
            <p className="text-sm text-gray-600 mb-4">
              <strong>{selectedRequest.name}</strong> adlı kullanıcının talebini reddetmek için sebep seçin:
            </p>
            
            <div className="space-y-2 mb-4">
              {rejectReasons.map((reason) => (
                <label key={reason} className="flex items-center">
                  <input
                    type="radio"
                    name="rejectReason"
                    value={reason}
                    checked={rejectReason === reason}
                    onChange={(e) => setRejectReason(e.target.value)}
                    className="mr-2"
                  />
                  <span className="text-sm">{reason}</span>
                </label>
              ))}
            </div>

            {rejectReason === 'Diğer (açıklama gerekli)' && (
              <textarea
                placeholder="Red sebebini açıklayın..."
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md text-sm"
                rows={3}
              />
            )}

            <div className="flex gap-2 mt-6">
              <button
                onClick={() => {
                  setRejectModalOpen(false)
                  setSelectedRequest(null)
                  setRejectReason('')
                }}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-sm hover:bg-gray-50"
              >
                İptal
              </button>
              <button
                onClick={handleRejectSubmit}
                disabled={!rejectReason}
                className="flex-1 px-4 py-2 bg-red-500 text-white rounded-md text-sm hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Reddet
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
