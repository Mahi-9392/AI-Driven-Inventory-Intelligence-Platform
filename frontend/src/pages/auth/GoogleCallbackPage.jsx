import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const GoogleCallbackPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { handleGoogleCallback } = useAuth();

  useEffect(() => {
    const token = searchParams.get('token');
    const email = searchParams.get('email');
    const name = searchParams.get('name');
    const id = searchParams.get('id');

    if (token && email && name) {
      const result = handleGoogleCallback(token, email, name, id);
      if (result.success) {
        navigate('/dashboard', { replace: true });
      } else {
        navigate('/login?error=' + encodeURIComponent(result.message || 'Authentication failed'), { replace: true });
      }
    } else {
      navigate('/login?error=' + encodeURIComponent('Missing authentication data'), { replace: true });
    }
  }, [searchParams, navigate, handleGoogleCallback]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-indigo-50/30">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-indigo-600 shadow-lg mb-4">
          <svg className="animate-spin w-8 h-8 text-white" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Completing sign-in...</h2>
        <p className="text-sm text-gray-600">Please wait while we finish setting up your account.</p>
      </div>
    </div>
  );
};

export default GoogleCallbackPage;

