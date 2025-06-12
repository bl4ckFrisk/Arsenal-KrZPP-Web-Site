import { useState } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import apiClient from '../api/client';
import { Link, useNavigate } from 'react-router-dom';
import styles from './TrackUpload.module.css';

export default function TrackUpload() {
    const [file, setFile] = useState<File | null>(null);
    const [coverImage, setCoverImage] = useState<File | null>(null);
    const [title, setTitle] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const { user } = useAuthStore();
    const navigate = useNavigate();

    const handleUpload = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!file || !user) return;

        setError(null);
        setIsLoading(true);

        try {
            const formData = new FormData();
            formData.append('audio', file);
            formData.append('title', title || 'Untitled Track');
            if (coverImage) {
                formData.append('cover', coverImage);
            }
            
            const response = await apiClient.post('/tracks/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            });

            if (response.data) {
                navigate('/home');
            }
        } catch (err: any) {
            console.error('Upload error:', err);
            setError(err.response?.data?.message || 'Не удалось загрузить трек. Пожалуйста, попробуйте снова.');
        } finally {
            setIsLoading(false);
        }
    }

    const validateAudioFile = (file: File): boolean => {
        const validTypes = ['audio/mpeg', 'audio/wav', 'audio/flac'];
        if (!validTypes.includes(file.type)) {
            setError('Пожалуйста, выберите аудиофайл в формате MP3, WAV или FLAC');
            return false;
        }
        if (file.size > 100 * 1024 * 1024) { // 100MB limit
            setError('Размер файла не должен превышать 100МБ');
            return false;
        }
        return true;
    };

    const validateImageFile = (file: File): boolean => {
        const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
        if (!validTypes.includes(file.type)) {
            setError('Пожалуйста, выберите изображение в формате JPEG, PNG или WEBP');
            return false;
        }
        if (file.size > 5 * 1024 * 1024) { // 5MB limit
            setError('Размер обложки не должен превышать 5МБ');
            return false;
        }
        return true;
    };

    const handleAudioChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile && validateAudioFile(selectedFile)) {
            setFile(selectedFile);
            setError(null);
            // Автоматически устанавливаем название из имени файла
            const fileName = selectedFile.name.replace(/\.[^/.]+$/, ""); // Убираем расширение
            setTitle(fileName);
        }
    };

    const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = e.target.files?.[0];
        if (selectedFile && validateImageFile(selectedFile)) {
            setCoverImage(selectedFile);
            setError(null);
        }
    };

    return (
        <div className={styles.uploadContainer}>
            <form onSubmit={handleUpload} className={styles.uploadForm}>
                <h2>Загрузка трека</h2>
                {error && <div className={styles.error}>{error}</div>}
                
                <div className={styles.formGroup}>
                    <input
                        type="text"
                        placeholder="Название трека"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                        disabled={isLoading}
                    />
                </div>

                <div className={styles.formGroup}>
                    <input
                        type="file"
                        accept=".mp3,.wav,.flac"
                        onChange={handleAudioChange}
                        required
                        disabled={isLoading}
                        className={styles.fileInput}
                        id="audioFile"
                    />
                    <label htmlFor="audioFile" className={styles.fileLabel}>
                        {file ? 'Изменить аудиофайл' : 'Выбрать аудиофайл (MP3, WAV, FLAC)'}
                    </label>
                    {file && <div className={styles.fileName}>{file.name}</div>}
                </div>

                <div className={styles.formGroup}>
                    <input
                        type="file"
                        accept=".jpg,.jpeg,.png,.webp"
                        onChange={handleCoverChange}
                        disabled={isLoading}
                        className={styles.fileInput}
                        id="coverImage"
                    />
                    <label htmlFor="coverImage" className={styles.fileLabel}>
                        {coverImage ? 'Изменить обложку' : 'Добавить обложку (опционально)'}
                    </label>
                    {coverImage && <div className={styles.fileName}>{coverImage.name}</div>}
                </div>

                <button 
                    type="submit" 
                    className={styles.uploadButton}
                    disabled={isLoading || !file}
                >
                    {isLoading ? "Загрузка..." : "Загрузить трек"}
                </button>

                <Link to="/home" className={styles.backLink}>
                    Вернуться на главную
                </Link>
            </form>
        </div>
    );
}