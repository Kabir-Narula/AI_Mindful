import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ChevronLeft, MessageCircle, Loader, Brain, Calendar, Clock, Zap, Share2, Heart, Lightbulb, Trash2, Edit2 } from 'lucide-react'
import toast from 'react-hot-toast'
import { entriesService, agentService } from '../services/api'

export default function EntryDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [entry, setEntry] = useState<any>(null)
  const [companionResponse, setCompanionResponse] = useState<any>(null)
  const [followups, setFollowups] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [requestingFollowup, setRequestingFollowup] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [editTitle, setEditTitle] = useState('')
  const [editContent, setEditContent] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!id) return
        const [entryRes, companionRes, followupsRes] = await Promise.all([
          entriesService.getById(parseInt(id)),
          agentService.getCompanionResponse(parseInt(id)),
          agentService.getFollowups(parseInt(id)),
        ])
        setEntry(entryRes.data)
        setEditTitle(entryRes.data.title)
        setEditContent(entryRes.data.content)
        setCompanionResponse(companionRes.data)
        setFollowups(Array.isArray(followupsRes.data) ? followupsRes.data : [])
      } catch (error: any) {
        toast.error('Failed to load entry')
        navigate('/')
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [id, navigate])

  const handleRequestFollowup = async () => {
    if (!id) return
    setRequestingFollowup(true)
    try {
      const res = await agentService.requestFollowup(parseInt(id))
      setFollowups([...followups, res.data])
      toast.success('AI Question generated! ✨')
    } catch (error: any) {
      toast.error(error.response?.data?.detail || 'Failed to generate question')
    } finally {
      setRequestingFollowup(false)
    }
  }

  const handleEdit = () => {
    setIsEditing(true)
  }

  const handleCancelEdit = () => {
    setIsEditing(false)
    setEditTitle(entry.title)
    setEditContent(entry.content)
  }

  const handleSaveEdit = async () => {
    if (!id || !editTitle.trim() || !editContent.trim()) {
      toast.error('Title and content cannot be empty')
      return
    }
    setIsSaving(true)
    try {
      await entriesService.update(parseInt(id), {
        title: editTitle,
        content: editContent,
        mood_level: entry.mood_level
      })
      setEntry({ ...entry, title: editTitle, content: editContent })
      setIsEditing(false)
      toast.success('Entry updated successfully!')
      
      const companionRes = await agentService.getCompanionResponse(parseInt(id))
      setCompanionResponse(companionRes.data)
    } catch (error: any) {
      toast.error(error.response?.data?.detail || 'Failed to update entry')
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!id) return
    setIsDeleting(true)
    try {
      await entriesService.delete(parseInt(id))
      toast.success('Entry deleted successfully')
      navigate('/')
    } catch (error: any) {
      toast.error(error.response?.data?.detail || 'Failed to delete entry')
      setShowDeleteConfirm(false)
    } finally {
      setIsDeleting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50 flex items-center justify-center">
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}>
          <Loader className="w-8 h-8 text-blue-500" />
        </motion.div>
      </div>
    )
  }

  if (!entry) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50 flex items-center justify-center p-4">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center">
          <div className="text-6xl mb-4">📭</div>
          <p className="text-slate-600 text-lg mb-6 font-medium">Entry not found</p>
          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => navigate('/')} className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-500 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-blue-600 transition-all shadow-lg">
            Return to Dashboard
          </motion.button>
        </motion.div>
      </div>
    )
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.12, delayChildren: 0.2 },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  }

  const keywords = entry.keywords ? entry.keywords.split(',').map((k: string) => k.trim()) : []

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50">
      {/* Navigation */}
      <motion.nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-white/20 shadow-sm" initial={{ y: -100 }} animate={{ y: 0 }} transition={{ duration: 0.5 }}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4 flex justify-between items-center">
          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => navigate('/')} className="btn-icon p-2 flex items-center gap-2 text-slate-700">
            <ChevronLeft className="w-5 h-5" />
            <span className="hidden sm:inline text-sm font-medium">Back</span>
          </motion.button>

          <motion.h1 initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="gradient-text text-2xl font-bold">
            MindfulAI
          </motion.h1>

          <div className="flex items-center gap-2">
            {!isEditing && (
              <>
                <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={handleEdit} className="btn-secondary p-2 sm:px-4 sm:py-2 flex items-center gap-2 text-sm hover:bg-blue-50">
                  <Edit2 className="w-4 h-4" />
                  <span className="hidden sm:inline">Edit</span>
                </motion.button>
                <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={() => setShowDeleteConfirm(true)} className="btn-secondary p-2 sm:px-4 sm:py-2 flex items-center gap-2 text-sm hover:bg-red-50 text-red-600">
                  <Trash2 className="w-4 h-4" />
                  <span className="hidden sm:inline">Delete</span>
                </motion.button>
              </>
            )}
          </div>
        </div>
      </motion.nav>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 lg:py-12">
        <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
          {/* Entry Card */}
          <motion.div variants={itemVariants} className="bg-white/80 backdrop-blur-md rounded-2xl p-8 sm:p-10 relative overflow-hidden group border border-white/20 shadow-lg">
            <div className="absolute top-0 right-0 w-48 h-48 rounded-full -mr-24 -mt-24 opacity-5 bg-gradient-to-br from-blue-500 to-blue-400" />

            <div className="relative z-10">
              <div className="flex items-start justify-between gap-4 mb-8 flex-col sm:flex-row">
                <div className="flex-1">
                  {isEditing ? (
                    <input type="text" value={editTitle} onChange={(e) => setEditTitle(e.target.value)} className="gradient-text text-4xl sm:text-5xl font-bold mb-4 leading-tight w-full bg-transparent border-b-2 border-blue-500 focus:outline-none" />
                  ) : (
                    <h1 className="gradient-text text-4xl sm:text-5xl font-bold mb-4 leading-tight">{entry.title}</h1>
                  )}
                  <div className="flex flex-wrap items-center gap-4 text-sm text-slate-600">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>
                        {new Date(entry.created_at).toLocaleDateString('en-US', {
                          weekday: 'long',
                          month: 'long',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      <span>
                        {new Date(entry.created_at).toLocaleTimeString('en-US', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>
                  </div>
                </div>

                <motion.div whileHover={{ scale: 1.08 }} className={`px-5 py-3 rounded-lg font-bold whitespace-nowrap text-lg ${entry.sentiment_score > 0 ? 'bg-green-100 text-green-700' : entry.sentiment_score > -2 ? 'bg-blue-100 text-blue-700' : 'bg-red-100 text-red-700'}`}>
                  {entry.sentiment_score > 0 ? '+' : ''}{entry.sentiment_score}
                </motion.div>
              </div>

              {isEditing ? (
                <textarea value={editContent} onChange={(e) => setEditContent(e.target.value)} className="my-8 p-6 bg-white rounded-xl border-2 border-blue-500 w-full text-slate-700 text-lg leading-relaxed font-medium focus:outline-none focus:border-blue-600 resize-none" rows={12} />
              ) : (
                <div className="my-8 p-6 bg-slate-50 rounded-xl border border-slate-200">
                  <p className="text-slate-700 text-lg leading-relaxed whitespace-pre-wrap font-medium">{entry.content}</p>
                </div>
              )}

              {isEditing && (
                <div className="flex gap-4 mt-8">
                  <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={handleSaveEdit} disabled={isSaving} className="flex-1 py-3 px-6 bg-gradient-to-r from-green-600 to-green-500 text-white font-semibold rounded-lg hover:from-green-700 hover:to-green-600 transition-all disabled:opacity-50 flex items-center justify-center gap-2">
                    {isSaving ? (
                      <>
                        <Loader className="w-4 h-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      'Save Changes'
                    )}
                  </motion.button>
                  <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={handleCancelEdit} disabled={isSaving} className="flex-1 py-3 px-6 bg-white border-2 border-slate-300 text-slate-700 font-semibold rounded-lg hover:bg-slate-50 transition-all disabled:opacity-50">
                    Cancel
                  </motion.button>
                </div>
              )}

              {keywords.length > 0 && (
                <div className="pt-8 border-t border-slate-200">
                  <p className="text-sm font-bold text-slate-700 mb-4 flex items-center gap-2">
                    <Zap className="w-4 h-4 text-blue-500" />
                    Key Themes
                  </p>
                  <div className="flex flex-wrap gap-3">
                    {keywords.map((kw: string, idx: number) => (
                      <motion.span key={idx} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: idx * 0.08 }} whileHover={{ scale: 1.08 }} className="badge text-sm font-semibold px-4 py-2 cursor-pointer hover:shadow-md transition-shadow">
                        {kw}
                      </motion.span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>

          {/* AI Companion Analysis */}
          {companionResponse && (
            <motion.div variants={itemVariants} className="bg-white/80 backdrop-blur-md rounded-2xl p-8 sm:p-10 border border-white/20 shadow-lg">
              <div className="flex items-center gap-3 mb-8">
                <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-400 rounded-lg">
                  <Brain className="w-5 h-5 text-white" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900">Your AI Companion's Insights</h2>
              </div>

              <div className="space-y-6">
                {/* Detected Emotions */}
                <div>
                  <h3 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
                    <Heart className="w-5 h-5 text-red-500" />
                    Emotions Detected in Your Words
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {companionResponse.detected_emotions.map((emotion: string, idx: number) => (
                      <motion.span key={idx} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: idx * 0.05 }} className="px-4 py-2 rounded-full bg-blue-100 text-blue-700 text-sm font-semibold">
                        {emotion}
                      </motion.span>
                    ))}
                  </div>
                </div>

                {/* Themes */}
                {companionResponse.themes.length > 0 && (
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
                      <Lightbulb className="w-5 h-5 text-yellow-500" />
                      Life Areas You Mentioned
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {companionResponse.themes.map((theme: string, idx: number) => (
                        <motion.span key={idx} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: idx * 0.05 }} className="px-4 py-2 rounded-full bg-purple-100 text-purple-700 text-sm font-semibold">
                          {theme}
                        </motion.span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Needs */}
                {companionResponse.your_needs.length > 0 && (
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
                      <Zap className="w-5 h-5 text-orange-500" />
                      What You Might Need
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {companionResponse.your_needs.map((need: string, idx: number) => (
                        <motion.span key={idx} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: idx * 0.05 }} className="px-4 py-2 rounded-full bg-green-100 text-green-700 text-sm font-semibold">
                          {need}
                        </motion.span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Reflection */}
                <div className="p-6 rounded-xl bg-gradient-to-br from-blue-50 to-blue-50/50 border border-blue-100">
                  <p className="text-slate-700 leading-relaxed">{companionResponse.reflection}</p>
                </div>

                {/* Encouragement */}
                <div className="p-6 rounded-xl bg-gradient-to-br from-green-50 to-green-50/50 border border-green-100">
                  <p className="text-slate-700 leading-relaxed italic">"{companionResponse.encouragement}"</p>
                </div>
              </div>
            </motion.div>
          )}

          {/* AI Follow-up Questions */}
          <motion.div variants={itemVariants} className="bg-white/80 backdrop-blur-md rounded-2xl p-8 sm:p-10 border border-white/20 shadow-lg">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-3 bg-gradient-to-br from-blue-500 to-blue-400 rounded-lg">
                <MessageCircle className="w-5 h-5 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900">Deeper Conversations</h2>
            </div>

            {followups.length === 0 ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12">
                <div className="text-5xl mb-4">💬</div>
                <p className="text-slate-600 mb-8 font-medium max-w-sm mx-auto">Your AI companion can ask you deeper questions to help you understand yourself better. Ready?</p>
                <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={handleRequestFollowup} disabled={requestingFollowup} className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-500 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-blue-600 transition-all disabled:opacity-50 inline-flex items-center gap-2 shadow-lg">
                  {requestingFollowup ? (
                    <>
                      <Loader className="w-4 h-4 animate-spin" />
                      Thinking...
                    </>
                  ) : (
                    <>
                      <MessageCircle className="w-4 h-4" />
                      Ask Me a Question
                    </>
                  )}
                </motion.button>
              </motion.div>
            ) : (
              <>
                <motion.div className="space-y-4 mb-8">
                  {followups.map((followup: any, idx: number) => (
                    <motion.div key={followup.id || idx} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }} whileHover={{ y: -3 }} className="bg-white/80 backdrop-blur-md rounded-xl p-6 border border-blue-100/50 group hover:border-blue-300/60 transition-all hover:shadow-lg">
                      <div className="flex gap-4">
                        <div className="flex-shrink-0 mt-1">
                          <motion.div className="w-3 h-3 rounded-full bg-gradient-to-r from-blue-500 to-blue-400" animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 2, repeat: Infinity }} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-slate-700 leading-relaxed text-base font-medium">{followup.prompt}</p>
                          <p className="text-xs text-slate-500 font-medium mt-3">
                            {new Date(followup.created_at).toLocaleString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>

                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={handleRequestFollowup} disabled={requestingFollowup} className="w-full py-3 px-4 bg-white border-2 border-blue-200 text-blue-600 font-semibold rounded-lg hover:bg-blue-50 transition-all disabled:opacity-50 flex items-center justify-center gap-2">
                  {requestingFollowup ? (
                    <>
                      <Loader className="w-4 h-4 animate-spin" />
                      Thinking...
                    </>
                  ) : (
                    <>
                      <MessageCircle className="w-4 h-4" />
                      Get Another Question
                    </>
                  )}
                </motion.button>
              </>
            )}
          </motion.div>
        </motion.div>
      </div>

      {showDeleteConfirm && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white rounded-2xl p-8 max-w-sm w-full shadow-2xl">
            <div className="text-center mb-6">
              <div className="text-5xl mb-4">⚠️</div>
              <h2 className="text-2xl font-bold text-slate-900 mb-2">Delete Entry?</h2>
              <p className="text-slate-600">This action cannot be undone. Are you sure you want to delete this entry?</p>
            </div>

            <div className="flex gap-4">
              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => setShowDeleteConfirm(false)} disabled={isDeleting} className="flex-1 py-3 px-6 bg-slate-200 text-slate-700 font-semibold rounded-lg hover:bg-slate-300 transition-all disabled:opacity-50">
                Cancel
              </motion.button>
              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={handleDelete} disabled={isDeleting} className="flex-1 py-3 px-6 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-all disabled:opacity-50 flex items-center justify-center gap-2">
                {isDeleting ? (
                  <>
                    <Loader className="w-4 h-4 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  'Delete'
                )}
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  )
}
