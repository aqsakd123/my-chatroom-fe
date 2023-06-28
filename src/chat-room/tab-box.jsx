import {useAuth} from "../auth/auth-context";
import {useState} from "react";
import {Button} from "antd";
import {ArrowDownOutlined, CloseCircleFilled, DownCircleFilled} from "@ant-design/icons";
import ChatWinDow from "./chat-window";

export default function TabBox({ style, ...restProps }) {

    const [display, setDisplay] = useState(false)
    const [currentRoom, setCurrentRoom] = useState()
    const { currentUser } = useAuth()

    return (
        <>
                <Button onClick={() => setDisplay(true)} style={{ width: '200px', borderRadius: '0px', border: '1px solid black', ...style }} {...restProps}>
                    CHATROOM Tab
                </Button>
                <div
                    hidden={!display}
                    style={{ width: '50%',
                    minWidth: '600px',
                    height: '600px',
                    border: '1px solid black',
                    textAlign: 'left',
                    backgroundColor: 'white',
                    ...style }} {...restProps}>
                    <div style={{ width: '100%', backgroundColor: 'pink', display: 'flex', justifyContent: 'space-between' }}  onClick={() => setDisplay(false)} >
                        <div></div>
                        <div>
                            <DownCircleFilled />
                        </div>
                    </div>
                    <div>
                        <ChatWinDow
                            currentRoom={currentRoom}
                            setCurrentRoom={setCurrentRoom}
                        />
                    </div>
                </div>
        </>
    );
}