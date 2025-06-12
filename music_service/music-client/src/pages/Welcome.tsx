import { useNavigate } from 'react-router-dom';
import styles from './Welcome.module.css';

export default function Welcome() {
    const navigate = useNavigate();

    return (
        <div className={styles.welcomeContainer}>
            <h1>Welcome to Music Service</h1>
            <div className={styles.buttonContainer}>
                <button 
                    className={styles.authButton}
                    onClick={() => navigate('/register')}
                >
                    Register
                </button>
                <button 
                    className={styles.authButton}
                    onClick={() => navigate('/login')}
                >
                    Login
                </button>
            </div>
        </div>
    );
} 