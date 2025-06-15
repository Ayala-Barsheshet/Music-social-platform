import { useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { useUser } from './UserProvider';

export const UserGuard = ({ children }) => {
  const { user } = useUser();
  const navigate = useNavigate();
  const { userId } = useParams();
  const location = useLocation();

  useEffect(() => {
     const currentUserId = user.id;

    if (parseInt(userId) !== currentUserId) {
      const newPath = location.pathname.replace(`/users/${userId}`, `/users/${currentUserId}`);
      if (newPath !== location.pathname) {
        navigate(newPath, { replace: true });
      }
    }
  }, [user, userId, navigate, location.pathname]);

  return <>{children}</>;
};
