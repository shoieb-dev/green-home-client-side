import React from 'react';
import { Col, ButtonGroup, Button, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import './Dashboard.css';

const Dashboard = () => {
    return (
        <div className="body">
            <Row>
                <Col xs={6} sm={3} md={3} lg={3} className="bg-light drawer">
                    <h2 className="bg-success text-white">drawer</h2>

                    <ButtonGroup vertical>
                        <Button as={Link} to="/mybookings">My Bookings</Button>
                        <Button as={Link} to="/mybookings">My Bookings</Button>
                        <Button as={Link} to="/mybookings">My Bookings</Button>
                    </ButtonGroup>

                </Col>
                <Col xs={6} sm={9} md={9} lg={9}>
                    <h2 className="bg-success text-white">Dashboard</h2>
                </Col>
            </Row>
        </div>
    );
};

export default Dashboard;