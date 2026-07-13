import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../components/ui/form';
import { api } from '../helpers/api';

const registrationSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  phoneNumber: z.string().min(10, 'Please enter a valid phone number'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password must contain at least one uppercase letter, one lowercase letter, and one number'),
});

type RegistrationForm = z.infer<typeof registrationSchema>;

const OTPModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (otp: string) => void;
  timeLeft: number;
  email: string;
}> = ({ isOpen, onClose, onSubmit, timeLeft, email }) => {
  const [otp, setOtp] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length === 6) {
      onSubmit(otp);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl p-8 w-full max-w-md animate-in slide-in-from-bottom-4 duration-500 border border-gray-100">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-serif font-bold text-gray-900 mb-2">Verify Your Email</h2>
          <p className="text-gray-500 text-sm">
            We've sent a verification code to <br />
            <span className="font-semibold text-gray-700">{email}</span>
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Enter OTP Code
            </label>
            <Input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
              placeholder="Enter 6-digit OTP"
              className="h-11 border border-gray-300 rounded-lg bg-white focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all duration-200 text-center text-lg font-mono tracking-widest"
              maxLength={6}
            />
          </div>

          <div className="text-center">
            <p className="text-sm text-gray-500">
              Time remaining: <span className="font-semibold text-red-600">{formatTime(timeLeft)}</span>
            </p>
          </div>

          <div className="flex gap-3">
            <Button
              type="button"
              onClick={onClose}
              variant="outline"
              className="flex-1 h-11 border border-gray-300 rounded-lg hover:border-gray-400"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={otp.length !== 6 || timeLeft === 0}
              className="flex-1 h-11 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Verify OTP
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

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

const Registration: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showOTPModal, setShowOTPModal] = useState(false);
  const [timeLeft, setTimeLeft] = useState(300);
  const [formData, setFormData] = useState<RegistrationForm | null>(null);
  const [toast, setToast] = useState<{
    message: string;
    type: 'success' | 'error';
    isVisible: boolean;
  }>({
    message: '',
    type: 'success',
    isVisible: false
  });

  const form = useForm<RegistrationForm>({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phoneNumber: '',
      password: ''
    }
  });

  React.useEffect(() => {
    if (showOTPModal && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [showOTPModal, timeLeft]);

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type, isVisible: true });
  };

  const hideToast = () => {
    setToast(prev => ({ ...prev, isVisible: false }));
  };

  const sendOTP = async (data: RegistrationForm) => {
    try {
      const response = await api.post('/otp/send', {
        body: {
          identifier: data.email,
          action: 'signup'
        }
      });

      console.log('OTP sent successfully:', response);
      setFormData(data);
      setShowOTPModal(true);
      setTimeLeft(300);
    } catch (error: any) {
      console.error('Error sending OTP:', error);
      showToast(error.message || 'Failed to send OTP. Please try again.', 'error');
    }
  };

  const registerUser = async (otp: string) => {
    if (!formData) return;

    setIsSubmitting(true);
    
    try {
      const response = await api.post('/auth/register', {
        body: {
          first_name: formData.firstName,
          last_name: formData.lastName,
          email: formData.email,
          phone: formData.phoneNumber,
          password: formData.password,
          otp: otp
        }
      });

      console.log('Registration successful:', response);
      showToast('Registration successful! Welcome to Newzify!', 'success');
      setShowOTPModal(false);
      setFormData(null);
      form.reset();
    } catch (error: any) {
      console.error('Registration error:', error);
      showToast(error.message || 'Registration failed. Please try again.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const onSubmit = async (data: RegistrationForm) => {
    await sendOTP(data);
  };

  return (
    <>
      <div className="flex items-center justify-center bg-gray-50 p-4 min-h-screen">
        <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md animate-in slide-in-from-bottom-4 duration-500 border border-gray-100">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-serif font-bold text-gray-900 mb-2">
              Join Newzify
            </h1>
            <p className="text-gray-500 text-sm">
              Stay informed with the latest news and media content
            </p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-semibold text-gray-700">
                        First Name
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Enter your first name"
                          className="h-11 border border-gray-300 rounded-lg bg-white focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all duration-200 hover:border-gray-400"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-semibold text-gray-700">
                        Last Name
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Enter your last name"
                          className="h-11 border border-gray-300 rounded-lg bg-white focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all duration-200 hover:border-gray-400"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
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
                        placeholder="Enter your email address"
                        className="h-11 border border-gray-300 rounded-lg bg-white focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all duration-200 hover:border-gray-400"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phoneNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-semibold text-gray-700">
                      Phone Number
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="tel"
                        placeholder="Enter your phone number"
                        className="h-11 border border-gray-300 rounded-lg bg-white focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all duration-200 hover:border-gray-400"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-semibold text-gray-700">
                      Password
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="password"
                        placeholder="Create a strong password"
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
                  'Send OTP & Continue'
                )}
              </Button>
            </form>
          </Form>

          <div className="text-center mt-6 pt-6 border-t border-gray-200">
            <p className="text-gray-500 text-sm">
              Already have an account?{' '}
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

      <OTPModal
        isOpen={showOTPModal}
        onClose={() => {
          setShowOTPModal(false);
          setFormData(null);
        }}
        onSubmit={registerUser}
        timeLeft={timeLeft}
        email={formData?.email || ''}
      />

      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={hideToast}
      />
    </>
  );
};

export default Registration;
