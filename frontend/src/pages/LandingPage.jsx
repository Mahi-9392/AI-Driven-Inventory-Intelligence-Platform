import { Link } from 'react-router-dom';

const LandingPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-xl mx-auto text-center">
        {/* Logo and Brand Name */}
        <div className="mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-indigo-600 shadow-lg mb-6">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Inventory Intelligence
          </h1>
        </div>

        {/* Headline */}
        <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4 tracking-tight">
          AI-Powered Inventory Forecasting
        </h2>

        {/* Subheading */}
        <p className="text-lg text-gray-600 mb-10 max-w-md mx-auto leading-relaxed">
          Make data-driven inventory decisions with explainable AI insights and actionable recommendations.
        </p>

        {/* Primary CTA */}
        <div className="mb-6">
          <Link
            to="/signup"
            className="inline-flex items-center justify-center px-8 py-3.5 text-base font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-200 shadow-sm hover:shadow"
          >
            Get Started
          </Link>
        </div>

        {/* Secondary Link */}
        <div>
          <Link
            to="/login"
            className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors duration-200"
          >
            Already have an account? Sign in
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;

