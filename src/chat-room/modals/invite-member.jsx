import {db} from "../../firebase";
import {Option} from "antd/lib/mentions";
import Avatar from "antd/es/avatar/avatar";
import {Form, Select, Spin} from "antd";
import {useEffect, useMemo, useState} from "react";
import Modal from "antd/es/modal/Modal";
import { debounce } from 'lodash';

function DebounceSelect({
                            fetchOptions,
                            debounceTimeout = 1000,
                            curMembers,
                            ...props
                        }) {
    // Search: abcddassdfasdf

    const [fetching, setFetching] = useState(false);
    const [options, setOptions] = useState([]);

    const debounceFetcher = useMemo(() => {
        const loadOptions = (value) => {
            setOptions([]);
            setFetching(true);

            fetchOptions(value, curMembers).then((newOptions) => {
                setOptions(newOptions);
                setFetching(false);
            });
        };

        return debounce(loadOptions, debounceTimeout);
    }, [debounceTimeout, fetchOptions, curMembers]);

    useEffect(() => {
        return () => {
            // clear when unmount
            setOptions([]);
        };
    }, []);

    return (
        <Select
            labelInValue
            filterOption={false}
            onSearch={debounceFetcher}
            notFoundContent={fetching ? <Spin size='small' /> : null}
            {...props}
        >
            {options.map((opt) => (
                <Select.Option key={opt.value} value={opt.value} title={opt.label}>
                    <Avatar size='small' src={opt.photoURL}>
                        {opt.photoURL ? '' : opt.label?.charAt(0)?.toUpperCase()}
                    </Avatar>
                    {` ${opt.label}`}
                </Select.Option>
            ))}
        </Select>
    );
}

async function fetchUserList(search, curMembers) {
    return db
        .collection('users')
        // .where('email', '>=', search?.toLowerCase())
        .orderBy('email')
        .startAt(search?.toLowerCase())
        .endAt(search?.toLowerCase()+"\uf8ff")
        .limit(20)
        .get()
        .then((snapshot) => {
            console.log(snapshot.docs)
            return snapshot.docs
                .map((doc) => ({
                    label: doc.data().displayName,
                    value: doc.data().uid,
                    photoURL: doc.data().photoURL || doc.data().displayName[0].toUpperCase(),
                }))
                .filter((opt) => !curMembers.includes(opt.value));
        });
}

export default function InviteMemberModal({selectedRoom, isInviteMemberVisible, setIsInviteMemberVisible}) {

    const [value, setValue] = useState([]);
    const [form] = Form.useForm();

    const handleOk = () => {
        // reset form value
        form.resetFields();
        setValue([]);

        // update members in current room
        const roomRef = db.collection('rooms').doc(selectedRoom?.id);

        roomRef.update({
            members: [...selectedRoom?.members, ...value.map((val) => val.value)],
        });

        setIsInviteMemberVisible(false);
    };

    const handleCancel = () => {
        // reset form value
        form.resetFields();
        setValue([]);

        setIsInviteMemberVisible(false);
    };

    return (
        <div>
            <Modal
                title='Invite more member'
                open={isInviteMemberVisible}
                onOk={handleOk}
                onCancel={handleCancel}
                destroyOnClose={true}
            >
                <Form form={form} layout='vertical'>
                    <DebounceSelect
                        mode='multiple'
                        name='search-user'
                        label='Input users email'
                        value={value}
                        placeholder='Input email'
                        fetchOptions={fetchUserList}
                        onChange={(newValue) => setValue(newValue)}
                        style={{ width: '100%' }}
                        curMembers={selectedRoom?.members}
                    />
                </Form>
            </Modal>
        </div>
    );
}