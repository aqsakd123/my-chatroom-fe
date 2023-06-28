import {useAuth} from "../auth/auth-context";
import styled from "@emotion/styled";
import Form from "antd/es/form/Form";
import {Avatar, Button, Spin, Tooltip} from "antd";
import {SendOutlined, UserAddOutlined} from "@ant-design/icons";
import Input from "antd/es/input/Input";
import Message from "./message";
import {useEffect, useMemo, useRef, useState} from "react";
import {addDocument, db} from "../firebase";
import useCollectFirestore from "../auth/useCollectFirestore";
import InviteMemberModal from "./modals/invite-member";
import {Waypoint} from "react-waypoint";


const HeaderStyled = styled.div`
  display: flex;
  justify-content: space-between;
  height: 56px;
  padding: 0 16px;
  align-items: center;
  border-bottom: 1px solid rgb(230, 230, 230);

  .header {
    &__info {
      display: flex;
      flex-direction: column;
      justify-content: center;
    }

    &__title {
      margin: 0;
      font-weight: bold;
    }

    &__description {
      font-size: 12px;
    }
  }
`;

const ButtonGroupStyled = styled.div`
  display: flex;
  align-items: center;
`;

const WrapperStyled = styled.div`
  height: 100vh;
`;

const ContentStyled = styled.div`
  height: 460px;
  display: flex;
  flex-direction: column;
  padding: 11px;
  justify-content: flex-end;
`;

const FormStyled = styled(Form)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 2px 2px 2px 0;
  border: 1px solid rgb(230, 230, 230);
  border-radius: 2px;

  .ant-form-item {
    flex: 1;
    margin-bottom: 0;
  }
`;

const MessageListStyled = styled.div`
  max-height: 100%;
  overflow-y: auto;
`;

export default function ChatRoom({ roomSelected }) {

    const { currentUser, userInfo } = useAuth()
    const [isInviteMemberVisible, setIsInviteMemberVisible] = useState()

    // console.log(currentUser?.multiFactor?.user?.accessToken)
    // console.log(currentUser?.getIdToken(true))

    const [snapShot, setSnapShot] = useState()
    const [messageList, setMessageList] = useState([])
    const [lastItem, setLastItem] = useState()

    const unsubscribeRef = useRef([])

    const [form] = Form.useForm();

    useEffect(() => {
        if(!roomSelected?.id) return;

            const messages = db.collection('messages')
                .where('roomId', '==', roomSelected?.id)
                .orderBy('createdAt', 'desc')
                .limit(10)

            const unsubcribe = messages.onSnapshot((snapshot) => {
                setSnapShot(snapshot)
            });
            setMessageList([])
            setSnapShot(null)

        return () => {
            // remove onSnapShot above
            unsubcribe()
            if (unsubscribeRef?.current?.length > 0) {
                unsubscribeRef?.current.forEach((unsub) => {
                    unsub()
                    // remove onSnapShot from getMoreMsg function called
                })
            unsubscribeRef.current=[]
            }
        }
    }, [roomSelected?.id])

    useEffect(() => {
        if (snapShot) {
            if(!(messageList?.length > 0)) {
                // setting msg first time
                const documents = snapShot.docs.map((doc) => ({
                    ...doc.data(),
                    id: doc.id,
                }));

                setMessageList(documents)
                setLastItem(snapShot.docs[snapShot.docs.length - 1])
            } else {
                // updating msg list
                const documents = snapShot.docs.map((doc) => ({
                    ...doc.data(),
                    id: doc.id,
                }));
                const totalMessageList = [...documents, ...messageList, ]
                const resultMap = new Map();
                // documents load first, if there are new documents, display in front of msgList
                totalMessageList
                    .filter(item => item.roomId === roomSelected.id)
                    .forEach(obj => {
                        if (!resultMap.has(obj.id)) {
                            resultMap.set(obj.id, { ...obj });
                        }
                    });
                setMessageList(Array.from(resultMap, ([name, value]) => ({ ...value })))
            }
        }
    }, [snapShot])

    function getMessageList(){
        return messageList
    }

    function getMoreMessage(){
        console.log({ rId: roomSelected?.id, lt: lastItem })
        try {
            if(roomSelected?.id
                && messageList?.length >= 10
                && lastItem) {
                const messages = db.collection('messages')
                    .where('roomId', '==', roomSelected?.id)
                    .orderBy('createdAt', 'desc')
                    .startAfter(lastItem)
                    .limit(10)
                const unsubscribe = messages.onSnapshot((snapshot) => {
                    const documents = snapshot.docs.map((doc) => ({
                        ...doc.data(),
                        id: doc.id,
                    }));

                    setLastItem(snapshot.docs[snapshot.docs.length - 1])
                    setMessageList((prevState) => {
                        const msgMap = new Map(prevState.map(item => [item.id, item]));
                        documents.forEach(item => {
                            if (msgMap.has(item?.id)) {
                                //update item already in messageList
                                msgMap.set(item?.id, item);
                            } else {
                                // if item not in messageList, push to map at the end
                                msgMap.set(item?.id, { ...item });
                            }
                        });
                        const result = Array.from(msgMap.values());
                        return result
                    })
                });
                unsubscribeRef.current.push(unsubscribe)
            }
        } catch (e) {
            console.log(e)
        }
    }

    const usersCondition = useMemo(() => {
        return {
            fieldName: 'uid',
            operator: 'in',
            compareValue: roomSelected?.members,
        };
    }, [roomSelected?.members]);

    const members = useCollectFirestore('users', usersCondition);

    // useEffect(() => {
    //     if(roomSelected?.id && messageList[0]?.id) {
    //         // getMsgLatest(messageList[0])
    //     }
    // }, [roomSelected?.id && messageList])
    //
    // async function getMsgLatest(message) {
    //     const query = await db.collection('lastest-msg')
    //         .where('userId', '==', currentUser?.uid)
    //         .where('roomId', '==', roomSelected?.id)
    //         .get()
    //     if (query?.empty){
    //         addDocument('lastest-msg', {
    //             userId: currentUser?.uid,
    //             roomId: roomSelected?.id,
    //             messagesRead: message?.id,
    //         }).catch(r => console.log(r))
    //     } else {
    //         query.forEach((doc) => {
    //             if (message?.id !== doc?.messagesRead)
    //             db.collection('lastest-msg').doc(doc?.id).update({
    //                 messagesRead: message?.id,
    //             })
    //         })
    //     }
    // }

    const handleOnSubmit = () => {
        addDocument('messages', {
            text: form.getFieldValue('message'),
            uid: currentUser?.uid,
            roomId: roomSelected?.id,
            isDelete: 0,
        }).catch(r => console.log(r))
        form.resetFields();
    };

    function getFromUser(id, field){
        if (!id) return;
        if (members?.filter(item => item.uid === id).length > 0) {
            return members?.filter(item => item.uid === id)[0][field]
        }
    }

    return (
        <>
            {roomSelected?.id ?
                <div style={{ height: '100%' }}>
                    <InviteMemberModal
                        isInviteMemberVisible={isInviteMemberVisible}
                        setIsInviteMemberVisible={setIsInviteMemberVisible}
                        selectedRoom={roomSelected}
                    />
                    <HeaderStyled>
                        <div className="header__info">
                            <h3 className="header__title">{roomSelected?.name}</h3>
                            <span className="header__description">{roomSelected?.description}</span>
                        </div>
                        <ButtonGroupStyled>
                            <Button type={'text'} icon={<UserAddOutlined />} onClick={() => setIsInviteMemberVisible(true)}>Invite</Button>
                            <Avatar.Group maxCount={2}>
                                {members?.length > 0 && members?.map((item, index) => {
                                    const displayName = item?.displayName || item?.email.split('@')[0]
                                    let photo
                                    if (item?.photoURL) {
                                        photo = item?.photoURL
                                    } else {
                                        photo = displayName[0].toUpperCase()
                                    }
                                    return (
                                        <Tooltip key={index} title={displayName}>
                                            <Avatar>{photo}</Avatar>
                                        </Tooltip>
                                    )})}
                            </Avatar.Group>
                        </ButtonGroupStyled>
                    </HeaderStyled>
                    <ContentStyled>
                        <MessageListStyled>
                            {(messageList?.length > 0) && messageList?.map((item, index) => {
                                const displayName = getFromUser(item?.uid, 'displayName')
                                let isAuthor = false
                                let customStyle = {}
                                if (getFromUser(item?.uid, 'uid') === currentUser?.uid){
                                    isAuthor = true
                                    customStyle = { display: 'flex', flexDirection: 'row-reverse' }
                                }
                                return(
                                    <Message key={index} item={item} isAuthor={isAuthor} displayName={displayName} style={customStyle}/>
                                )
                            })}
                            {/*<Spin size="small" style={{ display: 'flex', justifyContent: 'center' }} />*/}
                            <Waypoint
                                onEnter={() => getMoreMessage()}
                            />
                        </MessageListStyled>
                        {/*<Button onClick={getMoreMessage}>MORE</Button>*/}
                    </ContentStyled>
                    <FormStyled form={form}>
                        <Form.Item name='message'>
                            <Input
                                placeholder='Nhập tin nhắn...'
                                autoFocus={true}
                                bordered={false}
                                autoComplete='off'
                                onPressEnter={handleOnSubmit}
                            />
                        </Form.Item>
                        <Button onClick={handleOnSubmit} icon={<SendOutlined/>}/>
                    </FormStyled>
                </div>
                :
                <div>
                    Please choose a room, or create/ ask for someone to be invited
                </div>
            }
        </>
    );
}