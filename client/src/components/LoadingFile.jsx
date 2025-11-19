import { CircularProgress } from '@mui/material';
import React from 'react';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import { tranferFileSize } from '../utils/tranferFileSize';

function LoadingFile({ data }) {
    return (
        <div className="flex justify-end mt-1">
            {data.type === 'image' && (
                <div className="relative max-w-[50%] rounded-xl overflow-hidden border-[2px] border-[var(--primary)]">
                    <img src={data.url} className="w-auto max-h-[200px]" />
                    <div className="absolute flex items-center justify-center z-[999] bg-[#191818d8] top-0 right-0 bottom-0 left-0">
                        <CircularProgress color="primary" />
                    </div>
                </div>
            )}

            {['audio', 'voice'].includes(data.type) && (
                <div className="flex items-center bg-[var(--primary-2)] rounded-[20px_20px_0_20px] p-[10px_16px]">
                    <CircularProgress size="1.4rem" color="white" />
                    <img
                        className="h-[60px] ml-[10px] mr-[-8px]"
                        src="/audio_loading.png"
                    />
                    <img
                        className="h-[60px] mr-[-8px]"
                        src="/audio_loading.png"
                    />
                    <img className="h-[60px]" src="/audio_loading.png" />
                </div>
            )}

            {!['image', 'voice', 'audio'].includes(data.type) && (
                <div className="flex items-center max-w-[50%] p-[4px_10px]  text-white break-word rounded-[20px_20px_0_20px] bg-[var(--primary-2)] ml-1">
                    <div className="relative w-[60px]">
                        <InsertDriveFileIcon className="!text-[var(--white-2)] !text-[4rem]" />
                        <div className="absolute top-[50%] right-[50%] translate-x-[50%] text-[0.8rem]">
                            <CircularProgress size="1.4rem" color="secondary" />
                        </div>
                    </div>

                    <div>
                        <p className="text-[1rem] text-[var(--white-2)] max-w-[100px]  lg:max-w-[200px] xl:max-w-[300px] truncate">
                            {data.name}
                        </p>
                        <p className="text-[var(--white-2)] text-[0.8rem]">
                            {tranferFileSize(data.size)}
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}

export default LoadingFile;
