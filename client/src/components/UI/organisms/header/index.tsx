import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

// TODO : testSocket -> socket 통일
import { socket, SOCKET_EVENTS, connectSocket, SOCKET_FEATURE } from './testSocket';
import { useGetUserQuery } from '@services/user.service';
import NotificationContainer from '@organisms/NotificationContainer';
import AlarmIcon from '@icons/AlarmIcon';
import Logo from '@icons/Logo';
import SearchIcon from '@icons/SearchIcon';
import UserIcon from '@icons/UserIcon';
import HeaderUser from '@molecules/HeaderUser';
import { useDispatch, useSelector } from 'react-redux';
import { closeUserDropDown, toggleNotificationModal } from '@/store/user';
import { ReducerType } from '@/store/rootReducer';

const HeaderRoot = styled.header`
    height: 75px;
    width: 100%;
    background: #ffffff;
    box-shadow: 0px 2px 30px rgba(0, 0, 0, 0.12);
    padding: 20px 42px;
    display: flex;
    justify-content: space-between;
    button {
        border: none;
        background: none;
        cursor: pointer;
    }
`;
const HeaderLeft = styled.div`
    display: flex;
    gap: 10px;
    align-items: center;
    div {
        display: flex;
        gap: 10px;
        button {
            padding: 10px 15px;
            font-weight: 700;
            font-size: 16px;
            &:hover {
                background: ${({ theme }) => theme.LIGHT_GRAY};
            }
        }
    }
`;

const HeaderRight = styled.div`
    display: flex;
    gap: 20px;
    align-items: center;
    font-weight: 700;
    position: relative;

    strong {
        background: linear-gradient(to right, #9e57ff, #7ed0fa);
        background-clip: text;
        -webkit-background-clip: text;
        color: transparent;
        //color: ${({ theme }) => theme.LIGHT_SKY};
        //color: white;
        display: inline-block;
    }
`;

const StyledNewNotificationMark = styled.div`
    background-color: red;
    width: 10px;
    height: 10px;
    border-radius: 50%;
    position: absolute;
    top: 0px;
    left: 90px;
`;

export interface Notification {
    roomId: string;
    startTime: string;
    endTime: string;
    userId: number;
    message: string;
}

const Header = () => {
    const { data: userData } = useGetUserQuery();
    const isOpenNotificationModal = useSelector<ReducerType, boolean>(
        ({ userSlice }) => userSlice.openNotificationModal
    );
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [notifications, setNofitifcations] = useState<any>([]);
    const [isOnNotificationMark, setIsOnNotificationMark] = useState<boolean>(false);

    useEffect(() => {
        connectSocket(SOCKET_FEATURE.notification);
        if (!socket) return;
        socket.emit(SOCKET_EVENTS.getNotification, { userId: 1 });
        socket.emit(SOCKET_EVENTS.joinNotification, { userId: 1 });
        socket.on(SOCKET_EVENTS.receiveRoomNotification, (data) => receiveNewNotification(data));
        socket.on(SOCKET_EVENTS.setNotification, (data: any) => {
            setNofitifcations((curr: any) => [...curr, ...data.result.data]);
        });
    }, []);

    // TODO : 모달 열려 있을 때도 빨간 불 들어옴.
    const receiveNewNotification = useCallback(
        (data: Notification) => {
            if (!isOpenNotificationModal) setIsOnNotificationMark(true);
            setNofitifcations((curr: Notification[]) => [...curr, data]);
        },
        [isOpenNotificationModal]
    );

    //TODO: 이 부분 로직이 복잡해지면, 따로 컴포넌트로 각각 분리
    const clickSearch = useCallback(() => {
        alert('검색 기능은 아직 개발 중입니다.');
    }, []);

    const clickAlarm = useCallback(() => {
        setIsOnNotificationMark(false);
        dispatch(toggleNotificationModal());
    }, [isOpenNotificationModal]);

    const clickUser = useCallback(() => {
        if (!userData) navigate('/login');
        else alert('로그인이 완료되었어요');
    }, [userData]);

    const gotoPage = useCallback(
        (url: string) => () => {
            return navigate(url);
        },
        [navigate]
    );

    return (
        <HeaderRoot>
            <HeaderLeft>
                <button onClick={gotoPage('/')}>
                    <Logo />
                </button>
                <div>
                    <button onClick={gotoPage('/tickets')}>티켓팅</button>
                    {userData?.role === 'ARTIST' && (
                        <button onClick={gotoPage('/schedule')}>티켓관리</button>
                    )}
                    {userData?.role === 'ARTIST' && (
                        <button onClick={gotoPage('/artist')}>
                            <span>{userData?.artistId ? '마이페이지' : '아티스트 정보 등록'}</span>
                        </button>
                    )}
                </div>
            </HeaderLeft>
            <HeaderRight>
                {userData ? (
                    <HeaderUser nickname={userData.nickname} />
                ) : (
                    <button data-testid="user" onClick={clickUser}>
                        <UserIcon />
                    </button>
                )}
                <button data-testid="alarm" key="alarm" onClick={clickAlarm}>
                    {isOnNotificationMark && <StyledNewNotificationMark />}
                    <AlarmIcon />
                </button>
                <button data-testid="search" key="search" onClick={clickSearch}>
                    {<SearchIcon />}
                </button>
                {isOpenNotificationModal && <NotificationContainer notifications={notifications} />}
            </HeaderRight>
        </HeaderRoot>
    );
};

export default Header;
