import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '../components/ui/form';
import { api } from '../helpers/api';
import { X, Mail, CheckCircle } from 'lucide-react';

const subscribeSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
});

type SubscribeForm = z.infer<typeof subscribeSchema>;

interface SubscribeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SubscribeModal: React.FC<SubscribeModalProps> = ({ isOpen, onClose }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const form = useForm<SubscribeForm>({
    resolver: zodResolver(subscribeSchema),
    defaultValues: { email: '' },
  });

  if (!isOpen) return null;

  const onSubmit = async (data: SubscribeForm) => {
    setIsSubmitting(true);
    try {
      await api.post('/subscribers/subscribe', {
        body: { email: data.email },
      });
      setIsSuccess(true);
      form.reset();
    } catch (error: any) {
      form.setError('email', {
        message: error.message || 'Failed to subscribe. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setIsSuccess(false);
    form.reset();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/30 bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={handleClose}>
      <div
        className="bg-white rounded-xl shadow-xl w-full max-w-md animate-in slide-in-from-bottom-4 duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {isSuccess ? (
          <div className="p-8 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-serif font-bold text-gray-900 mb-2">You're Subscribed!</h2>
            <p className="text-gray-500 text-sm mb-6">
              Thank you for joining Newzify. We've sent a welcome email to your inbox. You'll now receive the latest news and updates.
            </p>
            <Button
              onClick={handleClose}
              className="w-full h-11 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-all duration-200"
            >
              Got It
            </Button>
          </div>
        ) : (
          <div className="p-8">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                  <Mail className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <h2 className="text-xl font-serif font-bold text-gray-900">Subscribe to Newzify</h2>
                </div>
              </div>
              <button
                onClick={handleClose}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-gray-500 text-sm mb-6 leading-relaxed">
              Stay ahead of the curve. Get breaking news, exclusive stories, and the latest updates delivered straight to your inbox — never miss what matters.
            </p>

            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <p className="text-xs font-semibold text-gray-700 uppercase tracking-wider mb-2">What you'll get:</p>
              <ul className="space-y-1.5">
                <li className="flex items-center gap-2 text-sm text-gray-600">
                  <span className="w-1.5 h-1.5 bg-red-500 rounded-full flex-shrink-0"></span>
                  Breaking news alerts
                </li>
                <li className="flex items-center gap-2 text-sm text-gray-600">
                  <span className="w-1.5 h-1.5 bg-red-500 rounded-full flex-shrink-0"></span>
                  Top stories & trending topics
                </li>
                <li className="flex items-center gap-2 text-sm text-gray-600">
                  <span className="w-1.5 h-1.5 bg-red-500 rounded-full flex-shrink-0"></span>
                  Exclusive editorial content
                </li>
              </ul>
            </div>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                          className="h-11 border border-gray-300 rounded-lg bg-white focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all duration-200"
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
                      Subscribing...
                    </div>
                  ) : (
                    'Subscribe Now'
                  )}
                </Button>
              </form>
            </Form>

            <p className="text-xs text-gray-400 text-center mt-4">
              No spam, unsubscribe anytime.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SubscribeModal;
