import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Button, Form, Input, Divider, Alert } from 'antd';
import { MailOutlined, LockOutlined } from '@ant-design/icons';
import PropTypes from 'prop-types';
import { GoogleSVG, FacebookSVG } from 'assets/svg/icon';
import CustomIcon from 'components/util-components/CustomIcon';
import axios from 'axios';
import {
    signIn,
    showLoading,
    showAuthMessage,
    hideAuthMessage,
    signInWithGoogle,
    signInWithFacebook
} from 'store/slices/authSlice';
import { useNavigate } from 'react-router-dom';
import { motion } from "framer-motion";

export const LoginForm = props => {
    const navigate = useNavigate();

    const {
        otherSignIn,
        showForgetPassword,
        hideAuthMessage,
        onForgetPasswordClick,
        showLoading,
        signInWithGoogle,
        signInWithFacebook,
        extra,
        signIn,
        token,
        loading,
        redirect,
        showMessage,
        message,
        allowRedirect = true
    } = props;

    const initialCredential = {
        email: '',
        password: ''
    };

    const onLogin = async (values) => {
        showLoading();
        try {
            const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/login`, {
                email: values.email,
                password: values.password
            });

            // Store token in localStorage
            localStorage.setItem('token', response.data.token);

            // Set default authorization header for future requests
            axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;

            // Call Redux signIn action with the response data
            signIn(response.data);

            if (allowRedirect) {
                navigate(redirect || '/dashboard');
            }
        } catch (error) {
            props.showAuthMessage(error.response?.data?.message || 'Invalid credentials');
        }
    };

    const onGoogleLogin = () => {
        showLoading();
        signInWithGoogle();
    };

    const onFacebookLogin = () => {
        showLoading();
        signInWithFacebook();
    };

    useEffect(() => {
        // Redirect if token is available and allowRedirect is true
        if (token !== null && allowRedirect) {
            navigate(redirect || '/dashboard');
        }

        // Hide error message after 3 seconds
        if (showMessage) {
            const timer = setTimeout(() => hideAuthMessage(), 3000);
            return () => {
                clearTimeout(timer);
            };
        }
    }, [token, showMessage, redirect, hideAuthMessage, navigate, allowRedirect]);

    const renderOtherSignIn = (
        <div>
            <Divider>
                <span className="text-muted font-size-base font-weight-normal">or connect with</span>
            </Divider>
            <div className="d-flex justify-content-center">
                <Button
                    onClick={() => onGoogleLogin()}
                    className="mr-2"
                    disabled={loading}
                    icon={<CustomIcon svg={GoogleSVG} />}
                >
                    Google
                </Button>
                <Button
                    onClick={() => onFacebookLogin()}
                    icon={<CustomIcon svg={FacebookSVG} />}
                    disabled={loading}
                >
                    Facebook
                </Button>
            </div>
        </div>
    );

    return (
        <>
            <motion.div
                initial={{ opacity: 0, marginBottom: 0 }}
                animate={{
                    opacity: showMessage ? 1 : 0,
                    marginBottom: showMessage ? 20 : 0
                }}
            >
                <Alert type="error" showIcon message={message}></Alert>
            </motion.div>
            <Form
                layout="vertical"
                name="login-form"
                initialValues={initialCredential}
                onFinish={onLogin}
            >
                <Form.Item
                    name="email"
                    label="Email"
                    rules={[
                        {
                            required: true,
                            message: 'Please input your email',
                        },
                        {
                            type: 'email',
                            message: 'Please enter a valid email!'
                        }
                    ]}
                >
                    <Input prefix={<MailOutlined className="text-primary" />} />
                </Form.Item>
                <Form.Item
                    name="password"
                    label={showForgetPassword ? (
                        <div className="d-flex justify-content-between w-100 align-items-center">
                            <span>Password</span>
                            <span
                                onClick={onForgetPasswordClick}
                                className="cursor-pointer font-size-sm font-weight-normal text-muted"
                            >
                                Forget Password?
                            </span>
                        </div>
                    ) : 'Password'}
                    rules={[
                        {
                            required: true,
                            message: 'Please input your password',
                        }
                    ]}
                >
                    <Input.Password prefix={<LockOutlined className="text-primary" />} />
                </Form.Item>
                <Form.Item>
                    <Button type="primary" htmlType="submit" block loading={loading}>
                        Sign In
                    </Button>
                </Form.Item>
                {otherSignIn ? renderOtherSignIn : null}
                {extra}
            </Form>
        </>
    );
};

LoginForm.propTypes = {
    otherSignIn: PropTypes.bool,
    showForgetPassword: PropTypes.bool,
    extra: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.element
    ]),
};

LoginForm.defaultProps = {
    otherSignIn: true,
    showForgetPassword: false
};

const mapStateToProps = ({ auth }) => {
    const { loading, message, showMessage, token, redirect } = auth;
    return { loading, message, showMessage, token, redirect };
};

const mapDispatchToProps = {
    signIn,
    showAuthMessage,
    showLoading,
    hideAuthMessage,
    signInWithGoogle,
    signInWithFacebook
};

export default connect(mapStateToProps, mapDispatchToProps)(LoginForm);