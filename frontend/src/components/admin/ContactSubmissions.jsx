import React, { useState, useEffect } from 'react';
import { Mail, Phone, MessageCircle, Clock, Star, Heart, Briefcase, HelpCircle, Compass } from 'lucide-react';
import { contactAPI } from '../../lib/api';

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
      setSubmissions(response.data.data.submissions);
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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Contact Submissions</h2>
        <p className="text-gray-600 mt-1">Messages from visitors and potential clients</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <MessageCircle className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Total Messages</p>
              <p className="text-2xl font-bold text-gray-900">{submissions.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <Mail className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Email Contact</p>
              <p className="text-2xl font-bold text-gray-900">
                {submissions.filter(s => s.preferred_contact === 'email').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Clock className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">This Week</p>
              <p className="text-2xl font-bold text-gray-900">
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

      {/* Filter Tabs */}
      <div className="bg-white rounded-lg shadow">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6" aria-label="Tabs">
            <button
              onClick={() => setFilter('all')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                filter === 'all'
                  ? 'border-purple-500 text-purple-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              All ({submissions.length})
            </button>
            {Object.entries(reasonCounts).map(([reason, count]) => (
              <button
                key={reason}
                onClick={() => setFilter(reason)}
                className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                  filter === reason
                    ? 'border-purple-500 text-purple-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {getReasonIcon(reason)}
                <span>{reason.charAt(0).toUpperCase() + reason.slice(1)} ({count})</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Submissions List */}
        <div className="divide-y divide-gray-200">
          {filteredSubmissions.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <MessageCircle className="w-12 h-12 mx-auto text-gray-300 mb-4" />
              <p>No contact submissions found</p>
            </div>
          ) : (
            filteredSubmissions.map((submission) => (
              <div key={submission.id} className="p-6 hover:bg-gray-50">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <div className="flex items-center space-x-2 text-sm text-gray-500">
                        {getReasonIcon(submission.reason)}
                        <span className="font-medium capitalize">{submission.reason}</span>
                      </div>
                      <span className="text-sm text-gray-500">
                        {formatDate(submission.created_at)}
                      </span>
                    </div>
                    
                    <div className="mb-3">
                      <h4 className="font-medium text-gray-900">{submission.name}</h4>
                      <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                        <div className="flex items-center space-x-1">
                          <Mail className="w-4 h-4" />
                          <span>{submission.email}</span>
                        </div>
                        {submission.phone && (
                          <div className="flex items-center space-x-1">
                            <Phone className="w-4 h-4" />
                            <span>{submission.phone}</span>
                          </div>
                        )}
                        <div className="flex items-center space-x-1">
                          <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">
                            {submission.preferred_contact}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="text-gray-700 whitespace-pre-wrap">{submission.message}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ContactSubmissions;
