import {Button, Col, Form, Row, Typography} from "antd";
import Input from "antd/es/input/Input";
import {useEffect, useState} from "react";
import {useAuth} from "./auth-context";
import {useNavigate} from "react-router-dom";
import {addDocument} from "../firebase";

export default function SignUp() {
    const [form] = Form.useForm()
    const [error, setError] = useState("")
    const { signup, currentUser } = useAuth()
    const navigate = useNavigate();

    useEffect(() => {
        if(currentUser) {
            navigate('/')
        }
    },[])

    const validateReInputPassword = (_, value) => {
        if (value && value !== form.getFieldValue('password')) {
            return Promise.reject('Password not match')
        }
        return Promise.resolve()
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

    async function handleSignup(e) {
        try {
            setError("")
            const user = await signup(form.getFieldsValue(true).email, form.getFieldsValue(true).password)
            await addDocument('users', {
                displayName: form.getFieldsValue(true).email.split('@')[0],
                email: form.getFieldsValue(true).email,
                uid: user?.user?.uid,
            });
            navigate("/")
        } catch (e) {
            setError("Failed to create an account: " + e.message )
        }
    }

    return (
        <div>
            <Row justify='center' style={{ height: 800 }}>
                <Col span={8}>
                    <Typography.Title style={{ textAlign: 'center' }} level={2}>
                        CHATTING ROOM OF MINE Sign Up
                    </Typography.Title>
                    {error && <p>{error}</p>}

                    <Form
                        layout={"horizontal"}
                        onFinish={handleSignup}
                        form={form}
                        preserve={true}
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
                            <Input placeholder={"email"}/>
                        </Form.Item>
                        <Form.Item
                            label={"Password"}
                            name={"password"}
                            rules={[
                                {
                                    required: true,
                                    message: 'Password is required'
                                },
                                {
                                    max: 255,
                                    message: 'Password max length is 255 characters'
                                },
                                {
                                    validator: validatePassword
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
                                    required: true,
                                    message: 'Re-Input Password is required'
                                },
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
                            <Button type="primary" htmlType="submit" size={"large"}>
                                Sign Up
                            </Button>
                        </Form.Item>
                        <span>Already having an account? <a href={"/login"}>Login</a></span>
                    </Form>
                </Col>
            </Row>
        </div>
    );
}