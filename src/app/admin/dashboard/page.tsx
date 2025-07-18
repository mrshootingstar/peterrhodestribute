'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

interface Tribute {
  id: number;
  name: string;
  message: string;
  email?: string;
  phone?: string;
  image_url?: string;
  approved: boolean;
  created_at: string;
  approved_at?: string;
  admin_notes?: string;
}

export default function AdminDashboard() {
  const [tributes, setTributes] = useState<Tribute[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [processingId, setProcessingId] = useState<number | null>(null);
  const router = useRouter();

  useEffect(() => {
    fetchTributes();
  }, []);

  const fetchTributes = async () => {
    try {
      const response = await fetch('/api/admin/tributes');
      
      if (response.status === 401) {
        router.push('/admin');
        return;
      }

      if (response.ok) {
        const data = await response.json();
        setTributes(data.tributes);
      } else {
        setError('Failed to fetch tributes');
      }
    } catch (error) {
      setError('An error occurred while fetching tributes');
    } finally {
      setLoading(false);
    }
  };

  const handleTributeAction = async (id: number, approved: boolean, admin_notes?: string) => {
    setProcessingId(id);
    
    try {
      const response = await fetch('/api/admin/tributes', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id, approved, admin_notes }),
      });

      if (response.ok) {
        // Refresh the tributes list
        fetchTributes();
      } else {
        setError('Failed to update tribute');
      }
    } catch (error) {
      setError('An error occurred while updating tribute');
    } finally {
      setProcessingId(null);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/admin');
    } catch (error) {
      router.push('/admin');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const pendingTributes = tributes.filter(t => !t.approved);
  const approvedTributes = tributes.filter(t => t.approved);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-4"></div>
          <p className="text-slate-600">Loading tributes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-slate-800">Admin Dashboard</h1>
            <p className="text-slate-600 mt-2">Manage tributes for Peter Frederick Rhodes</p>
          </div>
          <button
            onClick={handleLogout}
            className="bg-slate-600 hover:bg-slate-700 text-white px-6 py-2 rounded-xl transition-colors"
          >
            Logout
          </button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
            <p className="text-red-800 font-medium">{error}</p>
          </div>
        )}

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-200">
            <h3 className="text-lg font-semibold text-slate-700">Total Tributes</h3>
            <p className="text-3xl font-bold text-blue-600">{tributes.length}</p>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-200">
            <h3 className="text-lg font-semibold text-slate-700">Pending Review</h3>
            <p className="text-3xl font-bold text-orange-600">{pendingTributes.length}</p>
          </div>
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-200">
            <h3 className="text-lg font-semibold text-slate-700">Approved</h3>
            <p className="text-3xl font-bold text-green-600">{approvedTributes.length}</p>
          </div>
        </div>

        {/* Pending Tributes */}
        {pendingTributes.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-slate-800 mb-6">
              Pending Review ({pendingTributes.length})
            </h2>
            <div className="space-y-6">
              {pendingTributes.map((tribute) => (
                <TributeCard
                  key={tribute.id}
                  tribute={tribute}
                  onApprove={(id, notes) => handleTributeAction(id, true, notes)}
                  onReject={(id, notes) => handleTributeAction(id, false, notes)}
                  isProcessing={processingId === tribute.id}
                />
              ))}
            </div>
          </div>
        )}

        {/* Approved Tributes */}
        {approvedTributes.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-slate-800 mb-6">
              Approved Tributes ({approvedTributes.length})
            </h2>
            <div className="space-y-6">
              {approvedTributes.map((tribute) => (
                <TributeCard
                  key={tribute.id}
                  tribute={tribute}
                  onReject={(id, notes) => handleTributeAction(id, false, notes)}
                  isProcessing={processingId === tribute.id}
                  isApproved={true}
                />
              ))}
            </div>
          </div>
        )}

        {tributes.length === 0 && (
          <div className="text-center py-12">
            <div className="bg-white rounded-3xl shadow-lg p-12 border border-slate-200">
              <h3 className="text-2xl font-semibold text-slate-700 mb-4">
                No tributes yet
              </h3>
              <p className="text-slate-600">
                Tributes submitted by visitors will appear here for review.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function TributeCard({ 
  tribute, 
  onApprove, 
  onReject, 
  isProcessing, 
  isApproved = false 
}: {
  tribute: Tribute;
  onApprove?: (id: number, notes?: string) => void;
  onReject?: (id: number, notes?: string) => void;
  isProcessing: boolean;
  isApproved?: boolean;
}) {
  const [showNotes, setShowNotes] = useState(false);
  const [notes, setNotes] = useState('');

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className={`bg-white rounded-2xl shadow-lg p-6 border-2 ${
      isApproved ? 'border-green-200' : 'border-orange-200'
    }`}>
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-4">
          {isApproved && (
            <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
              ✓ Approved
            </div>
          )}
          {!isApproved && (
            <div className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm font-medium">
              ⏳ Pending
            </div>
          )}
        </div>
        <span className="text-sm text-slate-500">
          {formatDate(tribute.created_at)}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <h3 className="text-xl font-semibold text-slate-800 mb-2">
            {tribute.name}
          </h3>
          
          {tribute.email && (
            <p className="text-sm text-slate-600 mb-1">Email: {tribute.email}</p>
          )}
          {tribute.phone && (
            <p className="text-sm text-slate-600 mb-4">Phone: {tribute.phone}</p>
          )}

          <div className="bg-slate-50 rounded-xl p-4 mb-4">
            <p className="text-slate-800 whitespace-pre-wrap">{tribute.message}</p>
          </div>

          {tribute.admin_notes && (
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-4">
              <p className="text-sm font-medium text-blue-800 mb-1">Admin Notes:</p>
              <p className="text-blue-700">{tribute.admin_notes}</p>
            </div>
          )}
        </div>

        <div className="lg:col-span-1">
          {tribute.image_url && (
            <div className="relative w-full h-48 rounded-xl overflow-hidden shadow-md mb-4">
              <Image
                src={tribute.image_url}
                alt="Tribute photo"
                fill
                className="object-cover"
                sizes="300px"
              />
            </div>
          )}

          <div className="space-y-3">
            {!isApproved && onApprove && (
              <button
                onClick={() => onApprove(tribute.id, notes)}
                disabled={isProcessing}
                className="w-full bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white font-semibold py-3 px-4 rounded-xl transition-colors"
              >
                {isProcessing ? 'Processing...' : 'Approve'}
              </button>
            )}

            {onReject && (
              <button
                onClick={() => setShowNotes(!showNotes)}
                disabled={isProcessing}
                className="w-full bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white font-semibold py-3 px-4 rounded-xl transition-colors"
              >
                {isApproved ? 'Revoke Approval' : 'Reject'}
              </button>
            )}

            {showNotes && (
              <div className="space-y-3">
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Add admin notes (optional)"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  rows={3}
                />
                <div className="flex space-x-2">
                  <button
                    onClick={() => onReject?.(tribute.id, notes)}
                    disabled={isProcessing}
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 px-3 rounded-lg text-sm font-medium"
                  >
                    Confirm
                  </button>
                  <button
                    onClick={() => setShowNotes(false)}
                    className="flex-1 bg-slate-600 hover:bg-slate-700 text-white py-2 px-3 rounded-lg text-sm font-medium"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
} 