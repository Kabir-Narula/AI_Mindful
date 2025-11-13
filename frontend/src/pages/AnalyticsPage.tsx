import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { analyticsService } from '../services/api'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts'

export default function AnalyticsPage() {
  const navigate = useNavigate()
  const [analytics, setAnalytics] = useState<any>(null)
  const [trends, setTrends] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [analyticsRes, trendsRes] = await Promise.all([
          analyticsService.getSummary(),
          analyticsService.getTrends(30),
        ])
        setAnalytics(analyticsRes.data)
        setTrends(trendsRes.data.trends || [])
      } catch (error) {
        console.error('Failed to load analytics')
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  if (loading) return <div className="text-center py-10">Loading...</div>

  const chartData = trends.slice(-14).map(t => ({
    date: new Date(t.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    sentiment: t.sentiment,
    mood: t.mood_level
  }))

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">MindfulAI Analytics</h1>
          <div className="flex gap-4">
            <button onClick={() => navigate('/')} className="text-blue-600 hover:text-blue-700">Dashboard</button>
            <button onClick={() => navigate('/journal')} className="text-blue-600 hover:text-blue-700">New Entry</button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {analytics && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-white rounded-lg shadow p-6">
                <p className="text-gray-600 text-sm">Total Entries</p>
                <p className="text-3xl font-bold text-gray-900">{analytics.total_entries}</p>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <p className="text-gray-600 text-sm">Average Sentiment</p>
                <p className="text-3xl font-bold" style={{color: analytics.avg_sentiment > 0 ? '#10b981' : '#ef4444'}}>
                  {analytics.avg_sentiment}
                </p>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <p className="text-gray-600 text-sm">Mood Range</p>
                <p className="text-gray-700 mt-2">
                  {Object.entries(analytics.mood_distribution).length > 0
                    ? `${Object.keys(analytics.mood_distribution).length} levels recorded`
                    : 'No data'
                  }
                </p>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <p className="text-gray-600 text-sm">Patterns Found</p>
                <p className="text-3xl font-bold text-gray-900">{analytics.patterns.length}</p>
              </div>
            </div>

            {chartData.length > 0 && (
              <div className="bg-white rounded-lg shadow p-6 mb-8">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Sentiment Trends (Last 14 Days)</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="sentiment" stroke="#3b82f6" name="Sentiment" />
                    <Line type="monotone" dataKey="mood" stroke="#8b5cf6" name="Mood Level" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            )}

            {analytics.patterns.length > 0 && (
              <div className="bg-white rounded-lg shadow p-6 mb-8">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Identified Patterns</h3>
                <div className="space-y-4">
                  {analytics.patterns.map((pattern: any, idx: number) => (
                    <div key={idx} className="border border-gray-200 rounded p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-bold text-gray-900">{pattern.trigger}</h4>
                        <span className="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded">
                          Confidence: {(pattern.confidence * 100).toFixed(0)}%
                        </span>
                      </div>
                      <p className="text-gray-600 text-sm">
                        Appears {pattern.frequency} times | Average impact: {pattern.avg_sentiment_impact}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {analytics.most_common_keywords.length > 0 && (
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Most Common Keywords</h3>
                <div className="flex flex-wrap gap-2">
                  {analytics.most_common_keywords.map((kw: string) => (
                    <span key={kw} className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm">
                      {kw}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
