import React, { useState, useEffect } from 'react';

interface AnalyticsData {
  totalContacts: number;
  totalServices: { [key: string]: number };
  monthlyData: { month: string; contacts: number }[];
  serviceDistribution: { name: string; value: number }[];
  recentContacts: Array<{
    id: string;
    name: string;
    email: string;
    service: string;
    date: string;
    status: string;
  }>;
}

export function Analytics() {
  const [data, setData] = useState<AnalyticsData>({
    totalContacts: 0,
    totalServices: {},
    monthlyData: [],
    serviceDistribution: [],
    recentContacts: []
  });
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('30days');

  useEffect(() => {
    // Mock data for demonstration
    const mockData: AnalyticsData = {
      totalContacts: 156,
      totalServices: {
        'Love Tarot Reading': 45,
        'Career Guidance': 38,
        'Yes/No Reading': 29,
        'Life Path Reading': 22,
        'Custom Question': 15,
        'Remedy for Healing': 7
      },
      monthlyData: [
        { month: 'Jan', contacts: 12 },
        { month: 'Feb', contacts: 18 },
        { month: 'Mar', contacts: 25 },
        { month: 'Apr', contacts: 31 },
        { month: 'May', contacts: 28 },
        { month: 'Jun', contacts: 42 }
      ],
      serviceDistribution: [
        { name: 'Love Reading', value: 45 },
        { name: 'Career', value: 38 },
        { name: 'Yes/No', value: 29 },
        { name: 'Life Path', value: 22 },
        { name: 'Custom', value: 15 },
        { name: 'Healing', value: 7 }
      ],
      recentContacts: [
        { id: '1', name: 'Priya Sharma', email: 'priya@example.com', service: 'Love Tarot Reading', date: '2024-06-15', status: 'completed' },
        { id: '2', name: 'Ayush Mourya', email: 'ayush@example.com', service: 'Career Guidance', date: '2024-06-14', status: 'pending' },
        { id: '3', name: 'Mamta Tamang', email: 'mamta@example.com', service: 'Yes/No Reading', date: '2024-06-13', status: 'completed' },
        { id: '4', name: 'Rohit Kumar', email: 'rohit@example.com', service: 'Life Path Reading', date: '2024-06-12', status: 'completed' },
        { id: '5', name: 'Anjali Singh', email: 'anjali@example.com', service: 'Custom Question', date: '2024-06-11', status: 'pending' }
      ]
    };

    setTimeout(() => {
      setData(mockData);
      setLoading(false);
    }, 1000);
  }, [timeRange]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gold"></div>
      </div>
    );
  }

  const maxValue = Math.max(...data.monthlyData.map(d => d.contacts));
  const maxServiceValue = Math.max(...Object.values(data.totalServices));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Analytics Dashboard</h2>
        <select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
          className="bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white"
        >
          <option value="7days">Last 7 Days</option>
          <option value="30days">Last 30 Days</option>
          <option value="90days">Last 90 Days</option>
        </select>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/60 text-sm">Total Contacts</p>
              <p className="text-2xl font-bold text-white">{data.totalContacts}</p>
            </div>
            <div className="w-12 h-12 bg-gold/20 rounded-lg flex items-center justify-center">
              <span className="text-gold font-bold">📊</span>
            </div>
          </div>
        </div>
        
        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/60 text-sm">Avg. Daily</p>
              <p className="text-2xl font-bold text-white">{Math.round(data.totalContacts / 30)}</p>
            </div>
            <div className="w-12 h-12 bg-gold/20 rounded-lg flex items-center justify-center">
              <span className="text-gold font-bold">📈</span>
            </div>
          </div>
        </div>

        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/60 text-sm">Most Popular</p>
              <p className="text-lg font-bold text-white">Love Reading</p>
            </div>
            <div className="w-12 h-12 bg-gold/20 rounded-lg flex items-center justify-center">
              <span className="text-gold font-bold">❤️</span>
            </div>
          </div>
        </div>

        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/60 text-sm">Conversion</p>
              <p className="text-2xl font-bold text-white">68%</p>
            </div>
            <div className="w-12 h-12 bg-gold/20 rounded-lg flex items-center justify-center">
              <span className="text-gold font-bold">🎯</span>
            </div>
          </div>
        </div>
      </div>

      {/* Monthly Trend - Simple Bar Chart */}
      <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Monthly Trend</h3>
        <div className="space-y-2">
          {data.monthlyData.map((item, index) => (
            <div key={index} className="flex items-center gap-4">
              <div className="w-16 text-white/80 text-sm">{item.month}</div>
              <div className="flex-1 bg-white/10 rounded-full h-6 relative overflow-hidden">
                <div 
                  className="absolute left-0 top-0 h-full bg-gold transition-all duration-500"
                  style={{ width: `${(item.contacts / maxValue) * 100}%` }}
                />
              </div>
              <div className="w-12 text-white text-sm text-right">{item.contacts}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Service Performance */}
      <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Service Performance</h3>
        <div className="space-y-3">
          {Object.entries(data.totalServices).map(([name, value]) => (
            <div key={name} className="flex items-center gap-4">
              <div className="w-32 text-white/80 text-sm truncate">{name}</div>
              <div className="flex-1 bg-white/10 rounded-full h-6 relative overflow-hidden">
                <div 
                  className="absolute left-0 top-0 h-full bg-gold transition-all duration-500"
                  style={{ width: `${(value / maxServiceValue) * 100}%` }}
                />
              </div>
              <div className="w-12 text-white text-sm text-right">{value}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Contacts */}
      <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Recent Contacts</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-white">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left py-2 px-4">Name</th>
                <th className="text-left py-2 px-4">Service</th>
                <th className="text-left py-2 px-4">Date</th>
                <th className="text-left py-2 px-4">Status</th>
              </tr>
            </thead>
            <tbody>
              {data.recentContacts.map((contact) => (
                <tr key={contact.id} className="border-b border-white/5">
                  <td className="py-2 px-4">{contact.name}</td>
                  <td className="py-2 px-4">{contact.service}</td>
                  <td className="py-2 px-4">{contact.date}</td>
                  <td className="py-2 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      contact.status === 'completed' 
                        ? 'bg-green-500/20 text-green-400' 
                        : 'bg-yellow-500/20 text-yellow-400'
                    }`}>
                      {contact.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
