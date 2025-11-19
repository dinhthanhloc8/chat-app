import { IconButton } from '@mui/material';
import WavesurferPlayer from '@wavesurfer/react';
import React, { useState } from 'react';
import PauseCircleIcon from '@mui/icons-material/PauseCircle';
import PlayCircleIcon from '@mui/icons-material/PlayCircle';

export default function AudioCard({ data, waveWidth, isYour }) {
    const [wavesurfer, setWavesurfer] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);
    return (
        <div
            id={`message_${data.id}`}
            className={`flex overflow-hidden p-[10px] text-white break-word 
            rounded-[16px]
            ${isYour ? ' bg-[var(--primary)]' : 'bg-[var(--white-2)]'} 
            `}
        >
            <IconButton
                onClick={(e) => {
                    if (!isPlaying) wavesurfer.play();
                    else wavesurfer.pause();
                }}
                className="!w-[40px] !h-[40px] mr-[20px]"
            >
                {!isPlaying && (
                    <PlayCircleIcon
                        className={`${
                            isYour
                                ? 'text-[var(--white)]'
                                : 'text-[var(--black)]'
                        } !text-[2rem]`}
                    />
                )}
                {isPlaying && (
                    <PauseCircleIcon
                        className={`text-[${
                            isYour ? 'var(--white)' : 'var(--black)'
                        }] !text-[2rem]`}
                    />
                )}
            </IconButton>

            <WavesurferPlayer
                width={200}
                height={46}
                normalize
                waveColor={isYour ? '#54779c    ' : '#adadad'}
                barWidth={4}
                barRadius={6}
                cursorWidth={4}
                barGap={3}
                dragToSeek={true}
                url={data.file.url}
                progressColor={isYour ? '#e8e8e8' : '#404040'}
                onReady={(ws) => {
                    setWavesurfer(ws);
                }}
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
            />
        </div>
    );
}
