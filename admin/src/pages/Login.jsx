import axios from 'axios'
import React, { useContext, useState } from 'react'
import { DoctorContext } from '../context/DoctorContext'
import { AdminContext } from '../context/AdminContext'
import { toast } from 'react-toastify'

const Login = () => {
  const [state, setState] = useState('Admin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showForgotPassword, setShowForgotPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const backendUrl = import.meta.env.VITE_BACKEND_URL
  const { setDToken } = useContext(DoctorContext)
  const { setAToken } = useContext(AdminContext)

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    setIsLoading(true);

    try {
      if (state === 'Admin') {
        const { data } = await axios.post(backendUrl + '/api/admin/login', { email, password })
        if (data.success) {
          setAToken(data.token)
          localStorage.setItem('aToken', data.token)
          toast.success('Admin login successful')
        } else {
          toast.error(data.message)
        }
      } else {
        const { data } = await axios.post(backendUrl + '/api/doctor/login', { email, password })
        if (data.success) {
          setDToken(data.token)
          localStorage.setItem('dToken', data.token)
          toast.success('Doctor login successful')
        } else {
          toast.error(data.message)
        }
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed')
    } finally {
      setIsLoading(false);
    }
  }

  const handleForgotPassword = async () => {
    if (!email) {
      toast.error('Please enter your email address')
      return
    }

    setIsLoading(true)
    try {
      const { data } = await axios.post(backendUrl + '/api/doctor/forgot-password', { email })
      if (data.success) {
        toast.success('Password reset link sent to your email')
        // In production, you would not show this alert
        toast.info(`For development: Token = ${data.token}`)
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to send reset link')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={onSubmitHandler} className='min-h-[80vh] flex items-center'>
      <div className='flex flex-col gap-3 m-auto items-start p-8 min-w-[340px] sm:min-w-96 border rounded-xl text-[#5E5E5E] text-sm shadow-lg'>
        <p className='text-2xl font-semibold m-auto'><span className='text-primary'>{state}</span> Login</p>
        
        <div className='w-full'>
          <p>Email</p>
          <input 
            onChange={(e) => setEmail(e.target.value)} 
            value={email} 
            className='border border-[#DADADA] rounded w-full p-2 mt-1' 
            type="email" 
            required 
            disabled={isLoading}
          />
        </div>
        
        {!showForgotPassword && (
          <div className='w-full'>
            <p>Password</p>
            <input 
              onChange={(e) => setPassword(e.target.value)} 
              value={password} 
              className='border border-[#DADADA] rounded w-full p-2 mt-1' 
              type="password" 
              required 
              disabled={isLoading}
            />
          </div>
        )}

        {state === 'Doctor' && !showForgotPassword && (
          <p 
            onClick={() => setShowForgotPassword(true)} 
            className='text-primary text-xs cursor-pointer self-end'
          >
            Forgot Password?
          </p>
        )}

        {showForgotPassword ? (
          <>
            <button
              type="button"
              onClick={handleForgotPassword}
              disabled={isLoading}
              className='bg-primary text-white w-full py-2 rounded-md text-base disabled:opacity-50'
            >
              {isLoading ? 'Sending...' : 'Send Reset Link'}
            </button>
            <p 
              onClick={() => setShowForgotPassword(false)} 
              className='text-primary text-xs cursor-pointer self-end'
            >
              Back to Login
            </p>
          </>
        ) : (
          <>
            <button 
              type="submit" 
              disabled={isLoading}
              className='bg-primary text-white w-full py-2 rounded-md text-base disabled:opacity-50'
            >
              {isLoading ? 'Logging in...' : 'Login'}
            </button>
            
            <div className='flex justify-between w-full text-xs'>
              {state === 'Admin' ? (
                <p>
                  Doctor Login? <span onClick={() => setState('Doctor')} className='text-primary underline cursor-pointer'>Click here</span>
                </p>
              ) : (
                <p>
                  Admin Login? <span onClick={() => setState('Admin')} className='text-primary underline cursor-pointer'>Click here</span>
                </p>
              )}
            </div>
          </>
        )}
      </div>
    </form>
  )
}

export default Login