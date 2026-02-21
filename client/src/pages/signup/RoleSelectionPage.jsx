import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { GraduationCap, Building2, Briefcase } from 'lucide-react';

const RoleSelectionPage = () => {
  const navigate = useNavigate();

  const roles = [
    {
      id: 'student',
      title: 'Student',
      icon: GraduationCap,
      description: 'Find jobs & track your applications',
      features: ['Browse opportunities', 'Track applications', 'Get placement insights'],
      color: 'blue',
      path: '/signup/student'
    },
    {
      id: 'college',
      title: 'College',
      icon: Building2,
      description: 'Manage your placement process',
      features: ['Coordinate recruiters', 'Track placements', 'Generate reports'],
      color: 'purple',
      path: '/signup/college'
    },
    {
      id: 'recruiter',
      title: 'Recruiter',
      icon: Briefcase,
      description: 'Hire top talent from campuses',
      features: ['Access student pools', 'Schedule drives', 'Analytics dashboard'],
      color: 'green',
      path: '/signup/recruiter'
    }
  ];

  const getColorClasses = (color, type) => {
    const colors = {
      blue: {
        bg: 'bg-blue-50',
        border: 'border-blue-200',
        hover: 'hover:border-blue-500',
        icon: 'text-blue-600',
        button: 'bg-blue-600 hover:bg-blue-700'
      },
      purple: {
        bg: 'bg-purple-50',
        border: 'border-purple-200',
        hover: 'hover:border-purple-500',
        icon: 'text-purple-600',
        button: 'bg-purple-600 hover:bg-purple-700'
      },
      green: {
        bg: 'bg-green-50',
        border: 'border-green-200',
        hover: 'hover:border-green-500',
        icon: 'text-green-600',
        button: 'bg-green-600 hover:bg-green-700'
      }
    };
    return colors[color][type];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-3">
            Welcome to Placement Intelligence
          </h1>
          <p className="text-xl text-gray-600">
            Choose your account type to get started
          </p>
        </div>

        {/* Role Cards */}
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          {roles.map((role) => {
            const Icon = role.icon;
            return (
              <div
                key={role.id}
                className={`
                  relative bg-white rounded-2xl border-2 
                  ${getColorClasses(role.color, 'border')}
                  ${getColorClasses(role.color, 'hover')}
                  shadow-lg hover:shadow-xl transition-all duration-300 
                  p-8 cursor-pointer group
                `}
                onClick={() => navigate(role.path)}
              >
                {/* Icon */}
                <div className={`
                  w-16 h-16 rounded-xl ${getColorClasses(role.color, 'bg')} 
                  flex items-center justify-center mb-6
                  group-hover:scale-110 transition-transform duration-300
                `}>
                  <Icon className={`w-8 h-8 ${getColorClasses(role.color, 'icon')}`} />
                </div>

                {/* Title & Description */}
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  {role.title}
                </h3>
                <p className="text-gray-600 mb-6">
                  {role.description}
                </p>

                {/* Features */}
                <ul className="space-y-3 mb-8">
                  {role.features.map((feature, index) => (
                    <li key={index} className="flex items-center text-sm text-gray-700">
                      <svg className="w-5 h-5 text-green-500 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>

                {/* Button */}
                <button
                  className={`
                    w-full py-3 px-6 rounded-lg text-white font-semibold
                    ${getColorClasses(role.color, 'button')}
                    transition-colors duration-200
                  `}
                >
                  Sign Up as {role.title}
                </button>
              </div>
            );
          })}
        </div>

        {/* Login Link */}
        <div className="text-center">
          <p className="text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="text-blue-600 hover:text-blue-700 font-semibold">
              Log In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RoleSelectionPage;
