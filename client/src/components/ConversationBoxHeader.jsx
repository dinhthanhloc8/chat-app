import { Button, IconButton } from '@mui/material';
import React, { memo, useEffect, useRef } from 'react';

import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import { useConversationContext } from '../contexts/ConversationContext';
import ConversationAvatar from './common/ConversationAvatar';
import { useAppContext } from '../contexts/AppContext';
import { useState } from 'react';
import { formatLocalTime } from '../utils/formatTime';
import { useNavigate } from 'react-router-dom';

function ConversationBoxHeader({
    setOpenGroupInfo,
    setOpenConversationBox,
    openGroupInfo,
}) {
    const innerWidth = window.innerWidth;

    const navigate = useNavigate();
    const { user, socket } = useAppContext();
    const { data } = useConversationContext();
    const [name, setName] = useState();
    const [online, setOnline] = useState();
    const [lastSeen, setLastSeen] = useState();
    const partnerRef = useRef();
    const [subscription, setSubscription] = useState(null);

    useEffect(() => {
        if (!data.group) {
            partnerRef.current = data?.members.find((e) => {
                return e.id !== user.id;
            });

            console.warn('Siuuuu', data);
            if (partnerRef.current) {
                setSubscription(
                    socket.subscribe(
                        `/topic/user/${partnerRef.current.id}`,
                        (mess) => {
                            const message = JSON.parse(mess.body);
                            console.log('::Parter::', message);
                            setName(message.name);
                            setOnline(message.online);
                            setLastSeen(message.updatedAt);
                        }
                    )
                );
                setName(partnerRef.current.name);
                setOnline(partnerRef.current.online);
                setLastSeen(partnerRef.current.updatedAt);
            }
        }

        return () => {
            if (subscription) subscription.unsubscribe();
        };
    }, [data]);

    return (
        <div className="h-[86px] flex items-center p-[0_20px] cursor-pointer border-b-[1px] border-solid border-[var(--white-2)] relative w-full shadow-md">
            <div className="ml-[20px] md:hidden">
                <IconButton
                    color="secondary"
                    sx={{
                        color: '#fff',
                        padding: '20px',
                        marginLeft: '-20px',
                        marginRight: '40px',
                        height: '46px',
                        width: '46px',
                        '&.MuiIconButton-root': {
                            backgroundColor: 'var(--primary)',
                        },
                    }}
                    onClick={(e) => {
                        e.stopPropagation();
                        setOpenConversationBox(false);
                        navigate('/c');
                    }}
                >
                    <KeyboardArrowLeftIcon className="!text-[3rem]" />
                </IconButton>
            </div>

            <div>
                <ConversationAvatar data={data} />
            </div>
            {data?.group && (
                <div className="ml-4 flex-1">
                    <h1 className="text-[var(--black)] text-2xl">
                        {data?.name}
                    </h1>
                    <p className="text-[var(--black)] text-sm">
                        {data?.members.length}
                        {data?.members.length > 1 ? ' members' : ' member'}
                    </p>
                </div>
            )}

            {!data?.group && (
                <div className="ml-4 flex-1 ">
                    <h1 className="text-[var(--black)] text-2xl">{name}</h1>
                    {online && (
                        <p className="text-[var(--primary)] text-sm">Online</p>
                    )}
                    {!online && (
                        <p className="text-[var(--black)] text-sm">
                            {`Last seen at ${formatLocalTime(lastSeen)}`}
                        </p>
                    )}
                </div>
            )}
            <IconButton onClick={() => setOpenGroupInfo(!openGroupInfo)}>
                <MoreHorizIcon
                    fontSize="large"
                    className="text-[var(--primary)]"
                />
            </IconButton>
        </div>
    );
}

export default memo(ConversationBoxHeader);
