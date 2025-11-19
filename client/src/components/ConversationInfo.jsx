import AbcIcon from '@mui/icons-material/Abc';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import DeleteIcon from '@mui/icons-material/Delete';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import ImageIcon from '@mui/icons-material/Image';
import WestIcon from '@mui/icons-material/West';
import {
    Button,
    Collapse,
    Dialog,
    DialogActions,
    DialogTitle,
    IconButton,
    List,
    ListItemButton,
    ListItemIcon,
    ListItemText,
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAppContext } from '../contexts/AppContext';
import conversationService from '../services/ConversationService';
import AddMembers from './AddMembers';
import ChangeConversationAvatar from './ChangeConversationAvatar';
import MemberCard from './MemberCard';
import RenameGroup from './RenameGroup';
import ConversationAvatar from './common/ConversationAvatar';
import { useConversationContext } from '../contexts/ConversationContext';

function ConversationInfo({ close }) {
    const { data } = useConversationContext();
    const { user, accessToken, socket } = useAppContext();
    const { id } = useParams();

    const [partner, setPartner] = useState(null);
    const [admin, setAdmin] = useState(false);
    const { group, avatar, email, members, name } = data;
    const [openMemberList, setOpenMemberList] = useState(false);
    const [openEditList, setOpenEditList] = useState(false);
    const [openChangeNamePopUp, setOpenChangeNamePopUp] = useState(false);
    const [openAddMembersPopUp, setOpenAddMembersPopUp] = useState(false);
    const [openDeletePopUp, setDeletePopUp] = useState(false);
    const [openLeaveGroupPopUp, setOpenLeaveGroupPopUp] = useState(false);
    const [openChangeAvtPopUp, setOpenChangeAvtPopUp] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        setAdmin(data?.createdBy.id === user.id);
        setPartner(() => data?.members.find((e) => e.id !== user.id));
    }, []);

    const handleDeleleteGroup = async () => {
        const result = await conversationService.deleteGroup({
            token: accessToken,
            conversationId: id,
        });

        if (result.success)
            socket.send('/app/conversation/delete', {}, JSON.stringify(data));
        navigate('/c/');
    };

    const handleLeaveGroup = async () => {
        const result = await conversationService.leaveGroup({
            token: accessToken,
            conversationId: id,
            memberId: user.id,
        });

        if (result.success) {
            const members = data.members;
            const newMembers = members.filter((e) => e.id !== user.id);
            const newData = data;
            const removeData = data;

            // update conversation data
            newData.members = newMembers;
            socket.send(
                '/app/conversation/change-data',
                {},
                JSON.stringify(newData)
            );

            // remove member from conversation
            removeData.members = [user];
            socket.send(
                '/app/conversation/delete',
                {},
                JSON.stringify(removeData)
            );
        }

        navigate('/c/');
    };

    const handleOpenMemberList = () => {
        setOpenMemberList(!openMemberList);
    };

    const handleOpenEditList = () => {
        setOpenEditList(!openEditList);
    };

    const handleCloseChangeNamePopUp = () => {
        setOpenChangeNamePopUp(false);
    };

    const handleCloseAddMembersPopUp = () => {
        setOpenAddMembersPopUp(false);
    };

    return (
        <div className="bg-[var(--white)] p-[40px_10px] flex flex-col items-center overflow-y-scroll z-[999] rounded-md lg:ml-[10px] lg:w-[40%] lg:relative w-full h-full absolute top-0 left-0">
            <div className="absolute top-[28x] left-[40px] lg:hidden">
                <IconButton
                    sx={{
                        height: '40px',
                        width: '40px',
                    }}
                    onClick={close}
                >
                    <ArrowBackIosNewIcon className="text-[var(--primary)] !text-[1.8rem]" />
                </IconButton>
            </div>
            <h1 className="text-[1.6rem] text-[var(--black)] font-semibold text-center mb-8">
                {group ? 'Group Info' : 'User Info'}
            </h1>
            <ConversationAvatar data={data} width={'200px'} size={'large'} />
            <h1 className="text-[2rem] text-[var(--black)] text-center">
                {data.group ? name : partner?.name}
            </h1>
            <div className="mt-8">
                {!group && (
                    <div>
                        <h1 className="text-[var(--black)] text-[1.4rem]">
                            Email
                        </h1>
                        <p className="text-[var(--primary)] text-[1.2rem] tracking-widest">
                            {partner?.email}
                        </p>
                    </div>
                )}
                {group && (
                    <div>
                        <div className="mb-[1px] min-w-[300px]">
                            <ListItemButton onClick={handleOpenEditList}>
                                <ListItemText className="text-[var(--primary)]">
                                    Manage
                                </ListItemText>
                                {openEditList ? (
                                    <ExpandLess className="text-[var(--primary)]" />
                                ) : (
                                    <ExpandMore className="text-[var(--primary)]" />
                                )}
                            </ListItemButton>
                            <Collapse
                                in={openEditList}
                                timeout="auto"
                                unmountOnExit
                            >
                                <List
                                    component="div"
                                    disablePadding
                                    sx={{
                                        color: 'var(--black)',
                                    }}
                                >
                                    {admin && (
                                        <>
                                            <ListItemButton
                                                sx={{ pl: 4 }}
                                                onClick={(e) => {
                                                    setOpenChangeNamePopUp(
                                                        true
                                                    );
                                                }}
                                            >
                                                <ListItemIcon>
                                                    <AbcIcon className="text-[var(--black" />
                                                </ListItemIcon>
                                                <ListItemText primary="Change group name" />
                                            </ListItemButton>
                                            <ListItemButton
                                                sx={{ pl: 4 }}
                                                onClick={(e) =>
                                                    setOpenChangeAvtPopUp(true)
                                                }
                                            >
                                                <ListItemIcon>
                                                    <ImageIcon className="text-[var(--black)]" />
                                                </ListItemIcon>
                                                <ListItemText primary="Change group avatar" />
                                            </ListItemButton>
                                            <ListItemButton
                                                sx={{ pl: 4 }}
                                                onClick={(e) => {
                                                    setOpenAddMembersPopUp(
                                                        true
                                                    );
                                                }}
                                            >
                                                <ListItemIcon>
                                                    <GroupAddIcon className="text-[var(--black)] " />
                                                </ListItemIcon>
                                                <ListItemText primary="Add members" />
                                            </ListItemButton>
                                            <ListItemButton
                                                sx={{ pl: 4 }}
                                                onClick={(e) =>
                                                    setDeletePopUp(true)
                                                }
                                            >
                                                <ListItemIcon>
                                                    <DeleteIcon className="text-red-600" />
                                                </ListItemIcon>
                                                <ListItemText
                                                    primary="Delete group"
                                                    className="text-red-600"
                                                />
                                            </ListItemButton>
                                        </>
                                    )}
                                    {!admin && (
                                        <ListItemButton
                                            sx={{ pl: 4 }}
                                            onClick={() =>
                                                setOpenLeaveGroupPopUp(true)
                                            }
                                        >
                                            <ListItemIcon>
                                                <ExitToAppIcon className="text-red-600" />
                                            </ListItemIcon>
                                            <ListItemText
                                                primary="Leave group"
                                                className="text-red-600"
                                            />
                                        </ListItemButton>
                                    )}
                                </List>
                            </Collapse>
                        </div>

                        <div>
                            <ListItemButton onClick={handleOpenMemberList}>
                                <ListItemText className="text-[var(--primary)] text-[1.4rem]">
                                    {`Member (${members.length})`}
                                </ListItemText>
                                {openMemberList ? (
                                    <ExpandLess className="text-[var(--primary)]" />
                                ) : (
                                    <ExpandMore className="text-[var(--primary)]" />
                                )}
                            </ListItemButton>
                            <Collapse
                                in={openMemberList}
                                timeout="auto"
                                unmountOnExit
                            >
                                <List
                                    component="div"
                                    disablePadding
                                    sx={{
                                        color: 'var(--black)',
                                    }}
                                >
                                    {members.map((e, index) => (
                                        <MemberCard
                                            data={e}
                                            admin={admin}
                                            key={index}
                                        />
                                    ))}
                                </List>
                            </Collapse>
                        </div>
                    </div>
                )}
            </div>
            <RenameGroup
                open={openChangeNamePopUp}
                close={handleCloseChangeNamePopUp}
            />
            {openAddMembersPopUp && (
                <AddMembers
                    members={members}
                    open={openAddMembersPopUp}
                    close={handleCloseAddMembersPopUp}
                />
            )}
            <Dialog
                open={openDeletePopUp}
                onClose={() => setDeletePopUp(false)}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle
                    id="alert-dialog-title"
                    className="text-center text-[var(--primary)]"
                >
                    Do you want to delete this group?
                </DialogTitle>

                <DialogActions>
                    <Button
                        color="primary"
                        variant="contained"
                        onClick={() => setDeletePopUp(false)}
                    >
                        No
                    </Button>
                    <Button
                        color="primary"
                        variant="outlined"
                        onClick={handleDeleleteGroup}
                    >
                        Yes
                    </Button>
                </DialogActions>
            </Dialog>
            <Dialog
                open={openLeaveGroupPopUp}
                onClose={() => setOpenLeaveGroupPopUp(false)}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle
                    id="alert-dialog-title"
                    className="text-center text-[var(--primary)]"
                >
                    Do you want to leave this group?
                </DialogTitle>

                <DialogActions>
                    <Button
                        color="secondary"
                        variant="contained"
                        onClick={() => setOpenLeaveGroupPopUp(false)}
                    >
                        No
                    </Button>
                    <Button
                        color="secondary"
                        variant="outlined"
                        onClick={handleLeaveGroup}
                    >
                        Yes
                    </Button>
                </DialogActions>
            </Dialog>
            <ChangeConversationAvatar
                open={openChangeAvtPopUp}
                setStatus={setOpenChangeAvtPopUp}
                haveAvt={avatar !== null}
                conversationId={id}
            />
        </div>
    );
}

export default ConversationInfo;
