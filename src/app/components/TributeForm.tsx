'use client';

import { useState } from 'react';

interface TributeSubmission {
  name: string;
  message: string;
  email?: string;
  phone?: string;
  image?: File;
  anonymous: boolean;
}

export function TributeForm() {
  const [formData, setFormData] = useState<TributeSubmission>({
    name: '',
    message: '',
    email: '',
    phone: '',
    anonymous: false
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    setFormData(prev => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? checked : value 
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        alert('File size must be less than 10MB');
        return;
      }
      setSelectedFile(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.message.trim()) {
      alert('Please share your message or memory.');
      return;
    }

    // If not anonymous, require a name
    if (!formData.anonymous && !formData.name.trim()) {
      alert('Please enter your name or check "Submit anonymously".');
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.anonymous ? 'Anonymous' : formData.name);
      formDataToSend.append('message', formData.message);
      formDataToSend.append('email', formData.email || '');
      formDataToSend.append('phone', formData.phone || '');
      formDataToSend.append('anonymous', formData.anonymous.toString());
      
      if (selectedFile) {
        formDataToSend.append('image', selectedFile);
      }

      const response = await fetch('/api/tributes', {
        method: 'POST',
        body: formDataToSend,
      });

      if (response.ok) {
        setSubmitStatus('success');
        setFormData({ name: '', message: '', email: '', phone: '', anonymous: false });
        setSelectedFile(null);
        // Reset file input
        const fileInput = document.getElementById('image') as HTMLInputElement;
        if (fileInput) fileInput.value = '';
      } else {
        setSubmitStatus('error');
      }
    } catch (error) {
      console.error('Error submitting tribute:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Anonymous Option */}
      <div className="bg-blue-900/30 border border-blue-500/50 rounded-xl p-4 backdrop-blur-sm">
        <label className="flex items-center space-x-3 cursor-pointer">
          <input
            type="checkbox"
            name="anonymous"
            checked={formData.anonymous}
            onChange={handleInputChange}
            className="w-4 h-4 text-blue-400 bg-gray-700 border-gray-600 rounded focus:ring-blue-400 focus:ring-2 focus:ring-offset-0"
          />
          <span className="text-sm font-medium text-blue-200">
            Submit this tribute anonymously
          </span>
        </label>
        <p className="text-xs text-blue-300 mt-1 ml-7">
          Your name will be shown as &ldquo;Anonymous&rdquo; if checked
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="name" className="block text-sm font-semibold text-gray-200 mb-2">
            Your Name {!formData.anonymous && <span className="text-red-400">*</span>}
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required={!formData.anonymous}
            disabled={formData.anonymous}
            className={`w-full px-4 py-3 bg-gray-700 border border-gray-600 text-white rounded-xl placeholder-gray-400 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all duration-200 ${
              formData.anonymous ? 'bg-gray-800 text-gray-500 border-gray-700' : ''
            }`}
            placeholder={formData.anonymous ? 'Anonymous' : 'Enter your full name'}
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-semibold text-gray-200 mb-2">
            Email <span className="text-gray-400 font-normal">(Optional)</span>
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            className="w-full px-4 py-3 bg-gray-700 border border-gray-600 text-white rounded-xl placeholder-gray-400 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all duration-200"
            placeholder="your.email@example.com"
          />
        </div>
      </div>

      <div>
        <label htmlFor="phone" className="block text-sm font-semibold text-gray-200 mb-2">
          Phone Number <span className="text-gray-400 font-normal">(Optional)</span>
        </label>
        <input
          type="tel"
          id="phone"
          name="phone"
          value={formData.phone}
          onChange={handleInputChange}
          className="w-full px-4 py-3 bg-gray-700 border border-gray-600 text-white rounded-xl placeholder-gray-400 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all duration-200"
          placeholder="(555) 123-4567"
        />
      </div>

      <div>
        <label htmlFor="message" className="block text-sm font-semibold text-gray-200 mb-2">
          Your Message <span className="text-red-400">*</span>
        </label>
        <textarea
          id="message"
          name="message"
          value={formData.message}
          onChange={handleInputChange}
          required
          rows={4}
          className="w-full px-4 py-3 bg-gray-700 border border-gray-600 text-white rounded-xl placeholder-gray-400 focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all duration-200 resize-none"
          placeholder="Share your memories, thoughts, or how Peter touched your life..."
        />
      </div>

      <div>
        <label htmlFor="image" className="block text-sm font-semibold text-gray-200 mb-2">
          Upload Photo <span className="text-gray-400 font-normal">(Optional)</span>
        </label>
        <div className="relative">
          <input
            type="file"
            id="image"
            name="image"
            onChange={handleFileChange}
            accept="image/*"
            className="w-full px-4 py-3 bg-gray-700 border border-gray-600 text-white rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all duration-200 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700 file:cursor-pointer"
          />
        </div>
        <p className="text-xs text-gray-400 mt-2">
          Max file size: 10MB. Supported formats: JPG, PNG, GIF, WEBP
        </p>
        {selectedFile && (
          <div className="mt-2 p-2 bg-green-900/30 border border-green-500/50 rounded-lg">
            <p className="text-sm text-green-300 flex items-center">
              <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Selected: {selectedFile.name}
            </p>
          </div>
        )}
      </div>

      {submitStatus === 'success' && (
        <div className="bg-green-900/30 border border-green-500/50 rounded-xl p-4 backdrop-blur-sm">
          <div className="flex items-center">
            <svg className="w-5 h-5 text-green-400 mr-3" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <p className="text-green-200 font-semibold">
              Thank you for your tribute! It will be reviewed and published soon.
            </p>
          </div>
        </div>
      )}

      {submitStatus === 'error' && (
        <div className="bg-red-900/30 border border-red-500/50 rounded-xl p-4 backdrop-blur-sm">
          <div className="flex items-center">
            <svg className="w-5 h-5 text-red-400 mr-3" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <p className="text-red-200 font-semibold">
              Sorry, there was an error submitting your tribute. Please try again.
            </p>
          </div>
        </div>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-blue-800 disabled:to-blue-900 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-[1.02] disabled:scale-100 disabled:cursor-not-allowed"
      >
        {isSubmitting ? (
          <div className="flex items-center justify-center">
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Submitting...
          </div>
        ) : (
          'Submit Tribute'
        )}
      </button>

      <p className="text-sm text-gray-400 text-center leading-relaxed">
        All tributes are reviewed before being published to ensure they are appropriate and respectful.
      </p>
    </form>
  );
} 