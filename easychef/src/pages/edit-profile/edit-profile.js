import React, { useState, useEffect } from "react";
import './profile.css';

var accessToken = localStorage.getItem('access_token');
var host = 'http://127.0.0.1:8000'

async function handleEdit(profile, password1, password2, avi) {
  const formData = new FormData();
  formData.append('email', profile.email);
  formData.append('bio', profile.bio);
  formData.append('password1', password1);
  formData.append('password2', password2);
  formData.append('phone_num', profile.phone_num);
  formData.append('avi', avi);
  formData.append('first_name', profile.first_name);
  formData.append('last_name', profile.last_name);

  const response = await fetch('http://127.0.0.1:8000/social/profile/edit/', {
    method: 'POST',
    body: formData,
    headers: { 'Authorization': `Bearer ${accessToken}` }
  });
  if (!response.ok) {
    throw new Error(response.statusText);
  }
  const data = await response.json();
  return data;
}

function Profile() {
  const [data, setData] = useState(null);
  const [avi, setAvi] = useState("");
  const [password1, setPassword1] = useState("");
  const [password2, setPassword2] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [editSaved, setEditSaved] = useState("");

  useEffect(() => {

    fetch('http://127.0.0.1:8000/social/profile/own/', {
      method: 'GET',
      headers: { 'Authorization': `Bearer ${accessToken}` }
    })
      .then(response => response.json())
      .then(data => {
        setData({
          email: data.user.email,
          bio: data.profile.bio,
          phone_num: data.profile.phone_num,
          avi: data.profile.avi,
          first_name: data.user.first_name,
          last_name: data.user.last_name
        });
      })
      .catch(err => console.log('Request Failed', err));
      document.title="Edit profile"
  }, []);

  if (!data) {
    return <div>Login required</div>;
  }

  const handleFormSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await handleEdit(data, password1, password2, avi);
      setData({
        email: response.user.email,
        bio: response.profile.bio,
        phone_num: response.profile.phone_num,
        avi: response.profile.avi,
        first_name: response.user.first_name,
        last_name: response.user.last_name
      });
      setEditSaved('Changes Saved');

    } catch (error) {
      setErrorMessage('Passwords do not match');
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setData({ ...data, [name]: value });
  };

  return (
    <div className="container">
      <div className="card-form">
        <div className="card-form-avatar">
          {<img src={host + data.avi} alt="Avatar" className="img-circle" />}
        </div>
        <div className="card-form-content">
          <div className="form-row">
            <div className="form-group input-inline">
              <label>First Name:</label>
              <input type="text" name="first_name" defaultValue={data.first_name} onChange={handleInputChange} />
            </div>
            <div className="form-group input-inline">
              <label>Last Name:</label>
              <input type="text" name="last_name" defaultValue={data.last_name} onChange={handleInputChange} />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Bio:</label>
              <textarea name="bio" defaultValue={data.bio} onChange={handleInputChange} />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group input-inline">
              <label>Email:</label>
              <input type="email" name="email" defaultValue={data.email} onChange={handleInputChange} />
            </div>
            <div className="form-group input-inline">
              <label>Phone Number:</label>
              <input type="text" name="phone_num" defaultValue={data.phone_num} onChange={handleInputChange} />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group input-inline">
              <label>New Password:</label>
              <input type="password" onChange={(e) => setPassword1(e.target.value)} />
              {errorMessage && <div className="error"> {errorMessage} </div>}
            </div>
            <div className="form-group input-inline">
              <label>Confirm Password:</label>
              <input type="password" onChange={(e) => setPassword2(e.target.value)} />
            </div>
          </div>
          <div className="form-row">
            <label>
              Avatar:
              <div class="custom-file-upload">
                <input type="file" accept="image/*" onChange={(e) => setAvi(e.target.files[0])} placeholder="Select an image file" />
                Choose File
              </div>
              <span>
                {avi ? avi.name : ""}
              </span>
            </label>
          </div>
          <div className="form-row">
            <div className="form-group button-group">
              <button type="submit" onClick={handleFormSubmit}>Submit</button>
            </div>
          </div>
        </div>
        {editSaved && <div className="edit"> {editSaved} </div>}
      </div>
    </div>
  );
}

export default Profile