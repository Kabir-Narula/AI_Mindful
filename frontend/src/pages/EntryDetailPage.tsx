import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { entriesService, agentService } from '../services/api'

export default function EntryDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [entry, setEntry] = useState<any>(null)
  const [followups, setFollowups] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showFollowup, setShowFollowup] = useState(false)
  const [requestingFollowup, setRequestingFollowup] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!id) return
        const [entryRes, followupsRes] = await Promise.all([
          entriesService.getById(parseInt(id)),
          agentService.getFollowups(parseInt(id)),
        ])
        setEntry(entryRes.data)
        setFollowups(followupsRes.data)
      } catch (error) {
        console.error('Failed to load entry')
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [id])

  const handleRequestFollowup = async () => {
    if (!id) return
    setRequestingFollowup(true)
    try {
      const res = await agentService.requestFollowup(parseInt(id))
      setFollowups([...followups, res.data])
      setShowFollowup(false)
    } catch (error) {
      console.error('Failed to get followup')
    } finally {
      setRequestingFollowup(false)
    }
  }

  if (loading) return <div className="text-center py-10">Loading...</div>
  if (!entry) return <div className="text-center py-10">Entry not found</div>

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">MindfulAI</h1>
          <button onClick={() => navigate('/')} className="text-blue-600 hover:text-blue-700">Back</button>
        </div>
      </nav>

      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow p-8 mb-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">{entry.title}</h2>
              <p className="text-gray-600">{new Date(entry.created_at).toLocaleDateString()}</p>
            </div>
            <span className={`px-4 py-2 rounded font-medium ${
              entry.sentiment_score > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
            }`}>
              Sentiment: {entry.sentiment_score}
            </span>
          </div>

          <p className="text-gray-700 mb-4 whitespace-pre-wrap">{entry.content}</p>

          {entry.keywords && (
            <div className="flex flex-wrap gap-2 mt-6 pt-6 border-t">
              {entry.keywords.split(',').map((kw: string, idx: number) => (
                <span key={idx} className="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded">
                  {kw.trim()}
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white rounded-lg shadow p-8">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Agent Reflections</h3>

          {followups.length === 0 ? (
            <div className="text-gray-600 mb-4">No reflections yet.</div>
          ) : (
            <div className="space-y-4 mb-6">
              {followups.map((followup: any) => (
                <div key={followup.id} className="border border-blue-200 bg-blue-50 rounded p-4">
                  <p className="text-gray-700">{followup.prompt}</p>
                  <p className="text-xs text-gray-500 mt-2">{new Date(followup.created_at).toLocaleString()}</p>
                </div>
              ))}
            </div>
          )}

          {!showFollowup ? (
            <button
              onClick={() => setShowFollowup(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Get Agent Reflection
            </button>
          ) : (
            <button
              onClick={handleRequestFollowup}
              disabled={requestingFollowup}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
            >
              {requestingFollowup ? 'Generating...' : 'Generate Reflection'}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
