import React, { useState } from 'react';
import { IoCloudUploadOutline, IoClose, IoMusicalNotes, IoImage } from 'react-icons/io5';
import styles from './UploadModal.module.css';
import { useAuthStore } from '../../store/useAuthStore';
import apiClient from '../../api/client';
import { Icon } from '../Icon/Icon';

interface UploadModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess?: () => void;
}

export const UploadModal: React.FC<UploadModalProps> = ({ isOpen, onClose, onSuccess }) => {
    const [file, setFile] = useState<File | null>(null);
    const [coverImage, setCoverImage] = useState<File | null>(null);
    const [title, setTitle] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const { user } = useAuthStore();

    const handleUpload = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!file || !user) return;

        setError(null);
        setIsLoading(true);

        try {
            const formData = new FormData();
            formData.append('audio', file);
            formData.append('title', title || file.name.replace(/\.[^/.]+$/, ""));
            if (coverImage) {
                formData.append('cover', coverImage);
            }
            
            const response = await apiClient.post('/tracks/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            });

            if (response.data) {
                onSuccess?.();
                handleClose();
            }
        } catch (err: any) {
            console.error('Upload error:', err);
            setError(err.response?.data?.message || 'Не удалось загрузить трек. Пожалуйста, попробуйте снова.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleClose = () => {
        setFile(null);
        setCoverImage(null);
        setTitle('');
        setError(null);
        setIsLoading(false);
        onClose();
    };

    const validateAudioFile = (file: File): boolean => {
        const validTypes = ['audio/mpeg', 'audio/wav', 'audio/flac'];
        if (!validTypes.includes(file.type)) {
            setError('Пожалуйста, выберите аудиофайл в формате MP3, WAV или FLAC');
            return false;
        }
        if (file.size > 100 * 1024 * 1024) {
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
        if (file.size > 5 * 1024 * 1024) {
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
            const fileName = selectedFile.name.replace(/\.[^/.]+$/, "");
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

    if (!isOpen) return null;

    return (
        <div className={styles.modalOverlay} onClick={handleClose}>
            <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
                <button className={styles.closeButton} onClick={handleClose}>
                    <Icon icon={IoClose} size={24} />
                </button>

                <div className={styles.modalHeader}>
                    <Icon icon={IoCloudUploadOutline} size={32} className={styles.uploadIcon} />
                    <h2>Загрузка трека</h2>
                </div>

                {error && <div className={styles.error}>{error}</div>}

                <form onSubmit={handleUpload} className={styles.uploadForm}>
                    <div className={styles.formGroup}>
                        <input
                            type="text"
                            placeholder="Название трека"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                            disabled={isLoading}
                            className={styles.titleInput}
                        />
                    </div>

                    <div className={styles.fileInputs}>
                        <div className={styles.fileInput}>
                            <input
                                type="file"
                                accept=".mp3,.wav,.flac"
                                onChange={handleAudioChange}
                                required
                                disabled={isLoading}
                                id="audioFile"
                                className={styles.hiddenInput}
                            />
                            <label htmlFor="audioFile" className={styles.fileLabel}>
                                <Icon icon={IoMusicalNotes} size={20} />
                                <span>{file ? 'Изменить аудиофайл' : 'Выбрать аудиофайл'}</span>
                            </label>
                            {file && <div className={styles.fileName}>{file.name}</div>}
                        </div>

                        <div className={styles.fileInput}>
                            <input
                                type="file"
                                accept=".jpg,.jpeg,.png,.webp"
                                onChange={handleCoverChange}
                                disabled={isLoading}
                                id="coverImage"
                                className={styles.hiddenInput}
                            />
                            <label htmlFor="coverImage" className={styles.fileLabel}>
                                <Icon icon={IoImage} size={20} />
                                <span>{coverImage ? 'Изменить обложку' : 'Добавить обложку'}</span>
                            </label>
                            {coverImage && <div className={styles.fileName}>{coverImage.name}</div>}
                        </div>
                    </div>

                    <button 
                        type="submit" 
                        className={styles.uploadButton}
                        disabled={isLoading || !file}
                    >
                        {isLoading ? "Загрузка..." : "Загрузить трек"}
                    </button>
                </form>
            </div>
        </div>
    );
}; 