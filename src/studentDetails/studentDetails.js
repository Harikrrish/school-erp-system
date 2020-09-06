import React, { Component } from 'react';
import { Button, Modal } from '@material-ui/core';
import moment from 'moment';
import { MessageBox } from '../messageBox/messageBox';
import './studentDetails.css';
import { ToastContainer } from 'react-toastify';

class StudentDetails extends Component {
    constructor() {
        super();
        this.state = {
            parentId: localStorage.getItem('userId'),
            studentDetails: {},
            isPaymentModalEnable: false
        }
    }

    componentDidMount() {
        this.getStudentDetails();
    }

    getStudentDetails() {
        let parentId = this.state.parentId;
        const requestOptions = {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
        };
        let url = 'https://school-erp-system-api.herokuapp.com';
        fetch(`${url}/getStudentDetails/${parentId}`, requestOptions)
            .then(response => response.json())
            .then((response) => {
                if (response.success) {
                    MessageBox(response.message, 'Success');
                    this.setState({ studentDetails: response.data });
                }
                else {
                    MessageBox(response.message, 'Error');
                }
            }).catch(err => console.log(err));
    }

    payFeesAmount() {
        let studentId = this.state.studentDetails._id;
        const requestOptions = {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
        };
        let url = 'https://school-erp-system-api.herokuapp.com';
        fetch(`${url}/payFeesAmount/${studentId}`, requestOptions)
            .then(response => response.json())
            .then((response) => {
                if (response.data) {
                    MessageBox(response.message, 'Success');
                    this.setState({ isPaymentModalEnable: false });
                    this.getStudentDetails();
                }
                else {
                    MessageBox(response.message, 'Error');
                }
            }).catch(err => console.log(err));
    }

    payFeesButtonClicked() {
        this.setState({ isPaymentModalEnable: true });
    }

    handleModalCancel() {
        this.setState({ isPaymentModalEnable: false });
    }

    render() {
        return (<div className="studentDetails">
            <div className="student-label">
                <label>Name </label>
                <div className="student-details">{this.state.studentDetails.name}</div>
            </div>
            <div className="student-label">
                <label>Date of Birth </label>
                <div className="student-details">{moment(new Date(this.state.studentDetails.dob)).format('DD/MM/YYYY')}</div>
            </div>
            <div className="student-label">
                <label>Class </label>
                <div className="student-details">{this.state.studentDetails.standard}</div>
            </div>
            <div className="student-label">
                <label>Section </label>
                <div className="student-details">{this.state.studentDetails.section}</div>
            </div>
            <div className="student-label">
                <label>Pending Amount </label>
                <div className="student-details">{this.state.studentDetails.dueAmount > 0 ? this.state.studentDetails.dueAmount : 'NILL'}</div>
            </div>
            <div className="btn-seleection">
                <Button onClick={this.payFeesButtonClicked.bind(this)}>Pay Fees</Button>
            </div>

            <Modal
                open={this.state.isPaymentModalEnable}>
                <div className="student-fees-modal">
                    <label>Term Fees </label>
                    <label className="student-fees">{this.state.studentDetails.dueAmount}</label>
                    <div className="btn-seleection">
                        <Button onClick={this.payFeesAmount.bind(this)}>{`PAY ${this.state.studentDetails.dueAmount}`}</Button>
                        <Button onClick={this.handleModalCancel.bind(this)}>Cancel</Button>
                    </div>
                </div>
            </Modal>
            <ToastContainer />

        </div>)
    }
}

export default StudentDetails;