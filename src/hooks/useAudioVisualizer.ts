import { useRef, useEffect, useState, useCallback } from 'react';

interface AudioVisualizerOptions {
    fftSize?: number;
}

export const useAudioVisualizer = (src: string, { fftSize = 64 }: AudioVisualizerOptions = {}) => {
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const audioContextRef = useRef<AudioContext | null>(null);
    const analyserRef = useRef<AnalyserNode | null>(null);
    const sourceRef = useRef<MediaElementAudioSourceNode | null>(null);
    const rafIdRef = useRef<number | null>(null);

    const [isPlaying, setIsPlaying] = useState(false);
    const [volume, setVolumeState] = useState(70); // 0-100
    const [frequencyData, setFrequencyData] = useState<number[]>(new Array(fftSize / 2).fill(0));
    const [duration, setDuration] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);

    // Initialize Audio Context and Analyser
    const initializeAudio = useCallback(() => {
        if (!audioRef.current) return;

        if (!audioContextRef.current) {
            const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
            audioContextRef.current = new AudioContextClass();

            analyserRef.current = audioContextRef.current.createAnalyser();
            analyserRef.current.fftSize = fftSize;
            analyserRef.current.smoothingTimeConstant = 0.8;

            sourceRef.current = audioContextRef.current.createMediaElementSource(audioRef.current);
            sourceRef.current.connect(analyserRef.current);
            analyserRef.current.connect(audioContextRef.current.destination);
        }

        // Resume context if suspended (browser autoplay policy)
        if (audioContextRef.current.state === 'suspended') {
            audioContextRef.current.resume();
        }
    }, [fftSize]);

    // Animation Loop
    const tick = useCallback(() => {
        if (!analyserRef.current) return;

        const bufferLength = analyserRef.current.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);
        analyserRef.current.getByteFrequencyData(dataArray);

        // Normalize to 0-100 for easier consumption in UI
        const normalizedData = Array.from(dataArray).map(val => (val / 255) * 100);
        setFrequencyData(normalizedData);

        if (audioRef.current) {
            setCurrentTime(audioRef.current.currentTime);
        }

        rafIdRef.current = requestAnimationFrame(tick);
    }, []);

    useEffect(() => {
        if (isPlaying) {
            initializeAudio(); // Ensure context is ready
            audioRef.current?.play().catch(e => {
                console.error("Playback failed:", e);
                setIsPlaying(false);
            });
            rafIdRef.current = requestAnimationFrame(tick);
        } else {
            audioRef.current?.pause();
            if (rafIdRef.current) {
                cancelAnimationFrame(rafIdRef.current);
            }
        }

        return () => {
            if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
        };
    }, [isPlaying, tick, initializeAudio]);

    // Handle initial loading & source changes
    useEffect(() => {
        setIsPlaying(false);
        if (audioRef.current) {
            audioRef.current.src = src;
            audioRef.current.load();
        }
    }, [src]);

    // Volume Control
    const setVolume = (val: number) => {
        setVolumeState(val);
        if (audioRef.current) {
            audioRef.current.volume = val / 100;
        }
    };

    // Seek Control
    const seek = (time: number) => {
        if (audioRef.current) {
            audioRef.current.currentTime = time;
            setCurrentTime(time);
        }
    };

    const togglePlay = () => setIsPlaying(prev => !prev);

    // Metadata handlers
    const onLoadedMetadata = () => {
        if (audioRef.current) {
            setDuration(audioRef.current.duration);
        }
    };

    const onEnded = () => setIsPlaying(false);

    return {
        audioRef,
        isPlaying,
        togglePlay,
        volume,
        setVolume,
        frequencyData,
        currentTime,
        duration,
        seek,
        onLoadedMetadata,
        onEnded
    };
};
