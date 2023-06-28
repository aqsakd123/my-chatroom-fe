import Form from "antd/es/form/Form";
import {useAuth} from "./auth-context";
import {useState} from "react";
import {useNavigate} from "react-router-dom";
import {editDocument} from "../firebase";
import Card from "antd/es/card/Card";
import Link from "antd/es/typography/Link";
import Input from "antd/es/input/Input";
import {Button, Col} from "antd";

const UpdateProfile = () => {

    const [form] = Form.useForm()

    const { currentUser, updatePassword, updateProfile } = useAuth()

    const [error, setError] = useState("")
    const navigate = useNavigate();

    async function handleSubmit(e) {
        setError("")

        let data = {}
        if (form.getFieldValue('displayName')) {
            data = { ...data, displayName: form.getFieldValue('displayName') }
            await updateProfile(data)
        }
        if (form.getFieldValue('password')) {
            data = { ...data, password: form.getFieldValue('password') }
            await updatePassword(form.getFieldValue('password'))
        }
        navigate('/')
    }

    const validatePassword = (_, value) => {
        if(value) {
            if(value.length < 8) {
                return Promise.reject('Password should include at least 8 characters')
            }
            if (!/[0-9]/.test(value)) {
                return Promise.reject('Password should include at least 1 digit')
            }
            if (!/[a-z]/.test(value)) {
                return Promise.reject('Password should include at least 1 normal character')
            }
            if (!/[A-Z]/.test(value)) {
                return Promise.reject('Password should include at least 1 capitalize character')
            }
            if (!/[!@#$%^&*]/.test(value)) {
                return Promise.reject('Password should include at least 1 special character including: !@#$%^&*')
            }
            return Promise.resolve()
        }
        return Promise.resolve()
    }

    const validateReInputPassword = (_, value) => {
        if (value && value !== form.getFieldValue('password')) {
            return Promise.reject('Password not match')
        }
        return Promise.resolve()
    }


    return (
        <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
            <div style={{ width: '40%' }}>
                <h2 className="text-center mb-4">Update Profile</h2>
                {error && <p style={{ color: 'red' }}>{error}</p>}
                <Form
                    layout={"horizontal"}
                    form={form}
                    preserve={true}
                    onFinish={handleSubmit}
                    style={{ width: '100%' }}
                >
                    <Form.Item
                        label={"Username display"}
                        name={"displayName"}
                        rules={[
                            {
                                max: 255,
                                message: 'displayName max length is 255 characters'
                            }
                        ]}
                        style={{ width : "100%" }}
                    >
                        <Input placeholder={"Username hiển thị"}/>
                    </Form.Item>
                    <Form.Item
                        label={"Password"}
                        name={"password"}
                        rules={[
                            {
                                max: 255,
                                message: 'Password max length is 255 characters'
                            }
                        ]}
                        style={{ width : "100%" }}
                    >
                        <Input type={"password"} placeholder={"Password"}/>
                    </Form.Item>
                    <Form.Item
                        label={"Re-Input"}
                        name={"reInputPassword"}
                        rules={[
                            {
                                max: 255,
                                message: 'Re-Input Password max length is 255 characters'
                            },
                            {
                                validator: validateReInputPassword
                            }
                        ]}
                        style={{ width : "100%" }}
                    >
                        <Input type={"password"} placeholder={"Re-Input Password"}/>
                    </Form.Item>

                    <Form.Item style={{ paddingTop: '30px', display: 'flex', justifyContent: 'center' }}>
                        <Button type="primary" htmlType="submit" style={{ width: '100%', marginBottom: 5 }}>
                            Update Information
                        </Button>
                    </Form.Item>
                </Form>
            </div>
            <div className="w-100 text-center mt-2">
                <Button type={'text'} onClick={() => navigate('/')}>Cancel</Button>
            </div>
        </div>
    )
}

export default UpdateProfile