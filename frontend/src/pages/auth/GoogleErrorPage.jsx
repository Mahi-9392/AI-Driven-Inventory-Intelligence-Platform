import { useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';

const GoogleErrorPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const error = searchParams.get('error') || 'An error occurred during Google authentication';

  useEffect(() => {
    // Auto-redirect to login after 5 seconds
    const timer = setTimeout(() => {
      navigate('/login?error=' + encodeURIComponent(error), { replace: true });
    }, 5000);

    return () => clearTimeout(timer);
  }, [navigate, error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-indigo-50/30 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <div className="card">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 mb-4">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="heading-2 mb-2">Authentication Error</h2>
            <p className="body-text mb-6">{error}</p>
            <div className="space-y-3">
              <Link to="/login" className="btn-primary w-full inline-block text-center">
                Return to Login
              </Link>
              <p className="text-xs text-gray-500">
                Redirecting automatically in 5 seconds...
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GoogleErrorPage;

