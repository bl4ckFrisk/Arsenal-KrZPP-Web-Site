import React, { useEffect, useRef } from 'react';
import { usePlayerStore } from '../../store/usePlayerStore';
import styles from './BackgroundVisualizer.module.css';

interface BackgroundVisualizerProps {
    audioRef: React.RefObject<HTMLAudioElement | null>;
}

export const BackgroundVisualizer = ({ audioRef }: BackgroundVisualizerProps) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const animationFrameRef = useRef<number | undefined>(undefined);
    const { isPlaying } = usePlayerStore();

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Set canvas size
        const updateCanvasSize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        updateCanvasSize();
        window.addEventListener('resize', updateCanvasSize);

        // Animation variables
        let time = 0;
        const particles: { x: number; y: number; size: number; speed: number; color: string }[] = [];
        const particleCount = 100;

        // Color palette
        const colors = ['#6D726D', '#676D67', '#5B6A5B'];

        // Initialize particles
        for (let i = 0; i < particleCount; i++) {
            particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                size: Math.random() * 3 + 1,
                speed: Math.random() * 3 + 1,
                color: colors[Math.floor(Math.random() * colors.length)]
            });
        }

        const draw = () => {
            if (!ctx || !canvas) return;

            // Clear canvas with semi-transparent black
            const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
            gradient.addColorStop(0, 'rgba(0, 0, 0, 0.2)');
            gradient.addColorStop(1, 'rgba(0, 27, 58, 0.1)');
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Update time
            time += 0.02;

            // Draw grid pattern
            const gridSize = Math.random() * 10 + 10;
            const amplitude = Math.random() * 10 + 10;

            // Draw vertical lines with glow effect
            ctx.shadowBlur = 15;
            ctx.shadowColor = '#1db954';
            for (let x = 0; x < canvas.width; x += gridSize) {
                ctx.beginPath();
                ctx.strokeStyle = 'rgba(29, 58, 185, 0.1)';
                ctx.lineWidth = 1;
                ctx.moveTo(x, 0);
                for (let y = 0; y < canvas.height; y += 5) {
                    const offset = Math.sin(y * 0.01 + time + x * 0.01) * amplitude;
                    ctx.lineTo(x + offset, y);
                }
                ctx.stroke();
            }

            // Reset shadow for particles
            ctx.shadowBlur = 0;

            // Update and draw particles
            particles.forEach(particle => {
                particle.y -= particle.speed;
                if (particle.y < -10) {
                    particle.y = canvas.height + 10;
                    particle.x = Math.random() * canvas.width;
                }

                ctx.fillStyle = particle.color;
                ctx.globalAlpha = 0.3;
                ctx.beginPath();
                ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
                ctx.fill();
            });

            ctx.globalAlpha = 1;

            // Request next frame if playing
            if (isPlaying) {
                animationFrameRef.current = requestAnimationFrame(draw);
            }
        };

        if (isPlaying) {
            draw();
        }

        return () => {
            window.removeEventListener('resize', updateCanvasSize);
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
        };
    }, [isPlaying]);

    return <canvas ref={canvasRef} className={styles.visualizer} />;
}; 