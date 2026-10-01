import { Link, useLocation, useNavigate } from 'react-router-dom';

import { useAuth } from '../contexts/AuthContext';

export default function Header() {
  const { user, logout } = useAuth();

  const location = useLocation();

  const navigate = useNavigate();

  function handleLogout() {
    logout();

    navigate('/login');
  }

  return (
    <header className="app-header">
      <div className="header-content">
        <Link to="/dashboard" className="brand">
          Portal de Solicitações
        </Link>

        <nav className="main-nav">
          <Link
            to="/dashboard"
            className={
              location.pathname === '/dashboard'
                ? 'nav-link active'
                : 'nav-link'
            }
          >
            Dashboard
          </Link>

          <Link
            to="/requests"
            className={
              location.pathname.startsWith('/requests')
                ? 'nav-link active'
                : 'nav-link'
            }
          >
            Solicitações
          </Link>
        </nav>

        <div className="header-user">
          <span>
            Olá, <strong>{user?.username || 'usuário'}</strong>
          </span>

          <button
            type="button"
            className="btn btn-secondary btn-small"
            onClick={handleLogout}
          >
            Sair
          </button>
        </div>
      </div>
    </header>
  );
}
