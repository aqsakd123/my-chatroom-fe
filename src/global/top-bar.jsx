import {useNavigate} from "react-router-dom";
import {Button, Popover} from "antd";
import {MacCommandFilled, MenuFoldOutlined, MenuOutlined} from "@ant-design/icons";
import {useAuth} from "../auth/auth-context";
import TabBox from "../chat-room/tab-box";

export default function TopBar(){

    const { currentUser, logout } = useAuth()
    const navigate = useNavigate()

    async function handleLogOut() {
        await logout()
        navigate('/login')
    }

    const content = (
        <div>
            <Button type="text" style={{ width: '100%' }} onClick={() => navigate('/')}>Dashboard</Button>
            <Button type="text" style={{ width: '100%' }} onClick={() => navigate('/update-info')}>Change Info</Button>
            <Button type="text" onClick={handleLogOut} style={{ width: '100%' }}>Logout</Button>
        </div>
    );

    return (
        <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '10px' }}>
            {currentUser &&
            <Popover placement="bottomRight" title={"Menu"} content={content} trigger="click">
                {currentUser?.photoURL ?
                    <img src={currentUser?.photoURL} alt={"avatar"} style={{ width: '30px', height: '30px', borderRadius: '50%', cursor: 'pointer' }} />
                    :
                    <MenuOutlined style={{ fontSize: '25px' }} />
                }
            </Popover>
            }
            <TabBox style={{ position: 'absolute', bottom: '20px', right: '100px', zIndex: 1000 }}/>
        </div>
    );
}
