import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaHeadphones } from 'react-icons/fa';
import { Icon } from '../../components/Icon/Icon';
import './WelcomePage.css';

export const WelcomePage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="welcome-container">
      <div className="welcome-content">
        <div className="welcome-logo">
          <Icon icon={FaHeadphones} size={48} />
          <h1>October</h1>
        </div>
        <p>Откройте для себя новое звучание музыки</p>
        
        <div className="welcome-buttons">
          <button 
            className="welcome-button login-button"
            onClick={() => navigate('/login')}
          >
            Войти
          </button>
          <button 
            className="welcome-button register-button"
            onClick={() => navigate('/register')}
          >
            Зарегистрироваться
          </button>
        </div>
      </div>
    </div>
  );
}; 