import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Mail, Lock, ArrowRight, Loader, Eye, EyeOff } from 'lucide-react'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'

const AnimatedOrb = ({ delay = 0, size = 'w-64', blur = 'blur-3xl', duration = 6 }) => (
  <motion.div
    className={`absolute ${size} h-64 rounded-full filter ${blur} opacity-30`}
    animate={{ 
      y: [0, 40, 0],
      x: [0, 20, 0],
      scale: [1, 1.1, 1]
    }}
    transition={{ duration, repeat: Infinity, delay }}
    style={{
      background: 'linear-gradient(135deg, rgb(59, 130, 246), rgb(34, 197, 94))'
    }}
  />
)

const FloatingParticle = ({ delay = 0, x = 0, y = 0 }) => (
  <motion.div
    className="absolute w-1 h-1 bg-blue-400 rounded-full"
    animate={{
      y: [0, -30, 0],
      x: [0, 15, 0],
      opacity: [0, 1, 0]
    }}
    transition={{ duration: 4, repeat: Infinity, delay }}
    style={{ left: `${x}%`, top: `${y}%` }}
  />
)

const IllustrationSection = () => (
  <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
    {/* Animated Background */}
    <div className="absolute inset-0">
      <AnimatedOrb delay={0} size="w-72" blur="blur-3xl" duration={7} />
      <AnimatedOrb delay={0.5} size="w-48" blur="blur-2xl" duration={9} />
      
      {/* Floating particles */}
      {[...Array(12)].map((_, i) => (
        <FloatingParticle 
          key={i} 
          delay={i * 0.3} 
          x={Math.random() * 100} 
          y={Math.random() * 100} 
        />
      ))}
    </div>

    {/* Center Content */}
    <motion.div
      className="relative z-10 text-center"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.3 }}
    >
      <motion.div
        className="mb-6"
        animate={{ 
          y: [0, -8, 0],
          scale: [1, 1.05, 1]
        }}
        transition={{ duration: 4, repeat: Infinity }}
      >
        <div className="text-7xl filter drop-shadow-lg">🧘</div>
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <h2 className="text-4xl font-bold text-white mb-3 drop-shadow-lg">MindfulAI</h2>
        <p className="text-lg text-blue-100/80">Your Personal Mood Companion</p>
        
        <motion.div
          className="mt-8 flex justify-center gap-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              className="w-2 h-2 rounded-full bg-blue-300"
              animate={{ scale: [1, 1.5, 1] }}
              transition={{ duration: 2, repeat: Infinity, delay: i * 0.2 }}
            />
          ))}
        </motion.div>
      </motion.div>
    </motion.div>
  </div>
)

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [focused, setFocused] = useState<string | null>(null)
  const navigate = useNavigate()
  const { login } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      await login(email, password)
      toast.success('Welcome back! 👋')
      navigate('/')
    } catch (err: any) {
      toast.error(err.response?.data?.detail || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  }

  return (
    <div className="min-h-screen bg-white flex overflow-hidden">
      {/* Left Side - Form */}
      <motion.div
        className="w-full lg:w-1/2 flex flex-col justify-center px-6 sm:px-16 py-12 relative"
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.7 }}
      >
        {/* Subtle background decoration */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-blue-50 to-transparent rounded-full blur-2xl pointer-events-none" />
        
        <div className="max-w-md mx-auto w-full relative z-10">
          {/* Logo/Branding */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="mb-8"
          >
            <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-500 bg-clip-text text-transparent">
              MindfulAI
            </h2>
          </motion.div>

          {/* Header */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="mb-10"
          >
            <motion.div variants={itemVariants}>
              <h1 className="text-5xl font-bold text-slate-900 mb-2 leading-tight">
                Welcome <span className="bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">Back!</span>
              </h1>
              <p className="text-lg text-slate-600">Continue your mindfulness journey</p>
            </motion.div>
          </motion.div>

          {/* Form */}
          <motion.form
            onSubmit={handleSubmit}
            className="space-y-5"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Email Field */}
            <motion.div
              variants={itemVariants}
              className="space-y-2.5"
            >
              <label className="block text-sm font-semibold text-slate-800">Email Address</label>
              <motion.div
                className="relative group"
                animate={{ scale: focused === 'email' ? 1.01 : 1 }}
              >
                <Mail className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors ${focused === 'email' ? 'text-blue-500' : 'text-slate-400'}`} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={() => setFocused('email')}
                  onBlur={() => setFocused(null)}
                  className="w-full pl-12 pr-4 py-3 rounded-lg border-2 border-slate-200 bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300 shadow-sm hover:border-slate-300"
                  placeholder="you@example.com"
                  required
                  autoComplete="email"
                />
              </motion.div>
            </motion.div>

            {/* Password Field */}
            <motion.div
              variants={itemVariants}
              className="space-y-2.5"
            >
              <div className="flex justify-between items-center">
                <label className="block text-sm font-semibold text-slate-800">Password</label>
                <a href="#" className="text-xs font-semibold text-blue-600 hover:text-blue-700 transition-colors">
                  Forgot?
                </a>
              </div>
              <motion.div
                className="relative group"
                animate={{ scale: focused === 'password' ? 1.01 : 1 }}
              >
                <Lock className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors ${focused === 'password' ? 'text-blue-500' : 'text-slate-400'}`} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setFocused('password')}
                  onBlur={() => setFocused(null)}
                  className="w-full pl-12 pr-11 py-3 rounded-lg border-2 border-slate-200 bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-300 shadow-sm hover:border-slate-300"
                  placeholder="••••••••"
                  required
                  autoComplete="current-password"
                />
                <motion.button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </motion.button>
              </motion.div>
            </motion.div>

            {/* Remember Me */}
            <motion.div
              variants={itemVariants}
              className="flex items-center gap-2"
            >
              <motion.input
                type="checkbox"
                id="remember"
                className="w-4 h-4 rounded border-slate-300 text-blue-600 cursor-pointer accent-blue-600"
                whileHover={{ scale: 1.1 }}
              />
              <label htmlFor="remember" className="text-sm text-slate-600 cursor-pointer hover:text-slate-700 transition-colors">
                Remember for 30 days
              </label>
            </motion.div>

            {/* Login Button */}
            <motion.button
              variants={itemVariants}
              type="submit"
              disabled={loading}
              whileHover={{ scale: 1.02, boxShadow: '0 20px 25px -5px rgba(37, 99, 235, 0.3)' }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-3.5 px-4 bg-gradient-to-r from-blue-600 to-blue-500 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-blue-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 mt-8 shadow-lg relative overflow-hidden group"
            >
              <motion.div
                className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity"
              />
              {loading ? (
                <>
                  <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity }}>
                    <Loader className="w-5 h-5" />
                  </motion.div>
                  <span>Signing in...</span>
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <motion.div
                    animate={{ x: [0, 4, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <ArrowRight className="w-5 h-5" />
                  </motion.div>
                </>
              )}
            </motion.button>
          </motion.form>

          {/* Divider with enhanced styling */}
          <motion.div
            variants={itemVariants}
            className="relative my-8"
          >
            <div className="absolute inset-0 flex items-center">
              <div className="w-full h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent"></div>
            </div>
            <div className="relative flex justify-center">
              <span className="px-3 bg-white text-sm text-slate-500 font-medium">New to MindfulAI?</span>
            </div>
          </motion.div>

          {/* Sign Up Link */}
          <motion.div variants={itemVariants}>
            <motion.a
              href="/signup"
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              className="block w-full text-center py-3.5 px-4 border-2 border-slate-200 text-slate-900 font-semibold rounded-xl hover:border-blue-300 hover:bg-blue-50 transition-all duration-300"
            >
              Create Account
            </motion.a>
          </motion.div>

          {/* Footer Info */}
          <motion.p
            variants={itemVariants}
            className="text-center text-xs text-slate-500 mt-8 leading-relaxed"
          >
            By signing in, you agree to our <a href="#" className="text-blue-600 hover:text-blue-700 font-semibold">Terms</a> and <a href="#" className="text-blue-600 hover:text-blue-700 font-semibold">Privacy Policy</a>
          </motion.p>
        </div>
      </motion.div>

      {/* Right Side - Illustration (Hidden on mobile) */}
      <motion.div
        className="hidden lg:flex w-1/2 bg-gradient-to-br from-blue-600 via-blue-500 to-cyan-400 items-center justify-center relative overflow-hidden p-12"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <IllustrationSection />
      </motion.div>
    </div>
  )
}
