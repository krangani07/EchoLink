import { PauseCircleIcon, PlayCircleIcon } from "@heroicons/react/24/solid";
import React, { useRef, useState } from "react";

const CustomAudioPlayer = ({ file, showVolume = true }) => {
    const audioRef = useRef();
    const [isPlaying, setIsPlaying] = useState(false);
    const [volume, setVolume] = useState(1);
    const [duration, setDuration] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);
 
    const togglePlayPause = () => {
        const audio = audioRef.current;
        if (isPlaying) {
            audio.pause();
        } else {
            audio.play();
            setDuration(audio.duration); 
        }
        setIsPlaying(!isPlaying);
        console.log("Audio source:", audioRef.current.src);
        console.log("Audio ready state:", audioRef.current.readyState);
        console.log("File prop:", file);
        console.log("Is playing:", isPlaying);
        console.log("Duration:", audio.duration);
    };

    const handleVolumeChange = (e) => {
        const vol = e.target.value;
        audioRef.current.volume = vol;
        setVolume(vol);
    };
    const handleTimeUpdate = (e) => {
        const audio = audioRef.current;
        setDuration(audio.duration);
        setCurrentTime(audio.currentTime);
    };
    const handleLoadedMetadata = (e) => {
            setDuration(e.target.duration)
    };
    const handleSeekChange = (e) => {
        const time = e.target.value;
        audioRef.current.currentTime = time;
        setCurrentTime(time);
    };

    return (
        <div className="w-full flex items-center gap-2 py-2 px-3 rounded-md bg-slate-800">
            <audio
                ref={audioRef}
                src={file.url}
                controls
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={handleLoadedMetadata}
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
                    onChange={handleVolumeChange}
                />
            )}
            <input
                type="range"
                className="flex-1"
                min="0"
                max={duration || 0}
                step="0.01"
                value={currentTime || 0}
                onChange={handleSeekChange}
            />
        </div>
    );
};

export default CustomAudioPlayer;