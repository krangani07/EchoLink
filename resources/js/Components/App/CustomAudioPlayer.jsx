import { PauseCircleIcon, PlayCircleIcon } from "@heroicons/react/24/solid";
import React, { useRef, useState, useEffect } from "react";

const CustomAudioPlayer = ({ src, showVolume = true }) => {
    const audioRef = useRef();
    const [isPlaying, setIsPlaying] = useState(false);
    const [volume, setVolume] = useState(1);
    const [duration, setDuration] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);
    
    useEffect(() => {
        const audio = audioRef.current;
        if (audio) {
            audio.addEventListener('loadedmetadata', () => {
                if (!isNaN(audio.duration)) {
                    setDuration(audio.duration);
                }
            });
        }
        return () => {
            if (audio) {
                audio.removeEventListener('loadedmetadata', () => {});
            }
        };
    }, []);

    const togglePlayPause = () => {
        const audio = audioRef.current;
        if (isPlaying) {
            audio.pause();
        } else {
            audio.play();
        }
        setIsPlaying(!isPlaying);
    };

    const handleTimeUpdate = () => {
        const audio = audioRef.current;
        if (audio && !isNaN(audio.duration)) {
            setCurrentTime(audio.currentTime);
        }
    };

    return (
        <div className="w-full flex items-center gap-2 py-2 px-3 rounded-md bg-slate-800">
            <audio
                ref={audioRef}
                src={src.url}
                onTimeUpdate={handleTimeUpdate}
                className="hidden"
            />
            <button onClick={togglePlayPause}>
                {isPlaying && <PauseCircleIcon className="w-6 text-gray-400" />}
                {!isPlaying && <PlayCircleIcon className="w-6 text-gray-400" />}
            </button>
            {showVolume && (
                <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={volume}
                    onChange={(e) => {
                        const vol = e.target.value;
                        audioRef.current.volume = vol;
                        setVolume(vol);
                    }}
                />
            )}
            <input
                type="range"
                className="flex-1"
                min="0"
                max={duration || 0}
                step="0.01"
                value={currentTime}
                onChange={(e) => {
                    const time = e.target.value;
                    audioRef.current.currentTime = time;
                    setCurrentTime(time);
                }}
            />
        </div>
    );
};

export default CustomAudioPlayer;