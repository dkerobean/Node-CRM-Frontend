import React, { useEffect, useState } from 'react';
import LoginForm from '../../components/LoginForm';
import { Card, Row, Col } from "antd";
import { useSelector } from 'react-redux';
import axios from 'axios';

const backgroundStyle = {
    backgroundImage: 'url(/img/others/img-17.jpg)',
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover'
};

const LoginOne = (props) => {
    const theme = useSelector(state => state.theme.currentTheme);
    const [users, setUsers] = useState([]);

    useEffect(() => {
        console.log("backend url", process.env.REACT_APP_BACKEND_URL);
        const fetchUsers = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/users`);
                setUsers(response.data);
                console.log('Fetched users:', response.data);
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };

        fetchUsers();
    }, []);

    return (
        <div className="h-100" style={backgroundStyle}>
            <div className="container d-flex flex-column justify-content-center h-100">
                <Row justify="center">
                    <Col xs={20} sm={20} md={20} lg={7}>
                        <Card>
                            <div className="my-4">
                                <div className="text-center">
                                    <img
                                        className="img-fluid"
                                        src={`/img/${theme === 'light' ? 'logo.png' : 'logo-white.png'}`}
                                        alt=""
                                    />
                                    <p>Don't have an account yet? <a href="/auth/register-1">Sign Up</a></p>
                                </div>
                                <Row justify="center">
                                    <Col xs={24} sm={24} md={20} lg={20}>
                                        <LoginForm {...props} />
                                    </Col>
                                </Row>
                            </div>
                        </Card>
                    </Col>
                </Row>
            </div>
        </div>
    );
};

export default LoginOne;