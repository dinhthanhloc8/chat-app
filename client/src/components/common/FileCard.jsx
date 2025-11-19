import React from 'react';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import { tranferFileSize } from '../../utils/tranferFileSize';

export default function FileCard({ data, isYour }) {
    return (
        <a
            href={data.file.downloadUrl}
            className={`flex items-center p-[4px]  text-white break-word rounded-[12px] ${
                isYour ? 'bg-[var(--primary)]' : 'bg-[var(--white-2)]'
            } 
                            `}
        >
            <div className="relative w-[60px]">
                <InsertDriveFileIcon
                    className={`${
                        isYour ? 'text-[var(--white)]' : 'text-[var(--black)]'
                    } !text-[4rem]`}
                />
                <p
                    className={`absolute top-[50%] right-[50%] translate-x-[50%] text-[0.8rem] ${
                        isYour ? 'text-[var(--primary)]' : 'text-[var(--white)]'
                    }`}
                >
                    {
                        data.file.originalName.split('.')[
                            data.file.originalName.split('.').length - 1
                        ]
                    }
                </p>
            </div>

            <div>
                <p
                    className={`text-[1rem] ${
                        isYour ? 'text-[var(--white)]' : 'text-[var(--black)]'
                    } max-w-[100px]  lg:max-w-[200px] xl:max-w-[300px] truncate`}
                >
                    {data.file.originalName}
                </p>
                <p
                    className={`${
                        isYour ? 'text-[var(--white)]' : 'text-[var(--black)]'
                    } text-[0.8rem]`}
                >
                    {tranferFileSize(data.file.size)}
                </p>
            </div>
        </a>
    );
}
