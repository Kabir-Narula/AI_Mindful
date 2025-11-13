import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { entriesService } from '../services/api'

export default function JournalPage() {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [moodLevel, setMoodLevel] = useState(5)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      await entriesService.create(title, content, moodLevel)
      setSuccess(true)
      setTitle('')
      setContent('')
      setMoodLevel(5)

      setTimeout(() => {
        navigate('/')
      }, 1500)
    } catch (error) {
      console.error('Failed to create entry')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">MindfulAI</h1>
          <div className="flex gap-4">
            <a href="/" className="text-blue-600 hover:text-blue-700">Dashboard</a>
            <a href="/analytics" className="text-blue-600 hover:text-blue-700">Analytics</a>
          </div>
        </div>
      </nav>

      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">New Journal Entry</h2>

          {success && (
            <div className="mb-6 p-4 bg-green-50 text-green-700 rounded">
              Entry saved successfully! Redirecting...
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="What's on your mind?"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">How are you feeling? (1-10)</label>
              <input
                type="range"
                min="1"
                max="10"
                value={moodLevel}
                onChange={(e) => setMoodLevel(parseInt(e.target.value))}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-600 mt-1">
                <span>Very Bad</span>
                <span className="font-bold text-lg">{moodLevel}</span>
                <span>Excellent</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Your Thoughts</label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write freely about what you're experiencing..."
                rows={10}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition disabled:opacity-50"
            >
              {loading ? 'Saving...' : 'Save Entry'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
