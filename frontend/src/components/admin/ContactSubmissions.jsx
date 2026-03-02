import React, { useState, useEffect } from 'react';
import { Mail, Phone, MessageCircle, Clock, Star, Heart, Briefcase, HelpCircle, Compass } from 'lucide-react';
import { contactAPI } from '../../services/api';

const ContactSubmissions = () => {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const fetchSubmissions = async () => {
    try {
      const response = await contactAPI.getSubmissions();
      setSubmissions(response.data.data?.submissions || []);
    } catch (error) {
      console.error('Error fetching submissions:', error);
    } finally {
      setLoading(false);
    }
  };

  const getReasonIcon = (reason) => {
    const icons = {
      'general': <MessageCircle className="w-4 h-4" />,
      'reading': <Star className="w-4 h-4" />,
      'appointment': <Clock className="w-4 h-4" />,
      'feedback': <Heart className="w-4 h-4" />,
      'partnership': <Briefcase className="w-4 h-4" />,
      'technical': <HelpCircle className="w-4 h-4" />,
      'custom': <Compass className="w-4 h-4" />
    };
    return icons[reason] || <MessageCircle className="w-4 h-4" />;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const filteredSubmissions = submissions.filter(submission => {
    if (filter === 'all') return true;
    return submission.reason === filter;
  });

  const reasonCounts = submissions.reduce((acc, submission) => {
    acc[submission.reason] = (acc[submission.reason] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-white">Contact Submissions</h2>
        <p className="text-purple-200 mt-1 text-sm">
          Messages from visitors and potential clients. New messages appear here instantly after they submit the contact form.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white/10 rounded-xl p-6 border border-purple-400/40">
          <div className="flex items-center">
            <div className="p-2 bg-purple-600/40 rounded-lg">
              <MessageCircle className="w-6 h-6 text-purple-200" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-purple-200/80">Total Messages</p>
              <p className="text-2xl font-bold text-white">{submissions.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white/10 rounded-xl p-6 border border-emerald-400/40">
          <div className="flex items-center">
            <div className="p-2 bg-emerald-600/40 rounded-lg">
              <Mail className="w-6 h-6 text-emerald-100" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-emerald-100/80">Email Contact</p>
              <p className="text-2xl font-bold text-white">
                {submissions.filter(s => s.preferred_contact === 'email').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white/10 rounded-xl p-6 border border-blue-400/40">
          <div className="flex items-center">
            <div className="p-2 bg-blue-600/40 rounded-lg">
              <Clock className="w-6 h-6 text-blue-100" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-blue-100/80">This Week</p>
              <p className="text-2xl font-bold text-white">
                {submissions.filter(s => {
                  const submissionDate = new Date(s.created_at);
                  const weekAgo = new Date();
                  weekAgo.setDate(weekAgo.getDate() - 7);
                  return submissionDate > weekAgo;
                }).length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Tabs + List */}
      <div className="bg-white/5 rounded-2xl border border-white/10 overflow-hidden">
        <div className="border-b border-white/10">
          <nav className="flex space-x-4 px-4 sm:px-6" aria-label="Tabs">
            <button
              onClick={() => setFilter('all')}
              className={`py-3 px-1 border-b-2 font-medium text-xs sm:text-sm ${
                filter === 'all'
                  ? 'border-gold text-gold'
                  : 'border-transparent text-purple-100/70 hover:text-white hover:border-white/30'
              }`}
            >
              All ({submissions.length})
            </button>
            {Object.entries(reasonCounts).map(([reason, count]) => (
              <button
                key={reason}
                onClick={() => setFilter(reason)}
                className={`py-3 px-1 border-b-2 font-medium text-xs sm:text-sm flex items-center space-x-2 ${
                  filter === reason
                    ? 'border-gold text-gold'
                    : 'border-transparent text-purple-100/70 hover:text-white hover:border-white/30'
                }`}
              >
                {getReasonIcon(reason)}
                <span>{reason.charAt(0).toUpperCase() + reason.slice(1)} ({count})</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Submissions List */}
        {loading ? (
          <div className="p-8 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gold"></div>
          </div>
        ) : (
          <div className="divide-y divide-white/5">
            {filteredSubmissions.length === 0 ? (
              <div className="p-8 text-center text-purple-200">
                <MessageCircle className="w-12 h-12 mx-auto text-purple-300 mb-4" />
                <p className="font-medium">No contact submissions yet</p>
                <p className="text-sm text-purple-200/80 mt-1">
                  When someone submits the contact form on your site, their message will appear here instantly.
                </p>
              </div>
            ) : (
              filteredSubmissions.map((submission) => (
                <div key={submission.id || submission.created_at} className="p-4 sm:p-6 hover:bg-white/5 transition-colors">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-3 mb-2">
                        <div className="flex items-center gap-2 text-xs sm:text-sm text-purple-200">
                          {getReasonIcon(submission.reason)}
                          <span className="font-medium capitalize">{submission.reason}</span>
                        </div>
                        <span className="text-xs sm:text-sm text-purple-200/80">
                          {submission.created_at ? formatDate(submission.created_at) : 'Just now'}
                        </span>
                      </div>
                      
                      <div className="mb-3">
                        <h4 className="font-semibold text-white text-sm sm:text-base">{submission.name}</h4>
                        <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm text-purple-100 mt-1">
                          <div className="flex items-center gap-1">
                            <Mail className="w-4 h-4" />
                            <span>{submission.email}</span>
                          </div>
                          {submission.phone && (
                            <div className="flex items-center gap-1">
                              <Phone className="w-4 h-4" />
                              <span>{submission.phone}</span>
                            </div>
                          )}
                          <div className="flex items-center gap-1">
                            <span className="text-[11px] bg-purple-600/40 text-purple-100 px-2 py-1 rounded-full">
                              {submission.preferred_contact}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-white/5 rounded-lg p-3 border border-white/5">
                        <p className="text-sm text-purple-50 whitespace-pre-wrap">{submission.message}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ContactSubmissions;
