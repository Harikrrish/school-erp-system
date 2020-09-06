import React, { Component, Fragment } from 'react';
import { Button, Modal } from '@material-ui/core';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';
import moment from 'moment';
import './classtable.css';
import { ToastContainer } from 'react-toastify';
import { MessageBox } from '../messageBox/messageBox';

class StudentTable extends Component {

    constructor(props) {
        super(props);
        this.state = {
            rows: this.props.rows,
            classRows: this.props.classRows,
            selectedClassRow: '',
            name: '',
            isNameValid: false,
            parentName: '',
            isParentNameValid: false,
            parentMobile: '',
            isParentMobileValid: false,
            parentEmail: '',
            isParentEmailValid: false,
            parentPassword: '',
            isParentPasswordValid: false,
            selectedDate: new Date(),
            isPaymentModalEnable: false,
            termFees: 0,
            isTermFeesValid: false,
            selectedStudentId: 0,
            isParentModalEnable: false,
            parentDetails: {}
        }
    }

    componentWillReceiveProps(props) {
        this.setState({ rows: props.rows });
    }

    onClickStudent() {
        this.setState({ isCreateStudentModalOpen: true });
    }

    onChangeInputFields(e, input) {
        let value = e.target.value;
        switch (input) {
            case 'name': {
                let isNameValid = value && value.length > 0 ? true : false;
                this.setState({ name: value, isNameValid });
                break;
            }
            case 'parentName': {
                let isParentNameValid = value && value.length > 0 ? true : false;
                this.setState({ parentName: value, isParentNameValid });
                break;
            }
            case 'parentMobile': {
                let mobile = Number(value);
                let isParentMobileValid = (isNaN(mobile) || (value && value.length !== 10)) ? false : true;
                this.setState({ parentMobile: value, isParentMobileValid });
                break;
            }
            case 'parentEmail': {
                let isParentEmailValid = false;
                let emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                if (emailRegex.test(value)) {
                    isParentEmailValid = true;
                }
                this.setState({ parentEmail: value, isParentEmailValid });
                break;
            }
            case 'parentPassword': {
                let isParentPasswordValid = false;
                if (value && value.length >= 5) {
                    isParentPasswordValid = true;
                }
                this.setState({ parentPassword: value, isParentPasswordValid });
                break;
            }
            case 'termFees': {
                let isTermFeesValid = false;
                if (value && value > 0) {
                    isTermFeesValid = true;
                }
                this.setState({ termFees: value, isTermFeesValid });
                break;
            }
        }
    }

    handleCreate() {
        let classAndSection = this.state.selectedClassRow.split('th');
        let body = {
            name: this.state.name,
            class: Number(classAndSection[0]),
            section: classAndSection[1].replace(" ", ""),
            dob: this.state.selectedDate,
            parentName: this.state.parentName,
            parentEmail: this.state.parentEmail,
            parentMobile: this.state.parentMobile,
            parentPassword: this.state.parentPassword
        };
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        };
        let url = 'https://school-erp-system-api.herokuapp.com';
        fetch(`${url}/createStudent`, requestOptions)
            .then(response => response.json())
            .then((response) => {
                if (response.data) {
                    MessageBox(response.message, 'Success');
                    this.setState({ isCreateStudentModalOpen: false, name: '', selectedClassRow: '', parentName: '', parentEmail: '', parentMobile: '', parentPassword: '', isNameValid: false, isParentEmailValid: false, isParentMobileValid: false, isParentNameValid: false, isParentPasswordValid: false });
                    this.props.studentResponseCallback();
                }
                else {
                    MessageBox(response.message, 'Error');
                }
            }).catch(err => console.log(err));
    }

    handleCloseCreateModal() {
        this.setState({ isCreateStudentModalOpen: false });
    }

    handleSelectClass(e) {
        this.setState({ selectedClassRow: e.target.value });
    }

    handleDateChange(e) {
        this.setState({ selectedDate: e.target.value });
    }

    onClickSetPayment(row) {
        this.setState({ isPaymentModalEnable: true, selectedStudentId: row._id });
    }

    handleClosePaymentModal() {
        this.setState({ isPaymentModalEnable: false, isTermFeesValid: false, termFees: 0, selectedStudentId: 0 })
    }

    handleCreatePayment() {
        let body = { termFees: this.state.termFees };
        const requestOptions = {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        };
        let url = 'https://school-erp-system-api.herokuapp.com';
        fetch(`${url}/setPayment/${this.state.selectedStudentId}`, requestOptions)
            .then(response => response.json())
            .then((response) => {
                if (response.data) {
                    MessageBox(response.message, 'Success');
                    this.setState({ isPaymentModalEnable: false, isTermFeesValid: false, termFees: 0, selectedStudentId: 0 });
                    this.props.studentResponseCallback();
                }
                else {
                    MessageBox(response.message, 'Error');
                }
            }).catch(err => console.log(err));
    }

    onClickViewParent(row) {
        let parentId = row.parentId;
        const requestOptions = {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
        };
        let url = 'https://school-erp-system-api.herokuapp.com';
        fetch(`${url}/getParent/${parentId}`, requestOptions)
            .then(response => response.json())
            .then((response) => {
                if (response.success) {
                    MessageBox(response.message, 'Success');
                    this.setState({ isParentModalEnable: true, parentDetails: response.data });
                }
                else {
                    MessageBox(response.message, 'Error');
                }
            }).catch(err => console.log(err));
    }

    handleCloseParentModal() {
        this.setState({ isParentModalEnable: false, parentDetails: {} });
    }

    render() {
        return (
            <Fragment>
                <div className="class-table">
                    <Button color="primary" onClick={this.onClickStudent.bind(this)} >Create Student</Button>
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Name</TableCell>
                                    <TableCell>Class</TableCell>
                                    <TableCell>Section</TableCell>
                                    <TableCell>Date Of Birth</TableCell>
                                    <TableCell>Due Amount</TableCell>
                                    <TableCell>Total Paid Amount</TableCell>
                                    <TableCell>Actions</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {this.state.rows && this.state.rows.length > 0 ? this.state.rows.map((row) => (
                                    <TableRow key={row.standard}>
                                        <TableCell >{row.name}</TableCell>
                                        <TableCell>{row.standard}</TableCell>
                                        <TableCell>{row.section}</TableCell>
                                        <TableCell>{moment(new Date(row.dob)).format('DD/MM/YYYY')}</TableCell>
                                        <TableCell>{row.dueAmount}</TableCell>
                                        <TableCell>{row.totalPaidAmount}</TableCell>
                                        <TableCell>
                                            <Button onClick={() => { this.onClickViewParent(row) }}>View Parent Details</Button>
                                            <Button onClick={() => { this.onClickSetPayment(row) }}>Set Payment</Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                                    :
                                    <TableRow>
                                        <p>No Records Found</p>
                                    </TableRow>
                                }
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <Modal
                        open={this.state.isCreateStudentModalOpen}
                        size='large'>
                        <div className="studentModalClass">
                            <div>
                                <h4 className="createClass">Create Student</h4>
                            </div>
                            <div className="inputDiv">
                                <label>Name</label>
                                <input className="inputClassPass" maxLength='15' placeholder="Enter Name" onChange={(e) => { this.onChangeInputFields(e, 'name') }} value={this.state.name} />
                            </div>
                            <div className="inputDiv">
                                <label>Select DOB</label>

                                <TextField
                                    className="inputClassPass"
                                    type="date"
                                    defaultValue="2020-09-06"
                                    onChange={this.handleDateChange.bind(this)}
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                />
                            </div>
                            <div className="inputDiv">
                                <label>Select Class</label>
                                <Select
                                    className="inputClassPass"
                                    value={this.state.selectedClassRow}
                                    onChange={this.handleSelectClass.bind(this)}
                                >
                                    {this.state.classRows.map((row) => (
                                        <MenuItem key={`${row.standard}th ${row.section}`} value={`${row.standard}th ${row.section}`}>
                                            {`${row.standard}th ${row.section}`}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </div>
                            <h4 style={{ paddingLeft: "5%" }}>Parent Details</h4>
                            <div className="inputDiv">
                                <label>Parent Name</label>
                                <input className="inputClassPass" maxLength='15' placeholder="Enter Name" onChange={(e) => { this.onChangeInputFields(e, 'parentName') }} value={this.state.parentName} />
                            </div>
                            <div className="inputDiv">
                                <label>Mobile</label>
                                <input className="inputClassPass" maxLength='10' placeholder="Enter Name" onChange={(e) => { this.onChangeInputFields(e, 'parentMobile') }} value={this.state.mobile} />
                            </div>
                            <div className="inputDiv">
                                <label>Email</label>
                                <input className="inputClassPass" maxLength='25' placeholder="Enter Name" onChange={(e) => { this.onChangeInputFields(e, 'parentEmail') }} value={this.state.email} />
                            </div>
                            <div className="inputDiv">
                                <label>Password to Login</label>
                                <input className="inputClassPass" type="password" placeholder="Enter password" onChange={(e) => { this.onChangeInputFields(e, 'parentPassword') }} />
                            </div>
                            <div className="btn-seleection">
                                <Button
                                    disabled={!this.state.isNameValid ||
                                        !this.state.isParentNameValid ||
                                        !this.state.isParentEmailValid ||
                                        !this.state.isParentMobileValid ||
                                        !this.state.isParentPasswordValid ||
                                        !this.state.selectedClassRow}
                                    onClick={this.handleCreate.bind(this)}>Create</Button>
                                <Button onClick={this.handleCloseCreateModal.bind(this)}>Cancel</Button>
                            </div>
                        </div>
                    </Modal>
                    <Modal
                        open={this.state.isPaymentModalEnable}
                        size='large'>
                        <div className="student-modalClass">
                            <div className="inputDiv">
                                <label>Term Fees</label>
                                <input className="inputClassPass" type="number" placeholder="Enter Fees Amount" onChange={(e) => { this.onChangeInputFields(e, 'termFees') }} value={this.state.termFees} />
                            </div>
                            <div className="btn-seleection">
                                <Button
                                    disabled={!this.state.isTermFeesValid}
                                    onClick={this.handleCreatePayment.bind(this)}>Create Payment</Button>
                                <Button onClick={this.handleClosePaymentModal.bind(this)}>Cancel</Button>
                            </div>
                        </div>
                    </Modal>
                    <Modal
                        open={this.state.isParentModalEnable}
                        size='large'>
                        <div className="studentDetails">
                            <div className="inputDiv">
                                <label>Parent Name -</label>
                                <label>{this.state.parentDetails.name}</label>
                            </div>
                            <div className="inputDiv">
                                <label>Parent Email -</label>
                                <label>{this.state.parentDetails.email}</label>
                            </div>
                            <div className="inputDiv">
                                <label>Parent Mobile -</label>
                                <label>{this.state.parentDetails.mobile}</label>
                            </div>
                            <div className="inputDiv">
                                <Button onClick={this.handleCloseParentModal.bind(this)}>Cancel</Button>
                            </div>
                        </div>
                    </Modal>
                    <ToastContainer />
                </div>
            </Fragment >
        )
    }
}

export default StudentTable;