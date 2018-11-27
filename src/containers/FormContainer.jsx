import React, { Component } from 'react';

/* Import Components */
import Input from '../components/Input';
import TextArea from '../components/TextArea';
import Button from '../components/Button'
import validator from 'validator';

class FormContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      newUser: {
        firstname: '',
        lastname: '',
        address: '',
        zipcode: '',
        city: '',
        state: '',
        email: '',
        phone: '',
        notes: ''

      },
    }

    this.handleTextArea = this.handleTextArea.bind(this);
    this.handleFormSubmit = this.handleFormSubmit.bind(this);
    this.handleClearForm = this.handleClearForm.bind(this);
    this.handleInput = this.handleInput.bind(this);
  }

  // React objects handlers
  handleInput(e) {
    let value = e.target.value;
    let name = e.target.name;
    this.setState(prevState => ({
      newUser:
      {
        ...prevState.newUser, [name]: value
      }
    }), () => console.debug(this.state.newUser))
  }

  handleTextArea(e) {
    console.log("Inside handleTextArea");
    let value = e.target.value;
    this.setState(prevState => ({
      newUser: {
        ...prevState.newUser, notes: value
      }
    }), () => console.debug(this.state.newUser))
  }

  checkErrorAdvance(userData, onSuccess, onError) {
    const errors = this.checkError(userData)
    if (errors.length == 0) {
      const addressLine1 = encodeURIComponent(userData.address)
      const addressLine2 = encodeURIComponent(userData.city + ' , ' + userData.state + ' ' + userData.zipcode)
      fetch('https://cors-anywhere.herokuapp.com/http://www.yaddress.net/api/address?AddressLine1=' + addressLine1 + '&AddressLine2=' + addressLine2, {
        method: "GET",
        headers: {
          'Accept': 'application/json',
        },
      }).then(response => {
        response.json().then(data => {
          console.log("Successful" + JSON.stringify(data));
          if (data.ErrorCode == 0) {
            onSuccess()
          } else {
            errors.push(data.ErrorMessage)
            onError(errors)
          }
        })
      })
    }
    else {
      onError(errors)
    }
  }

  // Checking validiations of the input data
  checkError(userData) {
    var errors = []
    if (!validator.isAscii(userData.firstname)) {
      errors.push('first name is not valid')
    }
    if (!validator.isAscii(userData.city)) {
      errors.push('city is not valid')
    }

    if (!validator.isAscii(userData.state)) {
      errors.push('state is not valid')
    }

    if (userData.notes > 500) {
      errors.push('special notes exceeded the maximum letters')
    }

    if (userData.phone.length === 0) {
      errors.push('phone number is not valid')
    }
    if (!validator.isEmail(userData.email)) {
      errors.push('email not is valid')
    }
    return errors
  }
  handleFormSubmit(e) {
    e.preventDefault();
    let userData = this.state.newUser;
    this.checkErrorAdvance(userData, () => {
      fetch('http://snappyserver-env.bvs7eikvs5.us-east-2.elasticbeanstalk.com/tasks', {
        method: "POST",
        body: JSON.stringify(userData),
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
      }).then(response => {
        response.json().then(data => {
          console.log("Successful" + data);
          this.handleClearForm(e)
          alert('added successfuly')
        })
      })
    }, (errors) => {
      alert(errors)
    })
  }

  handleClearForm(e) {
    e.preventDefault();
    this.setState({
      newUser: {
        firstname: '',
        lastname: '',
        address: '',
        zipcode: '',
        city: '',
        state: '',
        email: '',
        phone: '',
        notes: ''
      }
    })
  }

  //Create the UI
  render() {
    return (

      <form className="container-fluid" onSubmit={this.handleFormSubmit}>

        <Input inputType={'text'}
          title={'First Name'}
          name={'firstname'}
          value={this.state.newUser.firstname}
          placeholder={'Enter your First name'}
          handleChange={this.handleInput}

        /> {/* first name of the user */}
        <Input inputType={'text'}
          title={'Last Name'}
          name={'lastname'}
          value={this.state.newUser.lastname}
          placeholder={'Enter your Last name'}
          handleChange={this.handleInput}

        /> {/* last name of the user */}
        <Input inputType={'text'}
          title={'Address (street, floor, apartment, etc.)'}
          name={'address'}
          value={this.state.newUser.address}
          placeholder={'Enter your Address'}
          handleChange={this.handleInput}

        /> {/* address of the user */}
        <Input inputType={'number'}
          title={'Zip code'}
          name={'zipcode'}
          value={this.state.newUser.zipcode}
          placeholder={'Enter your Zip code'}
          handleChange={this.handleInput}
        /> {/* zipcode of the user */}

        <Input inputType={'text'}
          title={'City'}
          name={'city'}
          value={this.state.newUser.city}
          placeholder={'Enter your City'}
          handleChange={this.handleInput}
        /> {/* city of the user */}
        <Input inputType={'text'}
          title={'State'}
          name={'state'}
          value={this.state.newUser.state}
          placeholder={'Enter your state'}
          handleChange={this.handleInput}
        /> {/* state of the user */}
        <Input inputType={'email'}
          title={'Email address'}
          name={'email'}
          value={this.state.newUser.email}
          placeholder={'Enter your email address'}
          handleChange={this.handleInput}
        /> {/* email of the user */}
        <Input inputType={'text'}
          title={'Phone number'}
          name={'phone'}
          value={this.state.newUser.phone}
          placeholder={'Enter your phone number'}
          handleChange={this.handleInput}
        /> {/* phone of the user */}

        <TextArea
          title={'Special notes (up to 500 letters)'}
          rows={10}
          value={this.state.newUser.notes}
          name={'notes'}
          handleChange={this.handleTextArea}
          placeholder={'add your notes'} />{/* notes */}

        <Button
          action={this.handleFormSubmit}
          type={'primary'}
          title={'Submit'}
          style={buttonStyle}
        /> { /*Submit */}

        <Button
          action={this.handleClearForm}
          type={'secondary'}
          title={'Clear'}
          style={buttonStyle}
        /> {/* Clear the form */}

      </form>

    );
  }
}



const buttonStyle = {
  margin: '10px 10px 10px 10px'
}

export default FormContainer;