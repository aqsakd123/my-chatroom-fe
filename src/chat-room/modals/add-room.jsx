import {addDocument} from "../../firebase";
import Form from "antd/es/form/Form";
import {useAuth} from "../../auth/auth-context";
import Modal from "antd/es/modal/Modal";
import Input from "antd/es/input/Input";
import TextArea from "antd/es/input/TextArea";

export default function AddRoomModal({ addRoom, setAddRoom }) {

    const { currentUser } = useAuth()

    const [form] = Form.useForm();

    const handleOk = () => {
        addDocument('rooms', {...form.getFieldsValue(), members: [currentUser?.uid]})
            .then(r =>{
                handleCancel();
            })
            .catch(r => {
                console.log(r)
            });
    };

    const handleCancel = () => {
        form.resetFields();
        setAddRoom(false);
    };

    return (
        <div>
            <Modal
                title='Tạo phòng'
                open={addRoom}
                onOk={handleOk}
                onCancel={handleCancel}
            >
                <Form form={form} layout='vertical'>
                    <Form.Item label='Rome name' name='name'>
                        <Input placeholder='Input room name' />
                    </Form.Item>
                    <Form.Item label='Description' name='description'>
                        <TextArea placeholder='description' />
                    </Form.Item>
                </Form>
            </Modal>
        </div>
    );
}