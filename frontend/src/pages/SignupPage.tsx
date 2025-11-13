import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Mail, Lock, User, Loader, Check, Eye, EyeOff, AlertCircle } from 'lucide-react'
import toast from 'react-hot-toast'
import { useAuth } from '../context/AuthContext'

const AnimatedOrb = ({ delay = 0, size = 'w-64', blur = 'blur-3xl', duration = 6, gradient = 'linear-gradient(135deg, rgb(168, 85, 247), rgb(236, 72, 153))' }) => (
  <motion.div
    className={`absolute ${size} h-64 rounded-full filter ${blur} opacity-30`}
    animate={{ 
      y: [0, 40, 0],
      x: [0, 20, 0],
      scale: [1, 1.1, 1]
    }}
    transition={{ duration, repeat: Infinity, delay }}
    style={{ background: gradient }}
  />
)

const FloatingParticle = ({ delay = 0, x = 0, y = 0 }) => (
  <motion.div
    className="absolute w-1 h-1 bg-purple-400 rounded-full"
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
    <div className="absolute inset-0">
      <AnimatedOrb delay={0} size="w-72" blur="blur-3xl" duration={7} gradient="linear-gradient(135deg, rgb(168, 85, 247), rgb(236, 72, 153))" />
      <AnimatedOrb delay={0.5} size="w-48" blur="blur-2xl" duration={9} gradient="linear-gradient(135deg, rgb(99, 102, 241), rgb(168, 85, 247))" />
      
      {[...Array(12)].map((_, i) => (
        <FloatingParticle 
          key={i} 
          delay={i * 0.3} 
          x={Math.random() * 100} 
          y={Math.random() * 100} 
        />
      ))}
    </div>

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
        <div className="text-7xl filter drop-shadow-lg">✨</div>
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <h2 className="text-4xl font-bold text-white mb-3 drop-shadow-lg">Start Your Journey</h2>
        <p className="text-lg text-purple-100/80">Join thousands improving their wellness</p>
        
        <motion.div
          className="mt-8 flex justify-center gap-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              className="w-2 h-2 rounded-full bg-purple-300"
              animate={{ scale: [1, 1.5, 1] }}
              transition={{ duration: 2, repeat: Infinity, delay: i * 0.2 }}
            />
          ))}
        </motion.div>
      </motion.div>
    </motion.div>
  </div>
)

export default function SignupPage() {
  const [email, setEmail] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [focused, setFocused] = useState<string | null>(null)
  const navigate = useNavigate()
  const { signup } = useAuth()

  const passwordsMatch = password && confirmPassword && password === confirmPassword
  const passwordValid = password.length >= 8
  const hasUppercase = /[A-Z]/.test(password)
  const hasNumber = /[0-9]/.test(password)
  const hasSpecial = /[!@#$%^&*]/.test(password)
  const passwordStrength = (
    [password.length >= 8, hasUppercase, hasNumber, hasSpecial].filter(Boolean).length / 4
  ) * 100

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!passwordsMatch) {
      toast.error('Passwords do not match')
      return
    }

    if (!passwordValid) {
      toast.error('Password must be at least 8 characters')
      return
    }

    if (!email || !username) {
      toast.error('Please fill in all fields')
      return
    }

    setLoading(true)

    try {
      await signup(email, username, password)
      toast.success('Account created! Welcome aboard! 🎉')
      navigate('/')
    } catch (err: any) {
      const message = err.response?.data?.detail || 'Signup failed'
      toast.error(message)
    } finally {
      setLoading(false)
    }
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08, delayChildren: 0.2 }
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
        className="w-full lg:w-1/2 flex flex-col justify-center px-6 sm:px-16 py-8 overflow-y-auto relative"
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.7 }}
      >
        {/* Subtle background decoration */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-purple-50 to-transparent rounded-full blur-2xl pointer-events-none" />
        
        <div className="max-w-md mx-auto w-full relative z-10 py-8">
          {/* Logo/Branding */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="mb-8"
          >
            <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
              MindfulAI
            </h2>
          </motion.div>

          {/* Header */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="mb-8"
          >
            <motion.div variants={itemVariants}>
              <h1 className="text-5xl font-bold text-slate-900 mb-2 leading-tight">
                Create <span className="bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">Account</span>
              </h1>
              <p className="text-lg text-slate-600">Begin your mindfulness journey today</p>
            </motion.div>
          </motion.div>

          {/* Form */}
          <motion.form
            onSubmit={handleSubmit}
            className="space-y-4"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Email */}
            <motion.div
              variants={itemVariants}
              className="space-y-2.5"
            >
              <label className="block text-sm font-semibold text-slate-800">Email Address</label>
              <motion.div className="relative group" animate={{ scale: focused === 'email' ? 1.01 : 1 }}>
                <Mail className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors ${focused === 'email' ? 'text-purple-500' : 'text-slate-400'}`} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onFocus={() => setFocused('email')}
                  onBlur={() => setFocused(null)}
                  className="w-full pl-12 pr-4 py-3 rounded-lg border-2 border-slate-200 bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-300 shadow-sm hover:border-slate-300"
                  placeholder="you@example.com"
                  required
                  autoComplete="email"
                />
              </motion.div>
            </motion.div>

            {/* Username */}
            <motion.div
              variants={itemVariants}
              className="space-y-2.5"
            >
              <label className="block text-sm font-semibold text-slate-800">Username</label>
              <motion.div className="relative group" animate={{ scale: focused === 'username' ? 1.01 : 1 }}>
                <User className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors ${focused === 'username' ? 'text-purple-500' : 'text-slate-400'}`} />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  onFocus={() => setFocused('username')}
                  onBlur={() => setFocused(null)}
                  className="w-full pl-12 pr-4 py-3 rounded-lg border-2 border-slate-200 bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-300 shadow-sm hover:border-slate-300"
                  placeholder="Choose a username"
                  required
                  autoComplete="username"
                />
              </motion.div>
            </motion.div>

            {/* Password */}
            <motion.div
              variants={itemVariants}
              className="space-y-2.5"
            >
              <label className="block text-sm font-semibold text-slate-800">Password</label>
              <motion.div className="relative group" animate={{ scale: focused === 'password' ? 1.01 : 1 }}>
                <Lock className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors ${focused === 'password' ? 'text-purple-500' : 'text-slate-400'}`} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setFocused('password')}
                  onBlur={() => setFocused(null)}
                  className="w-full pl-12 pr-11 py-3 rounded-lg border-2 border-slate-200 bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-300 shadow-sm hover:border-slate-300"
                  placeholder="••••••••"
                  required
                  autoComplete="new-password"
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

              {password && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="space-y-2 mt-3">
                  <div className="flex gap-2 h-2 rounded-full overflow-hidden bg-slate-200">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${passwordStrength}%` }}
                      transition={{ duration: 0.4 }}
                      className={`rounded-full transition-colors ${
                        passwordStrength < 50 ? 'bg-red-500' : passwordStrength < 75 ? 'bg-yellow-500' : 'bg-green-500'
                      }`}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    {[
                      { label: '8+ characters', check: password.length >= 8 },
                      { label: 'Uppercase', check: hasUppercase },
                      { label: 'Number', check: hasNumber },
                      { label: 'Special char', check: hasSpecial }
                    ].map((item, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: idx * 0.05 }}
                        className={`flex items-center gap-1.5 ${item.check ? 'text-green-600' : 'text-slate-500'}`}
                      >
                        <motion.div
                          animate={{ scale: item.check ? 1 : 0.8 }}
                          className={`w-2.5 h-2.5 rounded-full transition-colors ${item.check ? 'bg-green-500' : 'bg-slate-300'}`}
                        />
                        {item.label}
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
            </motion.div>

            {/* Confirm Password */}
            <motion.div
              variants={itemVariants}
              className="space-y-2.5"
            >
              <label className="block text-sm font-semibold text-slate-800">Confirm Password</label>
              <motion.div className="relative group" animate={{ scale: focused === 'confirm' ? 1.01 : 1 }}>
                <Lock className={`absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 transition-colors ${focused === 'confirm' ? 'text-purple-500' : 'text-slate-400'}`} />
                <input
                  type={showConfirm ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  onFocus={() => setFocused('confirm')}
                  onBlur={() => setFocused(null)}
                  className="w-full pl-12 pr-11 py-3 rounded-lg border-2 border-slate-200 bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all duration-300 shadow-sm hover:border-slate-300"
                  placeholder="••••••••"
                  required
                  autoComplete="new-password"
                />
                <motion.button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {showConfirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </motion.button>
              </motion.div>

              {confirmPassword && (
                <motion.div 
                  initial={{ opacity: 0 }} 
                  animate={{ opacity: 1 }} 
                  className={`flex items-center gap-2 text-sm font-medium ${passwordsMatch ? 'text-green-600' : 'text-red-600'}`}
                >
                  {passwordsMatch ? (
                    <>
                      <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 0.5 }}>
                        <Check className="w-4 h-4" />
                      </motion.div>
                      Passwords match
                    </>
                  ) : (
                    <>
                      <AlertCircle className="w-4 h-4" />
                      Passwords do not match
                    </>
                  )}
                </motion.div>
              )}
            </motion.div>

            {/* Submit Button */}
            <motion.button
              variants={itemVariants}
              type="submit"
              disabled={loading || !passwordsMatch || passwordStrength < 100}
              whileHover={{ scale: 1.02, boxShadow: '0 20px 25px -5px rgba(168, 85, 247, 0.3)' }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-3.5 px-4 bg-gradient-to-r from-purple-600 to-pink-500 text-white font-semibold rounded-xl hover:from-purple-700 hover:to-pink-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 mt-8 shadow-lg relative overflow-hidden group"
            >
              <motion.div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity" />
              {loading ? (
                <>
                  <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity }}>
                    <Loader className="w-5 h-5" />
                  </motion.div>
                  <span>Creating Account...</span>
                </>
              ) : (
                <>
                  <Check className="w-5 h-5" />
                  <span>Create Account</span>
                </>
              )}
            </motion.button>
          </motion.form>

          {/* Divider */}
          <motion.div variants={itemVariants} className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full h-px bg-gradient-to-r from-transparent via-slate-300 to-transparent"></div>
            </div>
            <div className="relative flex justify-center">
              <span className="px-3 bg-white text-sm text-slate-500 font-medium">Already have an account?</span>
            </div>
          </motion.div>

          {/* Sign In Link */}
          <motion.div variants={itemVariants}>
            <motion.a
              href="/login"
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              className="block w-full text-center py-3.5 px-4 border-2 border-slate-200 text-slate-900 font-semibold rounded-xl hover:border-purple-300 hover:bg-purple-50 transition-all duration-300"
            >
              Sign In
            </motion.a>
          </motion.div>

          {/* Footer */}
          <motion.p
            variants={itemVariants}
            className="text-center text-xs text-slate-500 mt-8 leading-relaxed"
          >
            By creating an account, you agree to our <a href="#" className="text-purple-600 hover:text-purple-700 font-semibold">Terms</a> and <a href="#" className="text-purple-600 hover:text-purple-700 font-semibold">Privacy Policy</a>
          </motion.p>
        </div>
      </motion.div>

      {/* Right Side - Illustration */}
      <motion.div
        className="hidden lg:flex w-1/2 bg-gradient-to-br from-purple-600 via-purple-500 to-pink-500 items-center justify-center relative overflow-hidden p-12"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <IllustrationSection />
      </motion.div>
    </div>
  )
}
