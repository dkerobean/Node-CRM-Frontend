import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { LockOutlined, MailOutlined } from '@ant-design/icons';
import { Button, Form, Input, Alert } from "antd";
import { signUp, showAuthMessage, showLoading, hideAuthMessage } from 'store/slices/authSlice';
import { useNavigate } from 'react-router-dom';
import { motion } from "framer-motion";
import axios from 'axios';

const rules = {
    email: [
        {
            required: true,
            message: 'Please input your email address'
        },
        {
            type: 'email',
            message: 'Please enter a valid email!'
        }
    ],
    password: [
        {
            required: true,
            message: 'Please input your password'
        }
    ],
    confirm: [
        {
            required: true,
            message: 'Please confirm your password!'
        },
        ({ getFieldValue }) => ({
            validator(_, value) {
                if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                }
                return Promise.reject('Passwords do not match!');
            },
        })
    ],
    ownerName: [
        {
            required: true,
            message: 'Please input your name'
        }
    ],
    orgName: [
        {
            required: true,
            message: 'Please input your organization name'
        }
    ]
};

export const RegisterForm = (props) => {
    const { signUp, showLoading, token, loading, redirect, message, showMessage, hideAuthMessage, allowRedirect = true } = props;
    const [form] = Form.useForm();
    const navigate = useNavigate();

    const onSignUp = async () => {
        form.validateFields().then(async (values) => {
            showLoading();

            const { confirm, ...data } = values; // Exclude confirm from the data to send

            try {
                const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/register`, {
                    ...data,
                    confirmPassword: data.password // Add confirm password to the request body
                });

                // Store token in localStorage
                localStorage.setItem('token', response.data.token);

                // Call Redux signUp action with the response data
                signUp(response.data);

                if (allowRedirect) {
                    navigate(redirect || '/dashboard'); // Redirect after successful registration
                }
            } catch (error) {
                props.showAuthMessage(error.response?.data?.message || 'Registration failed');
            }
        }).catch(info => {
            console.log('Validate Failed:', info);
        });
    };

    useEffect(() => {
        if (token !== null && allowRedirect) {
            navigate(redirect);
        }
        if (showMessage) {
            const timer = setTimeout(() => hideAuthMessage(), 3000);
            return () => {
                clearTimeout(timer);
            };
        }
    }, [token, redirect, allowRedirect, showMessage, hideAuthMessage, navigate]);

    return (
        <>
            <motion.div
                initial={{ opacity: 0, marginBottom: 0 }}
                animate={{
                    opacity: showMessage ? 1 : 0,
                    marginBottom: showMessage ? 20 : 0
                }}>
                <Alert type="error" showIcon message={message}></Alert>
            </motion.div>
            <Form form={form} layout="vertical" name="register-form" onFinish={onSignUp}>
                <Form.Item
                    name="ownerName"
                    label="Name"
                    rules={rules.ownerName}
                    hasFeedback
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    name="orgName"
                    label="Organization Name"
                    rules={rules.orgName}
                    hasFeedback
                >
                    <Input />
                </Form.Item>
                <Form.Item
                    name="email"
                    label="Email"
                    rules={rules.email}
                    hasFeedback
                >
                    <Input prefix={<MailOutlined className="text-primary" />} />
                </Form.Item>
                <Form.Item
                    name="password"
                    label="Password"
                    rules={rules.password}
                    hasFeedback
                >
                    <Input.Password prefix={<LockOutlined className="text-primary" />} />
                </Form.Item>
                <Form.Item
                    name="confirm"
                    label="Confirm Password"
                    rules={rules.confirm}
                    hasFeedback
                >
                    <Input.Password prefix={<LockOutlined className="text-primary" />} />
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit" block loading={loading}>
                        Sign Up
                    </Button>
                </Form.Item>
            </Form>
        </>
    );
};

const mapStateToProps = ({ auth }) => {
    const { loading, message, showMessage, token, redirect } = auth;
    return { loading, message, showMessage, token, redirect };
};

const mapDispatchToProps = {
    signUp,
    showAuthMessage,
    hideAuthMessage,
    showLoading
};

export default connect(mapStateToProps, mapDispatchToProps)(RegisterForm);