import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { BookOpen, TrendingUp, LogOut, Plus, Clock, BarChart3, Brain, Zap, Loader } from 'lucide-react'
import { motion } from 'framer-motion'
import { analyticsService, entriesService } from '../services/api'
import toast from 'react-hot-toast'

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
          entriesService.getAll(6, 0),
        ])
        setAnalytics(analyticsRes.data)
        setRecentEntries(entriesRes.data)
      } catch (error) {
        toast.error('Failed to load dashboard')
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const handleLogout = () => {
    logout()
    toast.success('See you next time!')
    navigate('/login')
  }

  const stats = analytics ? [
    { label: 'Total Entries', value: analytics.total_entries, icon: BookOpen, color: 'bg-blue-100 text-blue-600' },
    { label: 'Average Mood', value: `${(analytics.avg_sentiment * 100).toFixed(0)}%`, icon: TrendingUp, color: 'bg-green-100 text-green-600' },
    { label: 'Patterns Found', value: analytics.patterns?.length || 0, icon: Zap, color: 'bg-purple-100 text-purple-600' },
    { label: 'Top Keywords', value: analytics.most_common_keywords?.length || 0, icon: Brain, color: 'bg-orange-100 text-orange-600' },
  ] : []

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50 flex items-center justify-center">
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}>
          <Loader className="w-10 h-10 text-blue-500" />
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50">
      {/* Navigation Bar */}
      <motion.nav
        className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-white/20 shadow-sm"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex justify-between items-center">
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent"
          >
            MindfulAI
          </motion.h1>

          <div className="flex items-center gap-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/journal')}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-500 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-blue-600 transition-all shadow-md hover:shadow-lg"
            >
              <Plus className="w-4 h-4" />
              New Entry
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleLogout}
              className="p-2 text-slate-600 hover:text-slate-900 transition-colors"
            >
              <LogOut className="w-5 h-5" />
            </motion.button>
          </div>
        </div>
      </motion.nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <h2 className="text-4xl font-bold text-slate-900 mb-2">
            Welcome back, <span className="bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">{user?.name || 'Friend'}</span>!
          </h2>
          <p className="text-lg text-slate-600">Continue tracking your emotional journey</p>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
          variants={containerVariants}
          initial="hidden"
          animate="show"
        >
          {stats.map((stat, idx) => {
            const Icon = stat.icon
            return (
              <motion.div
                key={idx}
                variants={itemVariants}
                whileHover={{ y: -8, boxShadow: '0 20px 25px -5px rgba(59, 130, 246, 0.15)' }}
                className="bg-white/80 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-lg transition-all duration-300"
              >
                <div className="flex items-center justify-between mb-4">
                  <p className="text-slate-600 font-semibold text-sm">{stat.label}</p>
                  <div className={`p-3 rounded-lg ${stat.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                </div>
                <p className="text-4xl font-bold text-slate-900">{stat.value}</p>
              </motion.div>
            )
          })}
        </motion.div>

        {/* Recent Entries Section */}
        <motion.div
          variants={itemVariants}
          initial="hidden"
          animate="show"
          transition={{ delay: 0.4 }}
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-slate-900">Recent Entries</h3>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/analytics')}
              className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold transition-colors"
            >
              <BarChart3 className="w-4 h-4" />
              View Analytics
            </motion.button>
          </div>

          {recentEntries.length > 0 ? (
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              variants={containerVariants}
              initial="hidden"
              animate="show"
            >
              {recentEntries.map((entry, idx) => (
                <motion.div
                  key={entry.id}
                  variants={itemVariants}
                  whileHover={{ y: -6, boxShadow: '0 20px 25px -5px rgba(59, 130, 246, 0.15)' }}
                  onClick={() => navigate(`/entry/${entry.id}`)}
                  className="bg-gradient-to-br from-blue-50 to-blue-50/50 rounded-2xl p-6 border border-blue-100/50 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group"
                >
                  <div className="flex items-start justify-between mb-4">
                    <h4 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-2">{entry.title}</h4>
                    <motion.span
                      whileHover={{ scale: 1.1 }}
                      className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        entry.sentiment_score > 0
                          ? 'bg-green-100 text-green-700'
                          : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {entry.sentiment_score > 0 ? '+' : ''}{entry.sentiment_score}
                    </motion.span>
                  </div>

                  <p className="text-slate-600 text-sm mb-4 line-clamp-3">{entry.content}</p>

                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <Clock className="w-4 h-4" />
                    {new Date(entry.created_at).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <div className="text-5xl mb-4">📝</div>
              <p className="text-slate-600 mb-6">No entries yet. Start your journey today!</p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/journal')}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-500 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-blue-600 transition-all shadow-lg"
              >
                Create First Entry
              </motion.button>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  )
}
