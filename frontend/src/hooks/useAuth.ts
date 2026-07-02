import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../redux/store';
import { loginUser, registerUser, logout } from '../redux/authSlice';

export const useAuth = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { user, token, loading, error, isAuthenticated } = useSelector(
    (state: RootState) => state.auth
  );

  return {
    user,
    token,
    loading,
    error,
    isAuthenticated,
    login: (email: string, password: string) =>
      dispatch(loginUser({ email, password })),
    register: (name: string, email: string, password: string) =>
      dispatch(registerUser({ name, email, password })),
    logout: () => dispatch(logout()),
  };
};
