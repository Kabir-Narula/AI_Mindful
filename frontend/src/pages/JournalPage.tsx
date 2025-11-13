import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { PenTool, BarChart3, Loader, BookOpen, ChevronLeft } from 'lucide-react'
import toast from 'react-hot-toast'
import { entriesService } from '../services/api'

const MOOD_EMOJIS = ['😢', '😞', '😐', '🙂', '😊', '😄', '😃', '😍', '🤗', '🌟']
const MOOD_LABELS = [
  'Very Bad',
  'Bad',
  'Poor',
  'Okay',
  'Good',
  'Great',
  'Very Good',
  'Excellent',
  'Amazing',
  'Perfect',
]

export default function JournalPage() {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [moodLevel, setMoodLevel] = useState(5)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [focused, setFocused] = useState<string | null>(null)
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!title.trim()) {
      toast.error('Please add a title for your entry')
      return
    }

    if (!content.trim()) {
      toast.error('Please share your thoughts')
      return
    }

    if (content.trim().split(/\s+/).length < 10) {
      toast.error('Please write at least 10 words for your entry')
      return
    }

    setLoading(true)

    try {
      await entriesService.create(title, content, moodLevel)
      setSuccess(true)
      toast.success('Entry saved successfully! 🎉')

      setTimeout(() => {
        navigate('/')
      }, 1500)
    } catch (error: any) {
      toast.error(error.response?.data?.detail || 'Failed to save entry')
    } finally {
      setLoading(false)
    }
  }

  const wordCount = content.trim().split(/\s+/).filter((w) => w.length > 0).length

  const fieldVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: (delay: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: delay * 0.1, duration: 0.5, ease: 'easeOut' },
    }),
  }

  const getMoodColor = (mood: number) => {
    if (mood <= 3) return 'from-red-400 to-orange-400'
    if (mood <= 5) return 'from-yellow-400 to-amber-400'
    if (mood <= 7) return 'from-lime-400 to-green-400'
    return 'from-emerald-400 to-teal-400'
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50">
      {/* Premium Navigation */}
      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass sticky top-0 z-50 border-b border-white/20 backdrop-blur-xl"
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4 flex justify-between items-center">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/')}
            className="p-2.5 hover:bg-slate-100/60 rounded-xl transition-colors duration-200 flex items-center gap-2 text-slate-700 font-medium"
          >
            <ChevronLeft className="w-5 h-5" />
            <span className="hidden sm:inline text-sm">Back</span>
          </motion.button>

          <motion.h1
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
          >
            MindfulAI
          </motion.h1>

          <div className="flex items-center gap-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/analytics')}
              className="btn-secondary p-2 sm:px-4 sm:py-2 flex items-center gap-2 text-sm shadow-md"
            >
              <BarChart3 className="w-4 h-4" />
              <span className="hidden sm:inline">Analytics</span>
            </motion.button>
          </div>
        </div>
      </motion.nav>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 lg:py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="glass rounded-2xl p-8 sm:p-10 border-white/40 backdrop-blur-lg relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-blue-400/15 to-purple-400/15 rounded-full -mr-24 -mt-24" />

          {/* Header */}
          <div className="relative z-10 flex items-center gap-3 mb-10">
            <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl shadow-lg">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                New Journal Entry
              </h2>
              <p className="text-slate-600 text-sm mt-1">Share what's on your mind</p>
            </div>
          </div>

          {/* Success Message */}
          {success && (
            <motion.div
              initial={{ opacity: 0, y: -15 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 rounded-xl bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200/60 backdrop-blur-sm"
            >
              <div className="flex items-center gap-3">
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 0.5 }}
                  className="text-2xl"
                >
                  ✓
                </motion.div>
                <p className="text-green-700 font-semibold">Entry saved successfully! Redirecting...</p>
              </div>
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-7 relative z-10">
            {/* Title Field */}
            <motion.div
              variants={fieldVariants}
              initial="hidden"
              animate="visible"
              custom={0}
              className="space-y-3"
            >
              <label className="block text-sm font-semibold text-slate-800 flex items-center gap-2">
                <PenTool className="w-4 h-4 text-blue-500" />
                Entry Title
              </label>
              <motion.div
                animate={{ scale: focused === 'title' ? 1.01 : 1 }}
                className="relative group"
              >
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  onFocus={() => setFocused('title')}
                  onBlur={() => setFocused(null)}
                  placeholder="Give your entry a meaningful title..."
                  className="w-full px-4 py-3.5 rounded-xl border-2 border-slate-200 bg-white/60 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300 shadow-sm hover:border-slate-300 backdrop-blur-sm font-medium text-lg"
                  disabled={loading}
                  required
                  maxLength={100}
                />
              </motion.div>
              <p className="text-xs text-slate-500 font-medium">
                {title.length}/100 characters
              </p>
            </motion.div>

            {/* Mood Slider - Premium Gradient */}
            <motion.div
              variants={fieldVariants}
              initial="hidden"
              animate="visible"
              custom={1}
              className={`bg-gradient-to-br ${getMoodColor(moodLevel)} p-8 rounded-2xl border-2 border-white/50 shadow-xl relative overflow-hidden`}
            >
              <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -mr-20 -mt-20" />

              <div className="relative z-10 mb-8">
                <div className="flex items-end justify-between mb-6">
                  <div>
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-sm font-semibold text-white/95"
                    >
                      How are you feeling?
                    </motion.p>
                    <motion.p
                      key={moodLevel}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="text-xs text-white/80 mt-1 font-bold"
                    >
                      {MOOD_LABELS[moodLevel - 1]}
                    </motion.p>
                  </div>
                  <motion.span
                    key={moodLevel}
                    initial={{ scale: 1.2, rotate: -10 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ duration: 0.4 }}
                    className="text-7xl drop-shadow-lg"
                  >
                    {MOOD_EMOJIS[moodLevel - 1]}
                  </motion.span>
                </div>

                <input
                  type="range"
                  min="1"
                  max="10"
                  value={moodLevel}
                  onChange={(e) => setMoodLevel(parseInt(e.target.value))}
                  className="w-full h-3 bg-white/30 rounded-full appearance-none cursor-pointer accent-white shadow-lg"
                  style={{
                    WebkitAppearance: 'none',
                  }}
                  disabled={loading}
                />

                <div className="flex justify-between text-xs text-white/90 mt-4 font-bold">
                  <span>😢</span>
                  <span className="bg-white/20 px-3 py-1 rounded-full backdrop-blur-sm">{moodLevel}</span>
                  <span>🌟</span>
                </div>
              </div>
            </motion.div>

            {/* Content Field */}
            <motion.div
              variants={fieldVariants}
              initial="hidden"
              animate="visible"
              custom={2}
              className="space-y-3"
            >
              <div className="flex justify-between items-center mb-3">
                <label className="block text-sm font-semibold text-slate-800">
                  Your Thoughts & Feelings
                </label>
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className={`text-xs font-bold px-3 py-1.5 rounded-full backdrop-blur-sm ${
                    wordCount < 10
                      ? 'bg-red-100/60 text-red-700'
                      : wordCount < 50
                      ? 'bg-yellow-100/60 text-yellow-700'
                      : 'bg-green-100/60 text-green-700'
                  }`}
                >
                  {wordCount} words
                </motion.span>
              </div>
              <motion.div
                animate={{ scale: focused === 'content' ? 1.01 : 1 }}
                className="relative group"
              >
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  onFocus={() => setFocused('content')}
                  onBlur={() => setFocused(null)}
                  placeholder="Write freely about what you're experiencing... Your thoughts, feelings, observations, and reflections. Be authentic and honest - this helps with AI insights."
                  rows={12}
                  className="w-full px-4 py-3.5 rounded-xl border-2 border-slate-200 bg-white/60 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300 shadow-sm hover:border-slate-300 backdrop-blur-sm resize-none font-medium"
                  disabled={loading}
                  required
                />
              </motion.div>
              <p className="text-xs text-slate-500 font-medium">Minimum 10 words required</p>
            </motion.div>

            {/* Submit Button */}
            <motion.button
              variants={fieldVariants}
              initial="hidden"
              animate="visible"
              custom={3}
              type="submit"
              disabled={loading || success}
              whileHover={{ scale: 1.02, boxShadow: '0 20px 35px rgba(14, 165, 233, 0.35)' }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-4 px-4 bg-gradient-to-r from-blue-600 to-blue-500 text-white font-bold rounded-xl hover:from-blue-700 hover:to-blue-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 text-lg shadow-lg relative overflow-hidden group"
            >
              <motion.div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity" />
              {loading ? (
                <>
                  <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity }}>
                    <Loader className="w-5 h-5" />
                  </motion.div>
                  <span>Saving Entry...</span>
                </>
              ) : success ? (
                <>
                  <motion.span animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 0.5 }}>
                    ✓
                  </motion.span>
                  <span>Entry Saved</span>
                </>
              ) : (
                <>
                  <BookOpen className="w-5 h-5" />
                  <span>Save Entry</span>
                </>
              )}
            </motion.button>
          </form>

          {/* Mindfulness Tip Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mt-10 relative z-10 p-5 rounded-xl bg-gradient-to-r from-blue-50/60 to-purple-50/60 border border-blue-200/50 backdrop-blur-sm group hover:border-blue-300/80 transition-all duration-300"
          >
            <div className="flex items-start gap-3">
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="text-2xl flex-shrink-0 mt-0.5"
              >
                💡
              </motion.div>
              <div>
                <p className="text-sm text-slate-700">
                  <span className="font-bold text-blue-600">Mindfulness Tip:</span> Being authentic helps our AI provide personalized reflections. Share your genuine feelings and experiences for better insights.
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}
