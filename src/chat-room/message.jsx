import styled from "@emotion/styled";
import Avatar from "antd/es/avatar/avatar";
import Typography from "antd/es/typography/Typography";
import { formatRelative } from 'date-fns/esm';
import {Button} from "antd";
import {useState} from "react";
import {editDocument} from "../firebase";

const WrapperStyled = styled.div`
  margin-bottom: 10px;

  .author {
    margin-left: 10px;
    font-weight: bold;
  }

  .date {
    margin-left: 10px;
    font-size: 11px;
    color: #a7a7a7;
  }

  .content-author {
    margin-left: 30px;
    width: auto;
    max-width: 300px;
    min-width: 100px;
    text-align: right;
    background-color: blueviolet;
    padding: 5px;
    margin-right: 30px;
    border-radius: 10px 0px 10px 10px;
  }
  
  .content-not-author {
    margin-left: 30px;
    width: fit-content;
    max-width: 300px;
    min-width: 100px;
    text-align: left;
    padding: 5px;
    border-radius: 0px 10px 10px 10px;
    background-color: green;
    color: white !important;
  }

  .deleted-msg {
    background-color:rgb(255,0,0, 10%);
    border: 2px solid red;
  }

`;


export default function Message({ item, isAuthor, displayName, photoURL, style }) {
    const [displayButton, setDisplayButton] = useState(false)

    const { createdAt, id, text, isDelete } = item

    function formatDate(seconds) {
        let formattedDate = '';

        if (seconds) {
            formattedDate = formatRelative(new Date(seconds * 1000), new Date());
            formattedDate = formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);
        }

        return formattedDate;
    }

    async function handleDeleteMsg() {
        await editDocument('messages', id, { isDelete: 1 }).catch(r => console.log(r))
    }

    return (
        <WrapperStyled
            style={{...style }}>
            <div
                onMouseEnter={() => setDisplayButton(true)}
                onMouseLeave={() => setDisplayButton(false)}
            >
                <div style={{ display: 'flex', justifyContent: isAuthor ? 'flex-end' : 'flex-start' }}>
                    <Avatar size='small' src={photoURL}>
                        {photoURL ? '' : displayName?.charAt(0)?.toUpperCase()}
                    </Avatar>
                    <div>
                        <Typography className='author'>{displayName}</Typography>
                        <Typography className='date'>
                            {formatDate(createdAt?.seconds)}
                        </Typography>
                    </div>
                </div>
                <div style={{ display: 'flex' }}>
                    {(isAuthor && !isDelete && displayButton) &&
                    <Button
                        onClick={handleDeleteMsg}
                        type={"text"}>❌</Button>
                    }
                    <div className={`${isAuthor ? 'content-author' : 'content-not-author'} ${isDelete && 'deleted-msg'}`}>
                        <Typography.Text style={{ color: isDelete ? 'red' : 'white' }}>{isDelete ? `Message "${text}" has been deleted` : text}</Typography.Text>
                    </div>
                </div>
            </div>
        </WrapperStyled>
    )
}