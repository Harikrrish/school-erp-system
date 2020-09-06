import React, { Component, Fragment } from 'react';
import { Button, Modal } from '@material-ui/core';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import { ToastContainer } from 'react-toastify';
import './classtable.css';
import { MessageBox } from '../messageBox/messageBox';

class ClassTable extends Component {

  constructor(props) {
    super(props);
    this.state = {
      rows: this.props.rows,
      isCreateClassModalOpen: false,
      isClassValid: false,
      isSectionValid: false,
      class: '',
      section: '',
      isEditClicked: false,
      classId: 0,
      isDeletePopupOpen: false
    }
  }

  componentWillReceiveProps(props) {
    this.setState({ rows: props.rows });
  }

  onClickCreateClass() {
    this.setState({ isCreateClassModalOpen: true });
  }

  closeModal() {
    this.setState({ isCreateClassModalOpen: false });
  }

  onChangeInputFields(e, input) {
    let value = e.target.value;
    switch (input) {
      case 'class':
        {
          let isClassValid = isNaN(parseInt(value)) ? false : true;
          this.setState({ class: value, isClassValid });
          break;
        }
      case 'section': {
        let isSectionValid = value && value.length > 0 ? true : false;
        this.setState({ section: value, isSectionValid });
        break;
      }
    }
  }

  handleCreate() {
    let body = { class: this.state.class, section: this.state.section };
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    };
    let url = 'http://localhost:5000';
    fetch(`${url}/createClass`, requestOptions)
      .then(response => response.json())
      .then((response) => {
        if (response.data) {
          MessageBox(response.message, 'Success');
          this.setState({ isCreateClassModalOpen: false, class: '', section: '', isClassValid: false, isSectionValid: false });
          this.props.classResponseCallback();
        }
        else {
          MessageBox(response.message, 'Error');
        }
      }).catch(err => console.log(err));
  }

  handleUpdate() {
    let body = { class: this.state.class, section: this.state.section };
    const requestOptions = {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    };
    let url = 'http://localhost:5000';
    fetch(`${url}/${this.state.classId}`, requestOptions)
      .then(response => response.json())
      .then((response) => {
        if (response.data) {
          this.setState({ classId: 0, isCreateClassModalOpen: false, class: '', section: '', isEditClicked: false, isClassValid: false, isSectionValid: false });
          MessageBox(response.message, 'Success');
          this.props.classResponseCallback();
        }
        else {
          MessageBox(response.message, 'Error');
        }
      }).catch(err => console.log(err));
  }

  onClickEdit(row) {
    this.setState({ isCreateClassModalOpen: true, class: row.standard, section: row.section, isEditClicked: true, isClassValid: true, isSectionValid: true, classId: row._id });
  }

  handleCloseCreateModal() {
    this.setState({ isCreateClassModalOpen: false, isEditClicked: false, classId: 0 });
  }

  onClickDelete(row) {
    this.setState({ isDeletePopupOpen: true, classId: row._id });
  }

  handleDelete() {
    const requestOptions = {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' }
    };
    let url = 'http://localhost:5000';
    fetch(`${url}/${this.state.classId}`, requestOptions)
      .then(response => response.json())
      .then((response) => {
        if (response.data) {
          MessageBox(response.message, 'Success');
          this.setState({ classId: 0, isDeletePopupOpen: false });
          this.props.classResponseCallback();
        }
        else {
          MessageBox(response.message, 'Error');
        }
      }).catch(err => console.log(err));
  }

  onCloseDelete() {
    this.setState({ isDeletePopupOpen: false });
  }

  render() {
    return (
      <Fragment>
        <div className="class-table">
          <Button onClick={this.onClickCreateClass.bind(this)} >Create Class</Button>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Actions</TableCell>
                  <TableCell>Class</TableCell>
                  <TableCell>Section</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {this.state.rows && this.state.rows.length > 0 ? this.state.rows.map((row) => (
                  <TableRow key={row.standard}>
                    <TableCell>
                      <Button onClick={() => { this.onClickEdit(row) }}>Edit</Button>
                      <Button onClick={() => { this.onClickDelete(row) }}>Delete</Button>
                    </TableCell>
                    <TableCell >{row.standard}</TableCell>
                    <TableCell>{row.section}</TableCell>
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
            open={this.state.isCreateClassModalOpen}
            onClose={() => this.closeModal()}
            size='large'>
            <div className="modalClass">
              <div>
                {this.state.isEditClicked ? <h4 className="createClass">Edit Class</h4> :
                  <h4 className="createClass">Create Class</h4>}
              </div>
              <div className="inputDiv">
                <label>Standard</label>
                <input className="inputClassPass" maxLength='2' placeholder="Enter standard" onChange={(e) => { this.onChangeInputFields(e, 'class') }} value={this.state.class} />
              </div>
              <div className="inputDiv">
                <label>Section</label>
                <input className="inputClassPass1" maxLength='1' placeholder="Enter section" onChange={(e) => { this.onChangeInputFields(e, 'section') }} value={this.state.section} />
              </div>
              <div className="btn-seleection">
                {this.state.isEditClicked ?
                  <Button
                    disabled={!this.state.isClassValid || !this.state.isSectionValid}
                    onClick={this.handleUpdate.bind(this)}>Update</Button> :
                  <Button
                    disabled={!this.state.isClassValid || !this.state.isSectionValid}
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
                <h4 className="deleteClass">Are you sure you want to delete the class?</h4>
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

export default ClassTable;