'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { TributeExporter } from '../../components/TributeExporter';
import { AdminTributeMessage } from '../../components/AdminTributeMessage';


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

type FilterType = 'all' | 'pending' | 'approved';

export default function AdminDashboard() {
  const [tributes, setTributes] = useState<Tribute[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [processingId, setProcessingId] = useState<number | null>(null);
  const [filter, setFilter] = useState<FilterType>('all');
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const router = useRouter();

  useEffect(() => {
    fetchTributes();
  }, []);

  // Reset to page 1 when filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [filter]);

  const fetchTributes = async () => {
    try {
      const response = await fetch('/api/admin/tributes');
      
      if (response.status === 401) {
        router.push('/admin');
        return;
      }

      if (response.ok) {
        const data = await response.json() as { tributes: Tribute[] };
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

  const handleExportLinked = async () => {
    try {
      setIsExporting(true);
      setShowExportMenu(false);
      await TributeExporter.exportWithLinkedImages(tributes);
    } catch (error) {
      setError('Failed to export tributes');
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportZipped = async () => {
    if (!confirm('This will download all images and create a ZIP file. This may take a while depending on the number of images. Do you want to continue?')) {
      return;
    }

    try {
      setIsExporting(true);
      setShowExportMenu(false);
      await TributeExporter.exportWithDownloadedImages(tributes);
    } catch (error) {
      setError('Failed to export tributes with images');
    } finally {
      setIsExporting(false);
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

  const pendingTributes = tributes.filter((t: Tribute) => !t.approved);
  const approvedTributes = tributes.filter((t: Tribute) => t.approved);

  // Filter tributes based on selected filter
  const getFilteredTributes = () => {
    switch (filter) {
      case 'pending':
        return pendingTributes;
      case 'approved':
        return approvedTributes;
      default:
        return tributes;
    }
  };

  const filteredTributes = getFilteredTributes();
  
  // Pagination logic
  const totalTributes = filteredTributes.length;
  const totalPages = Math.ceil(totalTributes / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const currentTributes = filteredTributes.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    // Scroll to top when page changes
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePageSizeChange = (newPageSize: number) => {
    setPageSize(newPageSize);
    setCurrentPage(1); // Reset to first page when page size changes
  };

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
          <div className="flex space-x-3">
            <div className="relative">
              <button
                onClick={() => setShowExportMenu(!showExportMenu)}
                disabled={tributes.length === 0 || isExporting}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed text-white px-6 py-2 rounded-xl transition-colors flex items-center"
              >
                {isExporting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Exporting...
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Export
                    <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </>
                )}
              </button>
              
              {showExportMenu && !isExporting && (
                <div className="absolute top-full left-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-slate-200 z-50">
                  <div className="p-4">
                    <h3 className="font-semibold text-slate-800 mb-3">Export Options</h3>
                    
                    <button
                      onClick={handleExportLinked}
                      className="w-full text-left p-3 hover:bg-slate-50 rounded-lg transition-colors border border-slate-200 mb-3"
                    >
                      <div className="font-medium text-slate-800">HTML with Linked Images</div>
                      <div className="text-sm text-slate-600 mt-1">
                        Fast download. Images remain on server. Requires internet to view images.
                      </div>
                    </button>
                    
                    <button
                      onClick={handleExportZipped}
                      className="w-full text-left p-3 hover:bg-slate-50 rounded-lg transition-colors border border-slate-200"
                    >
                      <div className="font-medium text-slate-800">ZIP with Downloaded Images</div>
                      <div className="text-sm text-slate-600 mt-1">
                        Slower download. Includes all images. Works offline. May take time to process.
                      </div>
                      <div className="text-xs text-orange-600 mt-1 font-medium">
                        ⚠️ Warning: Large download, may take several minutes
                      </div>
                    </button>
                  </div>
                </div>
              )}
              
              {/* Overlay to close menu when clicking outside */}
              {showExportMenu && !isExporting && (
                <div 
                  className="fixed inset-0 z-40" 
                  onClick={() => setShowExportMenu(false)}
                ></div>
              )}
            </div>
            
            <button
              onClick={handleLogout}
              className="bg-slate-600 hover:bg-slate-700 text-white px-6 py-2 rounded-xl transition-colors"
            >
              Logout
            </button>
          </div>
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

        {/* Filter Buttons and Page Size Selector */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-200 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <h3 className="text-lg font-semibold text-slate-700 mb-4">Filter Tributes</h3>
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => setFilter('all')}
                  className={`px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
                    filter === 'all'
                      ? 'bg-blue-600 text-white shadow-lg scale-105'
                      : 'bg-blue-50 text-blue-600 hover:bg-blue-100 border border-blue-200'
                  }`}
                >
                  All Tributes ({tributes.length})
                </button>
                <button
                  onClick={() => setFilter('pending')}
                  className={`px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
                    filter === 'pending'
                      ? 'bg-orange-600 text-white shadow-lg scale-105'
                      : 'bg-orange-50 text-orange-600 hover:bg-orange-100 border border-orange-200'
                  }`}
                >
                  Pending Review ({pendingTributes.length})
                </button>
                <button
                  onClick={() => setFilter('approved')}
                  className={`px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
                    filter === 'approved'
                      ? 'bg-green-600 text-white shadow-lg scale-105'
                      : 'bg-green-50 text-green-600 hover:bg-green-100 border border-green-200'
                  }`}
                >
                  Approved ({approvedTributes.length})
                </button>
              </div>
            </div>
            
            {/* Page Size Selector */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-3">
              <label className="text-sm font-medium text-slate-700 whitespace-nowrap">
                Tributes per page:
              </label>
              <select
                value={pageSize}
                onChange={(e) => handlePageSizeChange(Number(e.target.value))}
                className="px-4 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-slate-700 font-medium"
              >
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
            </div>
          </div>
        </div>

        {/* Pagination Info and Controls */}
        {filteredTributes.length > 0 && (
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-200 mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="text-slate-700">
                <span className="font-medium">
                  Showing {startIndex + 1}-{Math.min(endIndex, totalTributes)} of {totalTributes} tributes
                </span>
                {filter !== 'all' && (
                  <span className="text-slate-500 ml-2">
                    ({filter === 'pending' ? 'pending review' : 'approved'})
                  </span>
                )}
              </div>
              
              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-3 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Previous
                  </button>
                  
                  <div className="flex items-center space-x-1">
                    {/* Show page numbers */}
                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      let pageNumber;
                      if (totalPages <= 5) {
                        pageNumber = i + 1;
                      } else if (currentPage <= 3) {
                        pageNumber = i + 1;
                      } else if (currentPage >= totalPages - 2) {
                        pageNumber = totalPages - 4 + i;
                      } else {
                        pageNumber = currentPage - 2 + i;
                      }
                      
                      return (
                        <button
                          key={pageNumber}
                          onClick={() => handlePageChange(pageNumber)}
                          className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                            currentPage === pageNumber
                              ? 'bg-blue-600 text-white'
                              : 'text-slate-600 bg-white border border-slate-300 hover:bg-slate-50'
                          }`}
                        >
                          {pageNumber}
                        </button>
                      );
                    })}
                  </div>
                  
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-3 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Next
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Filtered Tributes Display */}
        {currentTributes.length > 0 ? (
          <div>
            <h2 className="text-2xl font-bold text-slate-800 mb-6">
              {filter === 'all' && `All Tributes (${filteredTributes.length})`}
              {filter === 'pending' && `Pending Review (${filteredTributes.length})`}
              {filter === 'approved' && `Approved Tributes (${filteredTributes.length})`}
            </h2>
            <div className="space-y-6">
              {currentTributes.map((tribute) => (
                <TributeCard
                  key={tribute.id}
                  tribute={tribute}
                  onApprove={!tribute.approved ? (id, notes) => handleTributeAction(id, true, notes) : undefined}
                  onReject={(id, notes) => handleTributeAction(id, false, notes)}
                  isProcessing={processingId === tribute.id}
                  isApproved={tribute.approved}
                />
              ))}
            </div>
            
            {/* Bottom Pagination Controls */}
            {totalPages > 1 && (
              <div className="mt-8 flex justify-center">
                <div className="bg-white rounded-2xl shadow-lg p-4 border border-slate-200">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      Previous
                    </button>
                    
                    <div className="flex items-center space-x-1">
                      {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        let pageNumber;
                        if (totalPages <= 5) {
                          pageNumber = i + 1;
                        } else if (currentPage <= 3) {
                          pageNumber = i + 1;
                        } else if (currentPage >= totalPages - 2) {
                          pageNumber = totalPages - 4 + i;
                        } else {
                          pageNumber = currentPage - 2 + i;
                        }
                        
                        return (
                          <button
                            key={pageNumber}
                            onClick={() => handlePageChange(pageNumber)}
                            className={`px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                              currentPage === pageNumber
                                ? 'bg-blue-600 text-white'
                                : 'text-slate-600 bg-white border border-slate-300 hover:bg-slate-50'
                            }`}
                          >
                            {pageNumber}
                          </button>
                        );
                      })}
                    </div>
                    
                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      Next
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="bg-white rounded-3xl shadow-lg p-12 border border-slate-200">
              <h3 className="text-2xl font-semibold text-slate-700 mb-4">
                {filter === 'all' && 'No tributes yet'}
                {filter === 'pending' && 'No pending tributes'}
                {filter === 'approved' && 'No approved tributes'}
              </h3>
              <p className="text-slate-600">
                {filter === 'all' && 'Tributes submitted by visitors will appear here for review.'}
                {filter === 'pending' && 'All tributes have been reviewed.'}
                {filter === 'approved' && 'No tributes have been approved yet.'}
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
            {/* 
              Responsive message truncation:
              - Mobile (< 768px): Shows 12 lines before truncating (more words visible)
              - Desktop (≥ 768px): Shows 6 lines before truncating (standard for wider screens)
              This ensures appropriate content visibility across different screen sizes
            */}
            <AdminTributeMessage 
              message={tribute.message}
              mobileMaxLines={12}    // More lines on mobile since each line has fewer words
              desktopMaxLines={6}    // Standard lines on desktop since each line has more words
            />
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
            <div className="mb-4">
              <div className="relative w-full flex justify-center items-center bg-slate-100 rounded-xl overflow-hidden shadow-md mb-3">
                <img
                  src={tribute.image_url}
                  alt="Tribute photo"
                  className="max-w-full max-h-[400px] h-auto object-contain"
                  loading="lazy"
                />
              </div>
              <a
                href={tribute.image_url}
                download={`tribute-${tribute.name.replace(/[^a-zA-Z0-9]/g, '-')}-${new Date(tribute.created_at).toISOString().split('T')[0]}.jpg`}
                className="inline-flex items-center justify-center w-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2 px-3 rounded-lg transition-colors"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Download Image
              </a>
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