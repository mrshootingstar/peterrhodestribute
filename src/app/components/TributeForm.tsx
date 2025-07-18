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
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
        <label className="flex items-center space-x-3 cursor-pointer">
          <input
            type="checkbox"
            name="anonymous"
            checked={formData.anonymous}
            onChange={handleInputChange}
            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
          />
          <span className="text-sm font-medium text-blue-800">
            Submit this tribute anonymously
          </span>
        </label>
        <p className="text-xs text-blue-600 mt-1 ml-7">
          Your name will be shown as &ldquo;Anonymous&rdquo; if checked
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="name" className="block text-sm font-semibold text-slate-700 mb-2">
            Your Name {!formData.anonymous && '*'}
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required={!formData.anonymous}
            disabled={formData.anonymous}
            className={`w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
              formData.anonymous ? 'bg-gray-100 text-gray-500' : ''
            }`}
            placeholder={formData.anonymous ? 'Anonymous' : 'Enter your full name'}
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-semibold text-slate-700 mb-2">
            Email (Optional)
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
            placeholder="your.email@example.com"
          />
        </div>
      </div>

      <div>
        <label htmlFor="phone" className="block text-sm font-semibold text-slate-700 mb-2">
          Phone Number (Optional)
        </label>
        <input
          type="tel"
          id="phone"
          name="phone"
          value={formData.phone}
          onChange={handleInputChange}
          className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
          placeholder="(555) 123-4567"
        />
      </div>

      <div>
        <label htmlFor="message" className="block text-sm font-semibold text-slate-700 mb-2">
          Your Message *
        </label>
        <textarea
          id="message"
          name="message"
          value={formData.message}
          onChange={handleInputChange}
          required
          rows={4}
          className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-none"
          placeholder="Share your memories, thoughts, or how Peter touched your life..."
        />
      </div>

      <div>
        <label htmlFor="image" className="block text-sm font-semibold text-slate-700 mb-2">
          Upload Photo (Optional)
        </label>
        <input
          type="file"
          id="image"
          name="image"
          onChange={handleFileChange}
          accept="image/*"
          className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
        />
        <p className="text-xs text-slate-500 mt-1">
          Max file size: 10MB. Supported formats: JPG, PNG, GIF, WEBP
        </p>
        {selectedFile && (
          <p className="text-sm text-green-600 mt-2">
            Selected: {selectedFile.name}
          </p>
        )}
      </div>

      {submitStatus === 'success' && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-4">
          <p className="text-green-800 font-semibold">
            Thank you for your tribute! It will be reviewed and published soon.
          </p>
        </div>
      )}

      {submitStatus === 'error' && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4">
          <p className="text-red-800 font-semibold">
            Sorry, there was an error submitting your tribute. Please try again.
          </p>
        </div>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold py-4 px-6 rounded-xl transition-colors duration-200 shadow-lg hover:shadow-xl"
      >
        {isSubmitting ? 'Submitting...' : 'Submit Tribute'}
      </button>

      <p className="text-sm text-slate-600 text-center">
        All tributes are reviewed before being published to ensure they are appropriate and respectful.
      </p>
    </form>
  );
} 