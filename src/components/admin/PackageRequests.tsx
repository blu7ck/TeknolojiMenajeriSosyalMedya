import React, { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  MessageSquare, 
  DollarSign, 
  User, 
  Mail, 
  Phone,
  Building,
  Instagram,
  Facebook,
  Linkedin,
  Twitter,
  Music
} from 'lucide-react'

interface PackageRequest {
  id: string
  first_name: string
  last_name: string
  email: string
  phone: string
  company_info?: string
  package_type: string
  package_title: string
  selected_modules: string[]
  social_media_accounts: Array<{
    platform: string
    username?: string
    value?: string
  }>
  status: 'pending' | 'contacted' | 'quoted' | 'accepted' | 'rejected'
  admin_notes?: string
  quoted_price?: number
  quoted_at?: string
  contacted_at?: string
  created_at: string
  updated_at: string
}

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
)

export default function PackageRequests() {
  const [requests, setRequests] = useState<PackageRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedRequest, setSelectedRequest] = useState<PackageRequest | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [adminNotes, setAdminNotes] = useState('')
  const [quotedPrice, setQuotedPrice] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')

  useEffect(() => {
    fetchRequests()
  }, [])

  const fetchRequests = async () => {
    try {
      const { data, error } = await supabase
        .from('package_requests')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      setRequests(data || [])
    } catch (error) {
      console.error('Error fetching package requests:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateRequestStatus = async (id: string, status: string) => {
    try {
      const updateData: any = { 
        status,
        admin_notes: adminNotes || null
      }
      
      // Add quoted price if provided
      if (quotedPrice && !isNaN(parseFloat(quotedPrice))) {
        updateData.quoted_price = parseFloat(quotedPrice)
        updateData.quoted_at = new Date().toISOString()
      }
      
      if (status === 'contacted') {
        updateData.contacted_at = new Date().toISOString()
      }

      const { error } = await supabase
        .from('package_requests')
        .update(updateData)
        .eq('id', id)

      if (error) throw error

      setRequests(requests.map(req => 
        req.id === id ? { ...req, ...updateData } : req
      ))
      setShowModal(false)
      setSelectedRequest(null)
      setAdminNotes('')
      setQuotedPrice('')
    } catch (error) {
      console.error('Error updating request:', error)
      alert('Güncelleme sırasında hata oluştu')
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="w-4 h-4 text-yellow-500" />
      case 'contacted': return <MessageSquare className="w-4 h-4 text-blue-500" />
      case 'quoted': return <DollarSign className="w-4 h-4 text-green-500" />
      case 'accepted': return <CheckCircle className="w-4 h-4 text-green-600" />
      case 'rejected': return <XCircle className="w-4 h-4 text-red-500" />
      default: return <Clock className="w-4 h-4 text-gray-500" />
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'Beklemede'
      case 'contacted': return 'İletişim Kuruldu'
      case 'quoted': return 'Teklif Verildi'
      case 'accepted': return 'Kabul Edildi'
      case 'rejected': return 'Reddedildi'
      default: return status
    }
  }

  const getSocialMediaIcon = (platform: string) => {
    switch (platform) {
      case 'instagram': return <Instagram className="w-4 h-4 text-pink-500" />
      case 'tiktok': return <Music className="w-4 h-4 text-black" />
      case 'facebook': return <Facebook className="w-4 h-4 text-blue-600" />
      case 'linkedin': return <Linkedin className="w-4 h-4 text-blue-700" />
      case 'twitter': return <Twitter className="w-4 h-4 text-blue-400" />
      default: return <div className="w-4 h-4 bg-gray-400 rounded" />
    }
  }

  const filteredRequests = requests.filter(request => 
    statusFilter === 'all' || request.status === statusFilter
  )

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-red-500"></div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Paket Teklifleri</h1>
        <p className="text-gray-600">Müşterilerden gelen paket tekliflerini yönetin</p>
      </div>

      {/* Status Filter */}
      <div className="mb-6">
        <div className="flex gap-2">
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-4 py-2 rounded-lg ${
              statusFilter === 'all' ? 'bg-red-500 text-white' : 'bg-gray-200 text-gray-700'
            }`}
          >
            Tümü ({requests.length})
          </button>
          <button
            onClick={() => setStatusFilter('pending')}
            className={`px-4 py-2 rounded-lg ${
              statusFilter === 'pending' ? 'bg-red-500 text-white' : 'bg-gray-200 text-gray-700'
            }`}
          >
            Beklemede ({requests.filter(r => r.status === 'pending').length})
          </button>
          <button
            onClick={() => setStatusFilter('contacted')}
            className={`px-4 py-2 rounded-lg ${
              statusFilter === 'contacted' ? 'bg-red-500 text-white' : 'bg-gray-200 text-gray-700'
            }`}
          >
            İletişim Kuruldu ({requests.filter(r => r.status === 'contacted').length})
          </button>
          <button
            onClick={() => setStatusFilter('quoted')}
            className={`px-4 py-2 rounded-lg ${
              statusFilter === 'quoted' ? 'bg-red-500 text-white' : 'bg-gray-200 text-gray-700'
            }`}
          >
            Teklif Verildi ({requests.filter(r => r.status === 'quoted').length})
          </button>
        </div>
      </div>

      {/* Requests List */}
      <div className="bg-[#DBDBDB] rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-800">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#DBDBDB] uppercase tracking-wider">
                  Müşteri
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#DBDBDB] uppercase tracking-wider">
                  Paket
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#DBDBDB] uppercase tracking-wider">
                  Modüller
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#DBDBDB] uppercase tracking-wider">
                  Durum
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#DBDBDB] uppercase tracking-wider">
                  Tarih
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-[#DBDBDB] uppercase tracking-wider">
                  İşlemler
                </th>
              </tr>
            </thead>
            <tbody className="bg-[#DBDBDB] divide-y divide-gray-200">
              {filteredRequests.map((request) => (
                <tr key={request.id} className="hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center">
                          <User className="h-5 w-5 text-red-600" />
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {request.first_name} {request.last_name}
                        </div>
                        <div className="text-sm text-gray-700 flex items-center">
                          <Mail className="w-3 h-3 mr-1" />
                          {request.email}
                        </div>
                        <div className="text-sm text-gray-700 flex items-center">
                          <Phone className="w-3 h-3 mr-1" />
                          {request.phone}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">{request.package_title}</div>
                    <div className="text-sm text-gray-700">{request.package_type}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">
                      {request.selected_modules.slice(0, 2).join(', ')}
                      {request.selected_modules.length > 2 && ` +${request.selected_modules.length - 2} daha`}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {getStatusIcon(request.status)}
                      <span className="ml-2 text-sm text-gray-900">
                        {getStatusText(request.status)}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {new Date(request.created_at).toLocaleDateString('tr-TR')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => {
                        setSelectedRequest(request)
                        setAdminNotes(request.admin_notes || '')
                        setQuotedPrice(request.quoted_price?.toString() || '')
                        setShowModal(true)
                      }}
                      className="text-red-600 hover:text-red-900"
                    >
                      Detaylar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {showModal && selectedRequest && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-[#DBDBDB]">
            <div className="mt-3">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">
                  Paket Teklifi Detayları
                </h3>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XCircle className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-4">
                {/* Customer Info */}
                <div className="bg-[#DBDBDB] p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">Müşteri Bilgileri</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">İsim</p>
                      <p className="font-medium text-gray-900">{selectedRequest.first_name} {selectedRequest.last_name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">E-posta</p>
                      <p className="font-medium text-gray-900">{selectedRequest.email}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Telefon</p>
                      <p className="font-medium text-gray-900">{selectedRequest.phone}</p>
                    </div>
                    {selectedRequest.company_info && (
                      <div>
                        <p className="text-sm text-gray-600">Kurumsal Bilgi</p>
                        <p className="font-medium text-gray-900">{selectedRequest.company_info}</p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Package Info */}
                <div className="bg-[#DBDBDB] p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">Paket Bilgileri</h4>
                  <p className="text-sm text-gray-600 mb-1">Paket: {selectedRequest.package_title}</p>
                  <p className="text-sm text-gray-600 mb-2">Seçili Modüller:</p>
                  <ul className="list-disc list-inside text-sm text-gray-900">
                    {selectedRequest.selected_modules.map((module, index) => (
                      <li key={index}>{module}</li>
                    ))}
                  </ul>
                </div>

                {/* Social Media */}
                {selectedRequest.social_media_accounts.length > 0 && (
                  <div className="bg-[#DBDBDB] p-4 rounded-lg">
                    <h4 className="font-semibold text-gray-900 mb-2">Sosyal Medya Hesapları</h4>
                    <div className="space-y-2">
                      {selectedRequest.social_media_accounts.map((social, index) => (
                        <div key={index} className="flex items-center">
                          {getSocialMediaIcon(social.platform)}
                          <span className="ml-2 text-sm text-gray-900">
                            {social.platform}: @{social.username || social.value || ''}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Existing Data */}
                {(selectedRequest.admin_notes || selectedRequest.quoted_price) && (
                  <div className="bg-[#DBDBDB] p-4 rounded-lg border border-gray-300">
                    <h4 className="font-semibold text-gray-900 mb-2">📋 Kayıtlı Bilgiler</h4>
                    {selectedRequest.admin_notes && (
                      <div className="mb-2">
                        <p className="text-sm text-gray-600 font-medium">Admin Notu:</p>
                        <p className="text-sm text-gray-900">{selectedRequest.admin_notes}</p>
                      </div>
                    )}
                    {selectedRequest.quoted_price && (
                      <div>
                        <p className="text-sm text-gray-600 font-medium">Teklif Edilen Fiyat:</p>
                        <p className="text-sm text-gray-900">₺{selectedRequest.quoted_price.toLocaleString('tr-TR')}</p>
                        {selectedRequest.quoted_at && (
                          <p className="text-xs text-gray-500">
                            Tarih: {new Date(selectedRequest.quoted_at).toLocaleDateString('tr-TR')}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {/* Admin Actions */}
                <div className="bg-[#DBDBDB] p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">Admin İşlemleri</h4>
                  
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Admin Notları
                      </label>
                      <textarea
                        value={adminNotes}
                        onChange={(e) => setAdminNotes(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                        rows={3}
                        placeholder="Notlarınızı buraya yazın..."
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Teklif Fiyatı (₺)
                      </label>
                      <input
                        type="number"
                        value={quotedPrice}
                        onChange={(e) => setQuotedPrice(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                        placeholder="Fiyat girin..."
                      />
                    </div>

                    <div className="space-y-2">
                      <button
                        onClick={() => updateRequestStatus(selectedRequest.id, selectedRequest.status)}
                        className="w-full px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 font-medium"
                      >
                        💾 Not ve Fiyat Kaydet (Durum Değişmez)
                      </button>
                      
                      <div className="flex gap-2 flex-wrap">
                        <button
                          onClick={() => updateRequestStatus(selectedRequest.id, 'contacted')}
                          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                        >
                          İletişim Kuruldu
                        </button>
                        <button
                          onClick={() => updateRequestStatus(selectedRequest.id, 'quoted')}
                          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                        >
                          Teklif Verildi
                        </button>
                        <button
                          onClick={() => updateRequestStatus(selectedRequest.id, 'accepted')}
                          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                        >
                          Kabul Edildi
                        </button>
                        <button
                          onClick={() => updateRequestStatus(selectedRequest.id, 'rejected')}
                          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                        >
                          Reddedildi
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
