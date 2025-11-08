import { Users, Calendar, FileText, DollarSign, TrendingUp, Activity } from 'lucide-react';

export function DashboardPage() {
  const stats = [
    {
      name: 'Total Patients',
      value: '0',
      change: '+0%',
      icon: Users,
      gradient: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-600',
    },
    {
      name: 'Today\'s Appointments',
      value: '0',
      change: '+0%',
      icon: Calendar,
      gradient: 'from-emerald-500 to-teal-600',
      bgColor: 'bg-emerald-50',
      iconColor: 'text-emerald-600',
    },
    {
      name: 'Medical Records',
      value: '0',
      change: '+0%',
      icon: FileText,
      gradient: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50',
      iconColor: 'text-purple-600',
    },
    {
      name: 'Revenue This Month',
      value: 'Rp 0',
      change: '+0%',
      icon: DollarSign,
      gradient: 'from-amber-500 to-orange-600',
      bgColor: 'bg-amber-50',
      iconColor: 'text-amber-600',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-900 to-amber-600 rounded-2xl shadow-lg p-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Welcome to Aghna Dental Care</h1>
            <p className="text-amber-100 text-lg">Your professional dental clinic management system</p>
          </div>
          <Activity className="h-16 w-16 text-amber-200 opacity-80" />
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.name}
              className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 p-6 border border-gray-100 hover:-translate-y-1"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`${stat.bgColor} rounded-lg p-3`}>
                  <Icon className={`h-6 w-6 ${stat.iconColor}`} />
                </div>
                <div className="flex items-center text-sm font-medium text-green-600">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  {stat.change}
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">{stat.name}</p>
                <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Recent Appointments</h2>
            <Calendar className="h-5 w-5 text-emerald-600" />
          </div>
          <div className="space-y-4">
            <div className="text-center py-12 text-gray-500">
              <Calendar className="h-12 w-12 mx-auto mb-3 text-gray-300" />
              <p className="font-medium">No recent appointments</p>
              <p className="text-sm text-gray-400 mt-1">Appointments will appear here</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Recent Patients</h2>
            <Users className="h-5 w-5 text-blue-600" />
          </div>
          <div className="space-y-4">
            <div className="text-center py-12 text-gray-500">
              <Users className="h-12 w-12 mx-auto mb-3 text-gray-300" />
              <p className="font-medium">No recent patients</p>
              <p className="text-sm text-gray-400 mt-1">New patients will appear here</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
