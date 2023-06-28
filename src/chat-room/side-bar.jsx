import {useAuth} from "../auth/auth-context";
import {Button, Collapse, Typography} from "antd";
import styled from "@emotion/styled";
import {PlusSquareOutlined} from "@ant-design/icons";
import {useEffect, useMemo, useState} from "react";
import AddRoomModal from "./modals/add-room";
import useCollectFirestore from "../auth/useCollectFirestore";
import {db} from "../firebase";
import { collectionGroup, getCountFromServer, query, where } from 'firebase/firestore';

const { Panel } = Collapse

const StyledPanel = styled(Panel)`
&&& {

    .ant-collapse-header, p {
        color: white
    }

    .ant-typography {
        color: wheat;
        cursor: pointer
    }
    
}
`
export default function SideBar({rooms, currentRoom, setCurrentRoom}) {

    const { currentUser } = useAuth()
    const [addRoom, setAddRoom] = useState(false)

    const handleAddRoom = () => {
        setAddRoom(true);
    };

    useEffect(() => {
        if(rooms?.length > 0 && !currentRoom) {
            setCurrentRoom(rooms[0])
        }
    }, [rooms])

    // count latest msg
    // Change logic, but can convert to using sth like server sent event
    
    // Logic #1: 'lastest-msg' : { userId, roomId, messagesRead }
    // Check by roomId and userId, use snapShot to fetch (which will update if user check from other devices)
    // calculate from the latest message and messagesRead (count cant use snapshot, use query onSnapshot + .size())
    // snapShot list room -> snapShot messages from messageList[0] to messageRead Id, then .size, do with each room.

    // ===> Merging too many Collection and performance issue when use snapshot to count, use JPA + socket io instead?

    // const roomsCondition = useMemo(() => {
    //     return {
    //         fieldName: 'userId',
    //         operator: '==',
    //         compareValue: currentUser?.uid
    //     }
    // }, [currentUser?.uid])
    //
    // const readMsg = useCollectFirestore('lastest-msg', roomsCondition)
    //
    // console.log(readMsg)

    function changeRoom(id) {
        return setCurrentRoom(id);
    }

    return (
        <div style={{ backgroundColor: '#3f0e40', color: 'white', height: '580px' }}>
            <AddRoomModal
                addRoom={addRoom}
                setAddRoom={setAddRoom}
                />
            <Collapse ghost>
                <StyledPanel header={"Room List"}>
                    {rooms && rooms.map((item, index) => {
                        return (
                            <Typography key={index} onClick={()=> changeRoom(item)}>+ {item?.name}</Typography>
                        )
                    })}
                </StyledPanel>
            </Collapse>
            <Button
                type='text'
                icon={<PlusSquareOutlined />}
                className='add-room'
                onClick={handleAddRoom}
                style={{ color: 'white' }}
            >
                Add Room Chat
            </Button>
        </div>
    );
}