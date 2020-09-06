import React, { Component } from 'react';
import { Button } from '@material-ui/core';
import ClassTable from '../tableData/classtable';
import AcademicYearTable from '../tableData/academicYear';
import StudentTable from '../tableData/studenttable';
import StudentDetails from '../studentDetails/studentDetails';
import './landingPage.css';
import { MessageBox } from '../messageBox/messageBox';
import { ToastContainer } from 'react-toastify';

class LandingPage extends Component {

    constructor() {
        super();
        this.state = {
            activePage: 'Classes',
            classRows: [],
            academicRows: [],
            studentRows: [],
            roleName: localStorage.getItem('roleName')
        }
    }

    componentWillMount() {
        this.getClasses();
    }

    getClasses() {
        const requestOptions = {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
        };
        let url = 'http://localhost:5000';
        fetch(`${url}/getAllClasses`, requestOptions)
            .then(response => response.json())
            .then((response) => {
                if (response.success) {
                    MessageBox(response.message, 'Success');
                    this.setState({ classRows: response.data });
                }
                else {
                    MessageBox(response.message, 'Error');
                }
            }).catch(err => console.log(err));
    }

    getStudents() {
        const requestOptions = {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
        };
        let url = 'http://localhost:5000';
        fetch(`${url}/getAllStudents`, requestOptions)
            .then(response => response.json())
            .then((response) => {
                if (response.success) {
                    MessageBox(response.message, 'Success');
                    this.setState({ studentRows: response.data });
                }
                else {
                    MessageBox(response.message, 'Error');
                }
            }).catch(err => console.log(err));
    }

    getAcademic() {
        const requestOptions = {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
        };
        let url = 'http://localhost:5000';
        fetch(`${url}/getAllAcademicYears`, requestOptions)
            .then(response => response.json())
            .then((response) => {
                if (response.success) {
                    MessageBox(response.message, 'Success');
                    this.setState({ academicRows: response.data });
                }
                else {
                    MessageBox(response.message, 'Error');
                }
            }).catch(err => console.log(err));
    }

    classResponseCallback() {
        this.getClasses();
    }

    academicResponsecallback() {
        this.getAcademic();
    }

    studentResponseCallback() {
        this.getStudents();
    }

    onClickTabs(activePage) {
        switch (activePage) {
            case 'Classes': {
                this.getClasses();
                break;
            }
            case 'Academic': {
                this.getAcademic();
                break;
            }
            case 'Students': {
                this.getStudents();
                break;
            }
        }
        this.setState({ activePage });
    }

    render() {

        return (
            <div>
                {this.state.roleName === 'Admin' ?
                    <div className="container">
                        <div className="navbar">
                            <div className="navbar-left">
                            <Button>Thilash School</Button>
                            </div>
                            <div className="navbar-right">
                                <Button className={this.state.activePage === 'Classes' ? "active-page": ""} onClick={() => { this.onClickTabs('Classes') }}>Classes</Button>
                                <Button className={this.state.activePage === 'Academic' ? "active-page": ""} onClick={() => { this.onClickTabs('Academic') }}>Academic Year</Button>
                                <Button className={this.state.activePage === 'Students' ? "active-page": ""} onClick={() => { this.onClickTabs('Students') }}>Students</Button>
                            </div>
                        </div>
                        {this.state.activePage === 'Classes' ?
                            <ClassTable rows={this.state.classRows} classResponseCallback={this.classResponseCallback.bind(this)} /> :
                            this.state.activePage === 'Academic' ?
                                <AcademicYearTable rows={this.state.academicRows} classRows={this.state.classRows} academicResponsecallback={this.academicResponsecallback.bind(this)} /> :
                                <StudentTable rows={this.state.studentRows} classRows={this.state.classRows} studentResponseCallback={this.studentResponseCallback.bind(this)} />
                        }
                    </div>
                    :
                    <div>
                        <StudentDetails />
                    </div>}
                <ToastContainer />
            </div>
        );
    }
}







export default LandingPage;