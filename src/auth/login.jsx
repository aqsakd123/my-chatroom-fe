import {Button, Col, Row, Typography} from "antd";
import Form from "antd/es/form/Form";
import Input from "antd/es/input/Input";
import {useNavigate} from "react-router-dom";
import {useAuth} from "./auth-context";
import {addDocument, firebase} from "../firebase";
import {useEffect, useState} from "react";

const fbProvider = new firebase.auth.FacebookAuthProvider();
const googleProvider = new firebase.auth.GoogleAuthProvider();

export default function Login() {
    const [form] = Form.useForm()
    const navigate = useNavigate();
    const { loginByPopup, loginByEmail, currentUser } = useAuth()
    const [error, setError] = useState("")

    useEffect(() => {
        if(currentUser) {
            navigate('/')
        }
    },[])

    const handleLogin = async (provider) => {
        try {
            const { additionalUserInfo, user } = await loginByPopup(provider);

            if (additionalUserInfo?.isNewUser) {
                await addDocument('users', {
                    displayName: user.displayName || user.email.split('@')[0],
                    email: user.email,
                    photoURL: user.photoURL,
                    uid: user.uid,
                    providerId: additionalUserInfo.providerId,
                });
            }
            navigate('/')
        } catch (e) {
            console.log(e)
        }
    };

    const handleLoginUsingUP = async () => {
        try {
            setError("")
            await loginByEmail(form.getFieldsValue(true).email, form.getFieldsValue(true).password)
            navigate("/")
        } catch {
            setError("Failed to log in")
        }
    }

    return (
        <div>
            <Row justify='center' style={{ height: 800 }}>
                <Col span={8}>
                    <Typography.Title style={{ textAlign: 'center' }} level={2}>
                        CHATTING ROOM OF MINE
                    </Typography.Title>
                    {error && <p>{error}</p>}
                    <Form
                        layout={"horizontal"}
                        form={form}
                        preserve={true}
                        onFinish={handleLoginUsingUP}
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
                                }
                            ]}
                            style={{ width : "100%" }}
                        >
                            <Input type={"password"} placeholder={"Password"}/>
                        </Form.Item>

                        <Form.Item style={{ paddingTop: '30px', display: 'flex', justifyContent: 'center' }}>
                            <Button type="primary" htmlType="submit" style={{ width: '100%', marginBottom: 5 }}>
                                Login
                            </Button>
                        </Form.Item>
                        <p>Not having an account? <a href={"/register"}>Sign up</a></p>
                        <p>Forget your password? <a href={"/forget-pass"}>Reset Password</a></p>

                    </Form>

                    <Button
                        style={{ width: '100%', marginBottom: 5 }}
                        onClick={() => handleLogin(googleProvider)}
                    >
                        Login using Google
                    </Button>
                    <Button
                        style={{ width: '100%' }}
                        onClick={() => handleLogin(fbProvider)}
                    >
                        Login using Facebook
                    </Button>
                </Col>
            </Row>
        </div>
    );
}