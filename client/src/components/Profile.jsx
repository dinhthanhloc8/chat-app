import React, { useEffect, useRef, useState } from 'react';

import DoneOutlineIcon from '@mui/icons-material/DoneOutline';
import EditIcon from '@mui/icons-material/Edit';
import { Avatar, Badge, Button, IconButton, TextField } from '@mui/material';
import { useAppContext } from '../contexts/AppContext';
import userService from '../services/UserService';
import ChangeUserAvatar from './ChangeUserAvatar';
import { useNavigate } from 'react-router-dom';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';

function Profile() {
    const navigate = useNavigate();
    const { user, profile, accessToken } = useAppContext();
    const { setOpenProfile } = profile;

    const [email, setEmail] = useState('');
    const [avatar, setAvatar] = useState(null);
    const [name, setName] = useState('');

    const [edit, setEdit] = useState(false);
    const [update, setUpdate] = useState(false);

    const oldName = useRef();
    const [openChangeAvtPopUp, setOpenChangeAvtPopUp] = useState(false);

    useEffect(() => {
        if (user) {
            setEmail(user.email);
            setName(user.name);
            setAvatar(user.avatar);
        }
    }, [user]);

    const handleUpdateName = async (e) => {
        const result = await userService.updateName({
            token: accessToken,
            name,
        });

        if (result.success) {
            setUpdate(false);
            setEdit(false);
            setName(result.metaData.name);
        }
    };

    return (
        <div className="absolute top-0 left-0 bottom-0 w-[100%] p-[14px] bg-transparent z-[9999]">
            <div className="relative bg-[var(--white)] w-[100%] h-[100%] flex flex-col items-center p-[32px_20px] rounded-2xl">
                <IconButton
                    className="w-[40px] h-[40px] top-[32px] left-[20px]"
                    sx={{
                        position: 'absolute !important',
                        height: '46px',
                        width: '46px',
                    }}
                    onClick={(e) => {
                        setOpenProfile(false);
                    }}
                >
                    <ArrowBackIosNewIcon
                        className="text-[var(--black)]"
                        fontSize="medium"
                    />
                </IconButton>
                <h1 className="text-2xl text-[var(--black)] text-center mt-1 font-semibold">
                    Profile
                </h1>
                <Badge
                    className="mt-8 cursor-pointer"
                    overlap="circular"
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                    badgeContent={
                        <div
                            className="bg-white p-2 rounded-full"
                            onClick={(e) => setOpenChangeAvtPopUp(true)}
                        >
                            <EditIcon />
                        </div>
                    }
                >
                    <Avatar
                        sx={{
                            height: '200px',
                            width: '200px',
                        }}
                        src={avatar || ''}
                    ></Avatar>
                </Badge>
                <div className="w-[100%] m-10">
                    <p className="text-[var(--primary)] font-semibold mb-2">
                        Your email
                    </p>
                    <div>
                        <p className="text-[var(--black)]">{email}</p>
                    </div>
                    <p className="text-[var(--primary)] font-semibold mb-2 mt-4">
                        Your name
                    </p>
                    <div className="flex justify-between items-center">
                        {!edit && (
                            <p className="p-[4px_0_4px] text-[var(--black)]">
                                {name}
                            </p>
                        )}
                        {edit && (
                            <TextField
                                id="outlined-required"
                                defaultValue={name}
                                color="secondary"
                                variant="standard"
                                className="flex-1"
                                onChange={(e) => {
                                    if (e.target.value === oldName.current)
                                        setUpdate(false);
                                    else setUpdate(true);
                                    setName(e.target.value);
                                }}
                            />
                        )}

                        {!update && (
                            <IconButton
                                sx={{
                                    height: '50px',
                                    width: '50px',
                                }}
                                onClick={(e) => {
                                    setEdit(!edit);
                                }}
                            >
                                <EditIcon
                                    sx={{
                                        '&': {
                                            marginRight: '0',
                                        },
                                    }}
                                    className="mr-3 cursor-pointer text-[var(--black)]"
                                />
                            </IconButton>
                        )}
                        {update && (
                            <IconButton
                                color="success"
                                sx={{
                                    height: '50px',
                                    width: '50px',
                                }}
                                onClick={handleUpdateName}
                            >
                                <DoneOutlineIcon
                                    sx={{
                                        '&': {
                                            marginRight: '0',
                                        },
                                    }}
                                    className="mr-3 cursor-pointer"
                                />
                            </IconButton>
                        )}
                    </div>
                </div>

                <Button
                    variant="contained"
                    onClick={() => navigate('/change-password')}
                >
                    Change your password
                </Button>
                <ChangeUserAvatar
                    open={openChangeAvtPopUp}
                    setStatus={setOpenChangeAvtPopUp}
                    reloadAvt={setAvatar}
                    haveAvt={avatar !== null}
                />
            </div>
        </div>
    );
}

export default Profile;
