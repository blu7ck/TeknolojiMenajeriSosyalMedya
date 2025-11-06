"use client"

import { useState, useEffect } from "react"
import { createClient } from "../../lib/supabase/client"
import type { NewsletterSubscriber } from "../../types/blog"
import { Mail, Download } from 'lucide-react'
import Loader from "../Loader"

export function SubscribersList() {
  const [subscribers, setSubscribers] = useState<NewsletterSubscriber[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchSubscribers()
  }, [])

  const fetchSubscribers = async () => {
    const supabase = createClient()
    const { data } = await supabase
      .from("newsletter_subscribers")
      .select("*")
      .eq("is_active", true)
      .order("subscribed_at", { ascending: false })

    if (data) {
      setSubscribers(data)
    }
    setLoading(false)
  }

  const exportToCSV = () => {
    const csv = [
      ["Ad", "Soyad", "Meslek", "E-posta", "Abone Tarihi"].join(","),
      ...subscribers.map((sub) =>
        [
          sub.first_name,
          sub.last_name,
          sub.profession || "",
          sub.email,
          new Date(sub.subscribed_at).toLocaleDateString("tr-TR"),
        ].join(","),
      ),
    ].join("\n")

    const blob = new Blob([csv], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `aboneler-${new Date().toISOString().split("T")[0]}.csv`
    a.click()
  }

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader />
      </div>
    )
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Newsletter Aboneleri</h2>
          <p className="text-gray-600 mt-1">Toplam {subscribers.length} aktif abone</p>
        </div>
        <button
          onClick={exportToCSV}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
        >
          <Download className="w-4 h-4" />
          CSV İndir
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ad Soyad</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Meslek</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">E-posta</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Abone Tarihi
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {subscribers.map((subscriber) => (
              <tr key={subscriber.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                      <Mail className="w-4 h-4 text-blue-600" />
                    </div>
                    <div className="text-sm font-medium text-gray-900">
                      {subscriber.first_name} {subscriber.last_name}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{subscriber.profession || "-"}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{subscriber.email}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                  {new Date(subscriber.subscribed_at).toLocaleDateString("tr-TR")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
