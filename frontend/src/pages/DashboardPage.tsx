import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { analyticsService, entriesService } from '../services/api'

export default function DashboardPage() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [analytics, setAnalytics] = useState<any>(null)
  const [recentEntries, setRecentEntries] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [analyticsRes, entriesRes] = await Promise.all([
          analyticsService.getSummary(),
          entriesService.getAll(5, 0),
        ])
        setAnalytics(analyticsRes.data)
        setRecentEntries(entriesRes.data)
      } catch (error) {
        console.error('Failed to load dashboard data')
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">MindfulAI</h1>
          <div className="flex gap-4">
            <a href="/journal" className="text-blue-600 hover:text-blue-700">Journal</a>
            <a href="/analytics" className="text-blue-600 hover:text-blue-700">Analytics</a>
            <button onClick={logout} className="text-red-600 hover:text-red-700">Logout</button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-2">Welcome, {user?.username}!</h2>
          <p className="text-gray-600">Track your mood and discover patterns in your emotional journey.</p>
        </div>

        {!loading && analytics && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-lg shadow p-6">
              <p className="text-gray-600 text-sm">Total Entries</p>
              <p className="text-3xl font-bold text-gray-900">{analytics.total_entries}</p>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <p className="text-gray-600 text-sm">Average Sentiment</p>
              <p className="text-3xl font-bold text-gray-900">{analytics.avg_sentiment}</p>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <p className="text-gray-600 text-sm">Top Keywords</p>
              <div className="flex flex-wrap gap-2 mt-3">
                {analytics.most_common_keywords.slice(0, 2).map((kw: string) => (
                  <span key={kw} className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded">
                    {kw}
                  </span>
                ))}
              </div>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <p className="text-gray-600 text-sm">Patterns Found</p>
              <p className="text-3xl font-bold text-gray-900">{analytics.patterns.length}</p>
            </div>
          </div>
        )}

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Recent Entries</h3>
          {recentEntries.length === 0 ? (
            <p className="text-gray-600">No entries yet. <a href="/journal" className="text-blue-600">Create one!</a></p>
          ) : (
            <div className="space-y-4">
              {recentEntries.map((entry: any) => (
                <div key={entry.id} className="border border-gray-200 rounded p-4 hover:bg-gray-50 cursor-pointer"
                     onClick={() => navigate(`/entry/${entry.id}`)}>
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-bold text-gray-900">{entry.title}</h4>
                      <p className="text-gray-600 text-sm">{new Date(entry.created_at).toLocaleDateString()}</p>
                    </div>
                    <span className={`px-3 py-1 rounded text-sm font-medium ${
                      entry.sentiment_score > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {entry.sentiment_score > 0 ? '+' : ''}{entry.sentiment_score}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
