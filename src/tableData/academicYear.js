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
import Checkbox from '@material-ui/core/Checkbox';
import Input from '@material-ui/core/Input';
import ListItemText from '@material-ui/core/ListItemText';
import MenuItem from '@material-ui/core/MenuItem';
import './classtable.css';
import { ToastContainer } from 'react-toastify';
import { MessageBox } from '../messageBox/messageBox';

class AcademicYearTable extends Component {

    constructor(props) {
        super(props);
        this.state = {
            rows: this.props.rows,
            classRows: this.props.classRows,
            isCreateYearModalOpen: false,
            isYearValid: false,
            isClassesValid: false,
            year: '',
            section: '',
            isEditClicked: false,
            yearId: 0,
            isDeletePopupOpen: false,
            selectedClassRows: []
        }
    }

    componentWillReceiveProps(props) {
        this.setState({ rows: props.rows });
    }

    onClickCreateYear() {
        this.setState({ isCreateYearModalOpen: true });
    }

    onChangeInputFields(e, input) {
        let value = e.target.value;
        switch (input) {
            case 'year':
                {
                    let isYearValid = value ? true : false;
                    this.setState({ year: value, isYearValid });
                    break;
                }
        }
    }

    handleCreate() {
        var sectionAndClass = this.state.selectedClassRows.map(a => a.split('th'));
        let classes = [];
        sectionAndClass.map(a => {
            let classAndSection = { standard: Number(a[0]), section: a[1] };
            classes.push(classAndSection);
        })
        let body = { year: this.state.year, classes: classes };
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        };
        let url = 'https://school-erp-system-api.herokuapp.com';
        fetch(`${url}/createAcademicYear`, requestOptions)
            .then(response => response.json())
            .then((response) => {
                if (response.data) {
                    MessageBox(response.message, 'Success');
                    this.setState({ isCreateYearModalOpen: false, year: '', selectedClassRows: [], isYearValid: false, isClassesValid: false });
                    this.props.academicResponsecallback();
                }
                else {
                    MessageBox(response.message, 'Error');
                }
            }).catch(err => console.log(err));
    }

    handleUpdate() {
        var sectionAndClass = this.state.selectedClassRows.map(a => a.split('th'));
        let classes = [];
        sectionAndClass.map(a => {
            let classAndSection = { standard: Number(a[0]), section: a[1] };
            classes.push(classAndSection);
        })
        let body = { year: this.state.year, classes: classes };
        const requestOptions = {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        };
        let url = 'https://school-erp-system-api.herokuapp.com';
        fetch(`${url}/updateYear/${this.state.yearId}`, requestOptions)
            .then(response => response.json())
            .then((response) => {
                if (response.data) {
                    MessageBox(response.message, 'Success');
                    this.setState({ yearId: 0, isCreateYearModalOpen: false, year: '', selectedClassRows: [], isEditClicked: false, isYearValid: false, isClassesValid: false });
                    this.props.academicResponsecallback();
                }
                else {
                    MessageBox(response.message, 'Error');
                }
            }).catch(err => console.log(err));
    }

    onClickEdit(row) {
        let selectedClassRows = [];
        row.classes.map(a => {
            let classAndSection = `${a.standard}th ${a.section}`;
            selectedClassRows.push(classAndSection);
        });
        this.setState({ isCreateYearModalOpen: true, year: row.year, selectedClassRows: selectedClassRows, isEditClicked: true, isYearValid: true, isClassesValid: true, yearId: row._id });
    }

    handleCloseCreateModal() {
        this.setState({ isCreateYearModalOpen: false, isEditClicked: false, yearId: 0, selectedClassRows: [], year: '' });
    }

    onClickDelete(row) {
        this.setState({ isDeletePopupOpen: true, yearId: row._id });
    }

    handleDelete() {
        const requestOptions = {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' }
        };
        let url = 'https://school-erp-system-api.herokuapp.com';
        fetch(`${url}/updateYear/${this.state.yearId}`, requestOptions)
            .then(response => response.json())
            .then((response) => {
                if (response.data) {
                    MessageBox(response.message, 'Success');
                    this.setState({ yearId: 0, isDeletePopupOpen: false });
                    this.props.academicResponsecallback();
                }
                else {
                    MessageBox(response.message, 'Error');
                }
            }).catch(err => console.log(err));
    }

    onCloseDelete() {
        this.setState({ isDeletePopupOpen: false });
    }

    handleChangeClasses(event) {
        let selectedClassRows = event.target.value;
        this.setState({ selectedClassRows, isClassesValid: selectedClassRows && selectedClassRows.length > 0 });
    }

    render() {
        return (
            <Fragment>
                <div className="class-table">
                    <Button color="primary" onClick={this.onClickCreateYear.bind(this)} >Create Academic Year</Button>
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Actions</TableCell>
                                    <TableCell>Academic Year</TableCell>
                                    <TableCell>Classes & Sections</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {this.state.rows && this.state.rows.length > 0 ? this.state.rows.map((row) => (
                                    <TableRow key={row.year}>
                                        <TableCell>
                                            <Button onClick={() => { this.onClickEdit(row) }}>Edit</Button>
                                            <Button onClick={() => { this.onClickDelete(row) }}>Delete</Button>
                                        </TableCell>
                                        <TableCell >{row.year}</TableCell>
                                        <TableCell>{row.classes ? `${row.classes.map(a => `${a.standard}th ${a.section}`)}` : ''}</TableCell>
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
                        open={this.state.isCreateYearModalOpen}
                        size='large'>
                        <div className="modalClass">
                            <div>
                                {this.state.isEditClicked ? <h4 className="createClass">Edit Academic Year</h4> :
                                    <h4 className="createClass">Create Academic Year</h4>}
                            </div>
                            <div className="inputDiv">
                                <label>Academic Year</label>
                                <input className="inputClassPass" maxLength='15' placeholder="Enter standard" onChange={(e) => { this.onChangeInputFields(e, 'year') }} value={this.state.year} />
                            </div>

                            <div className="inputDiv">
                                <label>Select Class</label>
                                <Select
                                    className="inputClassPass1"
                                    multiple
                                    value={this.state.selectedClassRows}
                                    onChange={this.handleChangeClasses.bind(this)}
                                    input={<Input />}
                                    renderValue={(selected) => selected.join(', ')}
                                >
                                    {this.state.classRows.map((row) => (
                                        <MenuItem key={`${row.standard}th ${row.section}`} value={`${row.standard}th ${row.section}`}>
                                            <Checkbox checked={this.state.selectedClassRows.indexOf(`${row.standard}th ${row.section}`) > -1} />
                                            <ListItemText primary={`${row.standard}th ${row.section}`} />
                                        </MenuItem>
                                    ))}
                                </Select>
                            </div>
                            <div className="btn-seleection">
                                {this.state.isEditClicked ?
                                    <Button
                                        disabled={!this.state.isYearValid || !this.state.isClassesValid}
                                        onClick={this.handleUpdate.bind(this)}>Update</Button> :
                                    <Button
                                        disabled={!this.state.isYearValid || !this.state.isClassesValid}
                                        onClick={this.handleCreate.bind(this)}>Create</Button>}
                                <Button onClick={this.handleCloseCreateModal.bind(this)}>Cancel</Button>
                            </div>
                        </div>
                    </Modal>
                    <Modal
                        open={this.state.isDeletePopupOpen}
                        size='large'>
                        <div className="deleteModalClass">
                            <div>
                                <h4 className="deleteClass">Are you sure you want to delete the year?</h4>
                            </div>
                            <div className="btn-seleection">
                                <Button onClick={this.handleDelete.bind(this)}>Yes</Button>
                                <Button onClick={this.onCloseDelete.bind(this)}>No</Button>
                            </div>
                        </div>
                    </Modal>
                    <ToastContainer />
                </div>
            </Fragment>
        )
    }
}

export default AcademicYearTable;