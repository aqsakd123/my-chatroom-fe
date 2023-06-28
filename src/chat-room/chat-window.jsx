import {useAuth} from "../auth/auth-context";
import {Col, Row} from "antd";
import SideBar from "./side-bar";
import ChatRoom from "./chat-room";
import {useEffect, useMemo, useState} from "react";
import useCollectFirestore from "../auth/useCollectFirestore";
import {addDocument} from "../firebase";

export default function ChatWinDow({currentRoom, setCurrentRoom}) {

    const { currentUser } = useAuth()

    const roomsCondition = useMemo(() => {
        return {
            fieldName: 'members',
            operator: 'array-contains',
            compareValue: currentUser?.uid
        }
    }, [currentUser?.uid])

    const rooms = useCollectFirestore('rooms', roomsCondition)
    const selectedRoom = rooms?.filter(item => item.id === currentRoom?.id)

    return (
        <div>
            <Row>
                <Col span={6}>
                    <SideBar
                        rooms={rooms}
                        currentRoom={currentRoom}
                        setCurrentRoom={setCurrentRoom}
                    />
                </Col>
                <Col span={18}>
                    <ChatRoom
                        roomSelected={selectedRoom[0]}
                        />
                </Col>
            </Row>
        </div>
    );
}