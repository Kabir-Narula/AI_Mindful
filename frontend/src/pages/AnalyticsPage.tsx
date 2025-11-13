import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { TrendingUp, Zap, Loader, Home, Plus, Brain, BarChart3, Target } from 'lucide-react'
import toast from 'react-hot-toast'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import { analyticsService } from '../services/api'

export default function AnalyticsPage() {
  const navigate = useNavigate()
  const [analytics, setAnalytics] = useState<any>(null)
  const [trends, setTrends] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [timeRange, setTimeRange] = useState(30)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [analyticsRes, trendsRes] = await Promise.all([
          analyticsService.getSummary(),
          analyticsService.getTrends(timeRange),
        ])
        setAnalytics(analyticsRes.data)
        setTrends(Array.isArray(trendsRes.data?.trends) ? trendsRes.data.trends : [])
      } catch (error: any) {
        toast.error('Failed to load analytics')
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [timeRange])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50 flex items-center justify-center">
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}>
          <Loader className="w-8 h-8 text-blue-500" />
        </motion.div>
      </div>
    )
  }

  const chartData = trends
    .slice(-Math.min(30, trends.length))
    .map((t) => ({
      date: new Date(t.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      sentiment: Math.round(t.sentiment || 0),
      mood: Math.round(t.mood_level || 0),
    }))

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.12, delayChildren: 0.2 },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  }

  const getCategoryColor = (category: string): string => {
    const colors: Record<string, string> = {
      stress: 'bg-red-100/60 text-red-700 border border-red-200/50',
      anxiety: 'bg-orange-100/60 text-orange-700 border border-orange-200/50',
      happiness: 'bg-green-100/60 text-green-700 border border-green-200/50',
      sadness: 'bg-blue-100/60 text-blue-700 border border-blue-200/50',
      motivation: 'bg-purple-100/60 text-purple-700 border border-purple-200/50',
      focus: 'bg-indigo-100/60 text-indigo-700 border border-indigo-200/50',
      tired: 'bg-slate-100/60 text-slate-700 border border-slate-200/50',
      relaxed: 'bg-emerald-100/60 text-emerald-700 border border-emerald-200/50',
    }
    return colors[category.toLowerCase()] || 'bg-blue-100/60 text-blue-700 border border-blue-200/50'
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50">
      {/* Premium Navigation */}
      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass sticky top-0 z-50 border-b border-white/20 backdrop-blur-xl"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex justify-between items-center">
          <motion.h1
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
          >
            Analytics Dashboard
          </motion.h1>

          <div className="flex items-center gap-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/')}
              className="btn-secondary p-2 sm:px-4 sm:py-2 flex items-center gap-2 text-sm shadow-md"
            >
              <Home className="w-4 h-4" />
              <span className="hidden sm:inline">Dashboard</span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05, boxShadow: '0 10px 20px rgba(14, 165, 233, 0.3)' }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/journal')}
              className="btn-primary p-2 sm:px-4 sm:py-2 flex items-center gap-2 text-sm shadow-lg"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">New Entry</span>
            </motion.button>
          </div>
        </div>
      </motion.nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 lg:py-12">
        {analytics && (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-8"
          >
            {/* Header with Time Range */}
            <motion.div
              variants={itemVariants}
              className="flex items-center justify-between flex-col sm:flex-row gap-6"
            >
              <div>
                <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                  Your Progress
                </h2>
                <p className="text-slate-600 text-lg">Track your emotional journey and patterns</p>
              </div>
              <div className="flex gap-2 bg-slate-100/60 p-1 rounded-xl backdrop-blur-sm">
                {[7, 14, 30].map((days) => (
                  <motion.button
                    key={days}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setTimeRange(days)}
                    className={`px-5 py-2.5 rounded-lg font-semibold transition-all duration-300 ${
                      timeRange === days
                        ? 'btn-primary shadow-lg'
                        : 'text-slate-700 hover:bg-slate-200/60'
                    }`}
                  >
                    {days}d
                  </motion.button>
                ))}
              </div>
            </motion.div>

            {/* Stats Grid */}
            <motion.div
              variants={itemVariants}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
            >
              <motion.div
                whileHover={{ y: -10, boxShadow: '0 25px 50px rgba(0, 0, 0, 0.12)' }}
                className="glass rounded-2xl p-7 border-white/40 backdrop-blur-lg group cursor-pointer transition-all duration-300 relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-400/10 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500" />
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-5">
                    <p className="text-slate-700 font-bold text-sm">Total Entries</p>
                    <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-400 rounded-xl shadow-lg group-hover:scale-110 transition-transform">
                      <BarChart3 className="w-5 h-5 text-white" />
                    </div>
                  </div>
                  <motion.p
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3, duration: 0.6 }}
                    className="text-5xl font-bold text-slate-900 mb-2"
                  >
                    {analytics.total_entries || 0}
                  </motion.p>
                  <p className="text-xs text-slate-600 font-medium">Entries recorded</p>
                </div>
              </motion.div>

              <motion.div
                whileHover={{ y: -10, boxShadow: '0 25px 50px rgba(0, 0, 0, 0.12)' }}
                className="glass rounded-2xl p-7 border-white/40 backdrop-blur-lg group cursor-pointer transition-all duration-300 relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-green-400/10 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500" />
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-5">
                    <p className="text-slate-700 font-bold text-sm">Avg Sentiment</p>
                    <div className="p-3 bg-gradient-to-br from-green-500 to-emerald-400 rounded-xl shadow-lg group-hover:scale-110 transition-transform">
                      <Brain className="w-5 h-5 text-white" />
                    </div>
                  </div>
                  <motion.p
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.35, duration: 0.6 }}
                    className={`text-5xl font-bold mb-2 ${
                      (analytics.avg_sentiment || 0) > 0 ? 'text-green-600' : 'text-red-600'
                    }`}
                  >
                    {(analytics.avg_sentiment || 0) > 0 ? '+' : ''}{Math.round(analytics.avg_sentiment || 0)}
                  </motion.p>
                  <p className="text-xs text-slate-600 font-medium">
                    {(analytics.avg_sentiment || 0) > 0 ? 'Positive mood' : 'Focus on wellness'}
                  </p>
                </div>
              </motion.div>

              <motion.div
                whileHover={{ y: -10, boxShadow: '0 25px 50px rgba(0, 0, 0, 0.12)' }}
                className="glass rounded-2xl p-7 border-white/40 backdrop-blur-lg group cursor-pointer transition-all duration-300 relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-purple-400/10 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500" />
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-5">
                    <p className="text-slate-700 font-bold text-sm">Patterns Found</p>
                    <div className="p-3 bg-gradient-to-br from-purple-500 to-purple-400 rounded-xl shadow-lg group-hover:scale-110 transition-transform">
                      <Target className="w-5 h-5 text-white" />
                    </div>
                  </div>
                  <motion.p
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.4, duration: 0.6 }}
                    className="text-5xl font-bold text-slate-900 mb-2"
                  >
                    {analytics.patterns?.length || 0}
                  </motion.p>
                  <p className="text-xs text-slate-600 font-medium">Behavioral insights</p>
                </div>
              </motion.div>

              <motion.div
                whileHover={{ y: -10, boxShadow: '0 25px 50px rgba(0, 0, 0, 0.12)' }}
                className="glass rounded-2xl p-7 border-white/40 backdrop-blur-lg group cursor-pointer transition-all duration-300 relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-orange-400/10 rounded-full -mr-16 -mt-16 group-hover:scale-150 transition-transform duration-500" />
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-5">
                    <p className="text-slate-700 font-bold text-sm">Keywords</p>
                    <div className="p-3 bg-gradient-to-br from-orange-500 to-amber-400 rounded-xl shadow-lg group-hover:scale-110 transition-transform">
                      <Zap className="w-5 h-5 text-white" />
                    </div>
                  </div>
                  <motion.p
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.45, duration: 0.6 }}
                    className="text-5xl font-bold text-slate-900 mb-2"
                  >
                    {analytics.most_common_keywords?.length || 0}
                  </motion.p>
                  <p className="text-xs text-slate-600 font-medium">Key themes identified</p>
                </div>
              </motion.div>
            </motion.div>

            {/* Trends Chart */}
            {chartData.length > 0 && (
              <motion.div
                variants={itemVariants}
                className="glass rounded-2xl p-8 sm:p-10 border-white/40 backdrop-blur-lg overflow-hidden"
              >
                <div className="flex items-center gap-3 mb-8">
                  <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-400 rounded-xl shadow-lg">
                    <TrendingUp className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                      Sentiment & Mood Trends
                    </h3>
                    <p className="text-slate-600 text-sm mt-1">Visual representation of your emotional patterns</p>
                  </div>
                </div>

                <div className="w-full -mx-4 overflow-x-auto">
                  <div className="px-4">
                    <ResponsiveContainer width="100%" height={350} minWidth={500}>
                      <LineChart data={chartData}>
                        <defs>
                          <linearGradient id="sentimentGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.4} />
                            <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0} />
                          </linearGradient>
                          <linearGradient id="moodGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#a855f7" stopOpacity={0.4} />
                            <stop offset="95%" stopColor="#a855f7" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                        <XAxis
                          dataKey="date"
                          stroke="#64748b"
                          style={{ fontSize: '0.875rem' }}
                        />
                        <YAxis stroke="#64748b" style={{ fontSize: '0.875rem' }} />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: 'rgba(255, 255, 255, 0.95)',
                            border: '1px solid #e2e8f0',
                            borderRadius: '12px',
                            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.15)',
                          }}
                        />
                        <Legend wrapperStyle={{ paddingTop: '20px' }} />
                        <Line
                          type="monotone"
                          dataKey="sentiment"
                          stroke="#0ea5e9"
                          strokeWidth={3}
                          name="Sentiment Score"
                          dot={{ fill: '#0ea5e9', r: 5 }}
                          activeDot={{ r: 7 }}
                        />
                        <Line
                          type="monotone"
                          dataKey="mood"
                          stroke="#a855f7"
                          strokeWidth={3}
                          name="Mood Level"
                          dot={{ fill: '#a855f7', r: 5 }}
                          activeDot={{ r: 7 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-slate-200/50">
                  <p className="text-sm text-slate-600 font-medium">
                    📊 <span className="font-bold">Trend Insights:</span> Monitor how your mood and sentiment change across different periods. Look for patterns that correlate with specific events or situations.
                  </p>
                </div>
              </motion.div>
            )}

            {/* Patterns Section */}
            {analytics.patterns && analytics.patterns.length > 0 && (
              <motion.div
                variants={itemVariants}
                className="glass rounded-2xl p-8 sm:p-10 border-white/40 backdrop-blur-lg"
              >
                <div className="flex items-center gap-3 mb-8">
                  <div className="p-3 bg-gradient-to-br from-purple-500 to-purple-400 rounded-xl shadow-lg">
                    <Target className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                      Identified Patterns
                    </h3>
                    <p className="text-slate-600 text-sm mt-1">Recurring triggers and behavioral insights</p>
                  </div>
                </div>

                <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  className="grid grid-cols-1 md:grid-cols-2 gap-5"
                >
                  {analytics.patterns.slice(0, 6).map((pattern: any, idx: number) => (
                    <motion.div
                      key={idx}
                      variants={itemVariants}
                      whileHover={{ y: -6, boxShadow: '0 15px 35px rgba(0, 0, 0, 0.1)' }}
                      className="glass rounded-2xl p-6 border-white/40 backdrop-blur-lg group transition-all duration-300 relative overflow-hidden"
                    >
                      <div className="absolute top-0 right-0 w-24 h-24 bg-blue-400/10 rounded-full -mr-12 -mt-12 group-hover:scale-150 transition-transform duration-500" />
                      
                      <div className="relative z-10">
                        <h4 className="font-bold text-slate-900 text-lg group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-purple-600 group-hover:bg-clip-text transition-all line-clamp-2 mb-5">
                          {pattern.trigger || 'Pattern'}
                        </h4>

                        <div className="space-y-3">
                          <div className="flex justify-between items-center p-3 bg-slate-50/60 rounded-lg border border-slate-200/30">
                            <span className="text-slate-600 font-semibold text-sm">Confidence</span>
                            <motion.span
                              whileHover={{ scale: 1.15 }}
                              className="font-bold text-blue-600 text-lg"
                            >
                              {Math.round((pattern.confidence || 0) * 100)}%
                            </motion.span>
                          </div>

                          <div className="flex justify-between items-center p-3 bg-slate-50/60 rounded-lg border border-slate-200/30">
                            <span className="text-slate-600 font-semibold text-sm">Frequency</span>
                            <span className="font-bold text-slate-900 text-lg">{pattern.frequency || 0}x</span>
                          </div>

                          <div className="flex justify-between items-center p-3 bg-slate-50/60 rounded-lg border border-slate-200/30">
                            <span className="text-slate-600 font-semibold text-sm">Impact</span>
                            <span
                              className={`font-bold text-lg ${
                                (pattern.avg_sentiment_impact || 0) > 0 ? 'text-green-600' : 'text-red-600'
                              }`}
                            >
                              {(pattern.avg_sentiment_impact || 0) > 0 ? '+' : ''}{Math.round(pattern.avg_sentiment_impact || 0)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>

                {analytics.patterns.length > 6 && (
                  <p className="text-sm text-slate-500 mt-6 text-center font-medium">
                    +{analytics.patterns.length - 6} more patterns detected
                  </p>
                )}
              </motion.div>
            )}

            {/* Keywords Section */}
            {analytics.most_common_keywords && analytics.most_common_keywords.length > 0 && (
              <motion.div
                variants={itemVariants}
                className="glass rounded-2xl p-8 sm:p-10 border-white/40 backdrop-blur-lg"
              >
                <div className="flex items-center gap-3 mb-8">
                  <div className="p-3 bg-gradient-to-br from-orange-500 to-amber-400 rounded-xl shadow-lg">
                    <Zap className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                      Top Keywords & Themes
                    </h3>
                    <p className="text-slate-600 text-sm mt-1">Most frequently mentioned in your entries</p>
                  </div>
                </div>

                <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  className="flex flex-wrap gap-3"
                >
                  {analytics.most_common_keywords.slice(0, 20).map((kw: string, idx: number) => (
                    <motion.span
                      key={idx}
                      variants={itemVariants}
                      whileHover={{ scale: 1.15, rotate: 2, boxShadow: '0 8px 20px rgba(0, 0, 0, 0.15)' }}
                      className={`px-5 py-2.5 rounded-full text-sm font-bold cursor-pointer transition-all duration-300 shadow-md backdrop-blur-sm ${getCategoryColor(
                        kw
                      )}`}
                    >
                      {kw}
                    </motion.span>
                  ))}
                </motion.div>

                <div className="mt-8 pt-6 border-t border-slate-200/50">
                  <p className="text-sm text-slate-600 font-medium">
                    🔍 <span className="font-bold">Theme Analysis:</span> These are the most frequently mentioned themes in your entries. They indicate what matters most to you emotionally and can help identify key focus areas for personal growth.
                  </p>
                </div>
              </motion.div>
            )}

            {/* Empty State */}
            {analytics.total_entries === 0 && (
              <motion.div
                variants={itemVariants}
                className="glass rounded-2xl p-12 text-center border-white/40 backdrop-blur-lg relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-48 h-48 bg-blue-400/10 rounded-full -mr-24 -mt-24" />
                <div className="relative z-10">
                  <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="text-7xl mb-6"
                  >
                    📓
                  </motion.div>
                  <p className="text-slate-600 text-xl mb-4 font-semibold">No entries yet</p>
                  <p className="text-slate-500 mb-10 max-w-md mx-auto text-lg">
                    Start creating journal entries to see your emotional patterns, trends, and insights here.
                  </p>
                  <motion.button
                    whileHover={{ scale: 1.05, boxShadow: '0 15px 30px rgba(14, 165, 233, 0.4)' }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => navigate('/journal')}
                    className="btn-primary inline-flex items-center gap-2 shadow-lg"
                  >
                    <Plus className="w-5 h-5" />
                    Create First Entry
                  </motion.button>
                </div>
              </motion.div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  )
}
