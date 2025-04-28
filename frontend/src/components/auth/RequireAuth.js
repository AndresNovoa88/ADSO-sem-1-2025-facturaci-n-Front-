import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Loading from '../common/Loading';

const RequireAuth = ({ children, roles = [] }) => {
  const { user, isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!loading) {
      if (!isAuthenticated) {
        navigate('/auth/login', { state: { from: location }, replace: true });
      } else if (roles.length > 0 && !roles.includes(user.rol)) {
        navigate('/not-authorized', { replace: true });
      }
    }
  }, [isAuthenticated, loading, roles, user, navigate, location]);

  if (loading) return <Loading />;
  if (!isAuthenticated || (roles.length > 0 && !roles.includes(user.rol))) {
    return null;
  }

  return children;
};

export default RequireAuth;