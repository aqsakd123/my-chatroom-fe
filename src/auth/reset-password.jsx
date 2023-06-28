import {Alert, Button, Col} from "antd";
import Link from "antd/es/typography/Link";
import Form from "antd/es/form/Form";
import Input from "antd/es/input/Input";
import {useState} from "react";
import {useAuth} from "./auth-context";

export default function ForgotPassword() {
    const [form] = Form.useForm()

    const { resetPassword } = useAuth()
    const [error, setError] = useState("")
    const [message, setMessage] = useState("")

    async function handleSubmit(e) {
        try {
            setMessage("")
            setError("")
            await resetPassword(form.getFieldValue('email'))
            setMessage("Check your inbox for further instructions")
        } catch {
            setError("Failed to reset password")
        }
    }

    return (
        <div style={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
            <div style={{ width: '40%' }}>
                <h2 className="text-center mb-4">Password Reset</h2>
                <img src={"forget-psw.png"} />
                {error && <p style={{ color: 'red' }}>{error}</p>}
                {message && <p style={{ color: 'blue' }}>{message}</p>}
                <Form
                    layout={"horizontal"}
                    form={form}
                    preserve={true}
                    onFinish={handleSubmit}
                    style={{ width: '100%' }}
                >
                    <Form.Item
                        label={"Email"}
                        name={"email"}
                        rules={[
                            {
                                required: true,
                                message: 'email is required'
                            },
                            {
                                max: 255,
                                message: 'email max length is 255 characters'
                            }
                        ]}
                        style={{ width : "100%" }}
                    >
                        <Input type={"email"} placeholder={"email"}/>
                    </Form.Item>
                    <Form.Item style={{ paddingTop: '30px', display: 'flex', justifyContent: 'center' }}>
                        <Button type="primary" htmlType="submit" style={{ width: '100%', marginBottom: 5 }}>
                            Reset Password
                        </Button>
                    </Form.Item>
                </Form>
                <div className="w-100 text-center mt-3">
                    Suddenly remember you password? <a href="/login">Login</a>
                </div>
                You don't want to suffer so you need an new account? <a href="/signup">Sign Up</a>

            </div>
        </div>
    )
}