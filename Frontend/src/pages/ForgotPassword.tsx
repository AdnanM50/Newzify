import React, { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../components/ui/form';
import { api } from '../helpers/api';

const emailSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

const otpSchema = z.object({
  otp: z.string().length(6, 'OTP must be exactly 6 digits'),
});

const passwordSchema = z.object({
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password must contain uppercase, lowercase, and number'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

type EmailForm = z.infer<typeof emailSchema>;
type OtpForm = z.infer<typeof otpSchema>;
type PasswordForm = z.infer<typeof passwordSchema>;

const Toast: React.FC<{
  message: string;
  type: 'success' | 'error';
  isVisible: boolean;
  onClose: () => void;
}> = ({ message, type, isVisible, onClose }) => {
  if (!isVisible) return null;

  React.useEffect(() => {
    const timer = setTimeout(() => onClose(), 5000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-right-4 duration-300">
      <div className={`px-6 py-4 rounded-lg shadow-lg text-white ${
        type === 'success' ? 'bg-green-500' : 'bg-red-500'
      }`}>
        <div className="flex items-center gap-3">
          <span className="text-lg">{type === 'success' ? '✅' : '❌'}</span>
          <span className="font-medium">{message}</span>
          <button onClick={onClose} className="ml-4 text-white hover:text-gray-200">✕</button>
        </div>
      </div>
    </div>
  );
};

const ForgotPassword: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<'email' | 'otp' | 'password'>('email');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [accessToken, setAccessToken] = useState('');
  const [timeLeft, setTimeLeft] = useState(300);
  const [toast, setToast] = useState<{
    message: string;
    type: 'success' | 'error';
    isVisible: boolean;
  }>({ message: '', type: 'success', isVisible: false });

  const emailForm = useForm<EmailForm>({
    resolver: zodResolver(emailSchema),
    defaultValues: { email: '' },
  });

  const otpForm = useForm<OtpForm>({
    resolver: zodResolver(otpSchema),
    defaultValues: { otp: '' },
  });

  const passwordForm = useForm<PasswordForm>({
    resolver: zodResolver(passwordSchema),
    defaultValues: { password: '', confirmPassword: '' },
  });

  React.useEffect(() => {
    if (step === 'otp' && timeLeft > 0) {
      const timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
      return () => clearInterval(timer);
    }
  }, [step, timeLeft]);

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type, isVisible: true });
  };

  const hideToast = () => setToast((prev) => ({ ...prev, isVisible: false }));

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const sendOTP = async (data: EmailForm) => {
    setIsSubmitting(true);
    try {
      await api.post('/otp/send', {
        body: {
          identifier: data.email,
          action: 'forget_password',
        },
      });
      setUserEmail(data.email);
      setStep('otp');
      setTimeLeft(300);
      showToast('OTP sent to your email address!', 'success');
    } catch (error: any) {
      showToast(error.message || 'Failed to send OTP. Please try again.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const verifyOTP = async (data: OtpForm) => {
    setIsSubmitting(true);
    try {
      const response = await api.post<{ accessToken: string }>('/auth/forget-password/verify-otp', {
        body: {
          identifier: userEmail,
          otp: data.otp,
          action: 'forget_password',
        },
      });
      setAccessToken(response.data.accessToken);
      setStep('password');
      showToast('OTP verified successfully!', 'success');
    } catch (error: any) {
      showToast(error.message || 'Invalid or expired OTP.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetPassword = async (data: PasswordForm) => {
    setIsSubmitting(true);
    try {
      localStorage.setItem('forgotAccessToken', accessToken);
      await api.post('/auth/forget-password/submit', {
        body: {
          password: data.password,
          confirm_password: data.confirmPassword,
        },
        token_name: 'forgotAccessToken',
      });
      localStorage.removeItem('forgotAccessToken');
      showToast('Password reset successful! Redirecting to login...', 'success');
      setTimeout(() => navigate({ to: '/login' }), 2000);
    } catch (error: any) {
      localStorage.removeItem('forgotAccessToken');
      showToast(error.message || 'Failed to reset password.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md animate-in slide-in-from-bottom-4 duration-500 border border-gray-100">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-serif font-bold text-gray-900 mb-2">
              {step === 'email' && 'Forgot Password'}
              {step === 'otp' && 'Verify OTP'}
              {step === 'password' && 'Reset Password'}
            </h1>
            <p className="text-gray-500 text-sm">
              {step === 'email' && 'Enter your email to receive a reset code'}
              {step === 'otp' && `We've sent a code to ${userEmail}`}
              {step === 'password' && 'Enter your new password below'}
            </p>
          </div>

          {/* Step Indicator */}
          <div className="flex items-center justify-center gap-2 mb-8">
            {['email', 'otp', 'password'].map((s, i) => (
              <React.Fragment key={s}>
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300 ${
                    step === s
                      ? 'bg-red-600 text-white'
                      : (['email', 'otp', 'password'].indexOf(step) > i
                          ? 'bg-red-600 text-white'
                          : 'bg-gray-200 text-gray-500')
                  }`}
                >
                  {['email', 'otp', 'password'].indexOf(step) > i ? '✓' : i + 1}
                </div>
                {i < 2 && (
                  <div className={`w-12 h-0.5 ${
                    ['email', 'otp', 'password'].indexOf(step) > i
                      ? 'bg-red-600'
                      : 'bg-gray-200'
                  }`} />
                )}
              </React.Fragment>
            ))}
          </div>

          {/* Step 1: Email */}
          {step === 'email' && (
            <Form {...emailForm}>
              <form onSubmit={emailForm.handleSubmit(sendOTP)} className="space-y-5">
                <FormField
                  control={emailForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-semibold text-gray-700">
                        Email Address
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="email"
                          placeholder="Enter your registered email"
                          className="h-11 border border-gray-300 rounded-lg bg-white focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all duration-200 hover:border-gray-400"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full h-11 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Sending OTP...
                    </div>
                  ) : (
                    'Send OTP'
                  )}
                </Button>
              </form>
            </Form>
          )}

          {/* Step 2: OTP Verification */}
          {step === 'otp' && (
            <Form {...otpForm}>
              <form onSubmit={otpForm.handleSubmit(verifyOTP)} className="space-y-5">
                <FormField
                  control={otpForm.control}
                  name="otp"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-semibold text-gray-700">
                        Enter OTP Code
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="text"
                          placeholder="Enter 6-digit OTP"
                          className="h-11 border border-gray-300 rounded-lg bg-white focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all duration-200 text-center text-lg font-mono tracking-widest"
                          maxLength={6}
                          onChange={(e) => field.onChange(e.target.value.replace(/\D/g, '').slice(0, 6))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="text-center">
                  <p className="text-sm text-gray-500">
                    Time remaining:{' '}
                    <span className={`font-semibold ${timeLeft <= 60 ? 'text-red-600' : 'text-gray-700'}`}>
                      {formatTime(timeLeft)}
                    </span>
                  </p>
                </div>
                {timeLeft === 0 && (
                  <div className="text-center">
                    <button
                      type="button"
                      onClick={() => {
                        setUserEmail('');
                        setStep('email');
                        setTimeLeft(300);
                      }}
                      className="text-sm text-red-600 hover:text-red-700 hover:underline font-semibold"
                    >
                      Resend OTP
                    </button>
                  </div>
                )}
                <div className="flex gap-3">
                  <Button
                    type="button"
                    onClick={() => setStep('email')}
                    variant="outline"
                    className="flex-1 h-11 border border-gray-300 rounded-lg hover:border-gray-400"
                  >
                    Back
                  </Button>
                  <Button
                    type="submit"
                    disabled={isSubmitting || otpForm.watch('otp').length !== 6 || timeLeft === 0}
                    className="flex-1 h-11 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Verifying...
                      </div>
                    ) : (
                      'Verify OTP'
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          )}

          {/* Step 3: New Password */}
          {step === 'password' && (
            <Form {...passwordForm}>
              <form onSubmit={passwordForm.handleSubmit(resetPassword)} className="space-y-5">
                <FormField
                  control={passwordForm.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-semibold text-gray-700">
                        New Password
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="password"
                          placeholder="Enter new password"
                          className="h-11 border border-gray-300 rounded-lg bg-white focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all duration-200 hover:border-gray-400"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={passwordForm.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-semibold text-gray-700">
                        Confirm Password
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          type="password"
                          placeholder="Confirm new password"
                          className="h-11 border border-gray-300 rounded-lg bg-white focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all duration-200 hover:border-gray-400"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex gap-3">
                  <Button
                    type="button"
                    onClick={() => setStep('otp')}
                    variant="outline"
                    className="flex-1 h-11 border border-gray-300 rounded-lg hover:border-gray-400"
                  >
                    Back
                  </Button>
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 h-11 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Resetting...
                      </div>
                    ) : (
                      'Reset Password'
                    )}
                  </Button>
                </div>
              </form>
            </Form>
          )}

          <div className="text-center mt-6 pt-6 border-t border-gray-200">
            <p className="text-gray-500 text-sm">
              Remember your password?{' '}
              <a
                href="/login"
                className="text-red-600 font-semibold hover:text-red-700 hover:underline transition-colors duration-200"
              >
                Sign in here
              </a>
            </p>
          </div>
        </div>
      </div>

      <Toast message={toast.message} type={toast.type} isVisible={toast.isVisible} onClose={hideToast} />
    </>
  );
};

export default ForgotPassword;
