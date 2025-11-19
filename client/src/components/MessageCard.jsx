import DeleteIcon from '@mui/icons-material/Delete';
import {
    Button,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogTitle,
    IconButton,
} from '@mui/material';
import React, { memo, useEffect, useRef, useState } from 'react';
import { useAppContext } from '../contexts/AppContext';
import {
    default as messageService,
    default as MessageService,
} from '../services/MessageService';
import { formatLocalTime, getHours } from '../utils/formatTime';
import SingleAvatar from './common/SingleAvatar';
import ReadUserAvatars from './ReadUserAvatars';
import { useConversationContext } from '../contexts/ConversationContext';
import AudioCard from './common/AudioCard';
import FileCard from './common/FileCard';

function MessageCard({ data, isYour, presentAvt, viewImg, isLast }) {
    const { accessToken, socket, user } = useAppContext();
    const { data: conversationData } = useConversationContext();

    const messageElementRef = useRef();
    const time = formatLocalTime(data.createdAt);
    const [isHover, setIsHover] = useState(false);
    const [openDeletePopUp, setOpenDeletePopUp] = useState(false);
    const [deletting, setDeletting] = useState(false);
    const [waveWidth, setWaveWidth] = useState(0);

    const handleDeleteMessage = async () => {
        setDeletting(true);
        const result = await messageService.deleteMessage({
            id: data.id,
            token: accessToken,
        });

        if (result.success) {
            socket.send(
                '/app/message/delete',
                {},
                JSON.stringify(result.metaData)
            );
        }
        setDeletting(false);
        setOpenDeletePopUp(false);
    };

    const handleReadLastMessage = async () => {
        const thisMember = conversationData.members.find(
            (e) => e.id === user.id
        );
        if (isLast && thisMember.lastRead < data.seq) {
            const result = await MessageService.readLastMessage({
                token: accessToken,
                messageId: data.id,
            });

            if (result.success) {
                socket.send(
                    '/app/message/last-read',
                    {},
                    JSON.stringify(result.metaData)
                );
            }
        }
    };

    useEffect(() => {
        if (messageElementRef.current) {
            const { offsetWidth } = messageElementRef.current;
            setWaveWidth((offsetWidth * 40) / 100);
        }
    }, []);

    useEffect(() => {
        handleReadLastMessage();
    }, [data]);

    return (
        <>
            <div
                ref={messageElementRef}
                onMouseEnter={() => {
                    if (data.active) setIsHover(true);
                }}
                onMouseLeave={() => {
                    if (data.active) setIsHover(false);
                }}
            >
                <div
                    className={`mt-[2px] flex items-center  ${
                        isYour ? 'flex-row-reverse' : ''
                    }`}
                >
                    {!isYour && presentAvt && (
                        <div className="self-end">
                            <SingleAvatar data={data.user} size={'s'} />
                        </div>
                    )}
                    <div
                        className={`max-w-[50%] p-[10px_10px_2px_10px] ${
                            isYour
                                ? 'rounded-[20px_20px_0_20px] bg-[var(--primary)]'
                                : 'rounded-[0_20px_20px_20px] bg-[var(--white-2)]'
                        } 
                            ${!isYour && !presentAvt ? 'ml-[36px]' : 'ml-1'}`}
                    >
                        {data.active && data.type === 'text' && (
                            <p
                                className={`${
                                    isYour
                                        ? 'text-white'
                                        : 'text-[var(--black)]'
                                } break-word`}
                            >
                                {data.content}
                            </p>
                        )}

                        {data.active && data.type === 'image' && (
                            <img
                                src={data.file.url}
                                className={`w-auto max-h-[200px] rounded-xl cursor-pointer }`}
                                onClick={() => viewImg(data)}
                            />
                        )}

                        {data.active &&
                            ['voice', 'audio'].includes(data.type) && (
                                <AudioCard
                                    data={data}
                                    waveWidth={waveWidth}
                                    isYour={isYour}
                                />
                            )}

                        {data.active && data.type === 'video' && (
                            <video
                                controls
                                className={`w-auto max-h-[200px] rounded-xl border-[2px] border-[var(--primary)]`}
                            >
                                <source src={data.file.url} type="video/mp4" />
                            </video>
                        )}

                        {data.active && data.type === 'file' && (
                            <FileCard data={data} isYour={isYour} />
                        )}

                        {!data.active && (
                            <p
                                className={`bg-transparent p-[4px_10px]  border-[1px] ${
                                    isYour
                                        ? 'text-[var(--white-2)] border-[var(--white-2)] rounded-[20px_20px_0_20px]'
                                        : 'text-[var(--black-2)] border-[var(--black-2)] rounded-[0_20px_20px_20px] '
                                }`}
                            >
                                {isYour
                                    ? `You unsent a ${
                                          data.type === 'text'
                                              ? 'message'
                                              : data.type
                                      }`
                                    : `${data.user.name} unsent a ${
                                          data.type === 'text'
                                              ? 'message'
                                              : data.type
                                      }`}
                            </p>
                        )}
                        <p
                            className={`text-right text-[0.8rem] ${
                                isYour
                                    ? 'text-[var(--white-2)]'
                                    : 'text-[var(--black-2)]'
                            }`}
                        >
                            {getHours(data.createdAt)}
                        </p>
                    </div>

                    {isHover && isYour && (
                        <div
                            className={`flex items-center mr-2 transition-all`}
                        >
                            <IconButton
                                color="error"
                                sx={{
                                    marginRight: '8px',
                                    height: '30px',
                                    width: '30px',
                                }}
                                onClick={() => setOpenDeletePopUp(true)}
                            >
                                <DeleteIcon />
                            </IconButton>
                            <p className="text-[#828282]">{time}</p>
                        </div>
                    )}
                </div>
                {isLast && <ReadUserAvatars isYour={isYour} message={data} />}
            </div>
            <Dialog
                open={openDeletePopUp}
                onClose={() => setOpenDeletePopUp(false)}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                sx={{
                    '& .MuiPaper-root': {
                        minWidth: '400px',
                        padding: '10px 20px',
                    },
                }}
            >
                <DialogTitle id="alert-dialog-title">
                    Delete this message?
                </DialogTitle>

                <DialogActions>
                    <Button
                        color="secondary"
                        variant="outlined"
                        onClick={() => setOpenDeletePopUp(false)}
                    >
                        No
                    </Button>
                    <Button
                        color="secondary"
                        variant="contained"
                        onClick={handleDeleteMessage}
                    >
                        Yes
                        {deletting && (
                            <CircularProgress
                                className="!ml-2"
                                size="1.4rem"
                                color="inherit"
                            />
                        )}
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}

export default memo(MessageCard);
