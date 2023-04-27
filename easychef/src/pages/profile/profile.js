import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import './profile-main.css';

var host = 'http://127.0.0.1:8000';

function User() {
  const { id } = useParams();
  const [data, setData] = useState(null);

  useEffect(() => {
    const url = `http://127.0.0.1:8000/social/profile/display/${id}`;
    fetch(url, { method: 'GET' })
      .then(response => response.json())
      .then(data => {
        setData({
          username: data.user.username,
          email: data.user.email,
          bio: data.profile.bio,
          phone_num: data.profile.phone_num,
          avi: data.profile.avi,
          first_name: data.user.first_name,
          last_name: data.user.last_name
        });
        document.title="User: "+data.user.username;
      })
      .catch(error => console.error(error));
  }, [id]);

  if (!data) {
    return <div>Login Required</div>;
  }
  else {
    console.log(data);
  }

  return (
    <div className="profile">
      <div className="avatar">
        <img src={host + data.avi} alt="Profile Avatar" />
      </div>
      <div className="info">
        <h1>{'@' + data.username}</h1>
          <p>{data.bio}</p>
          <ul>
            <li>{data.first_name + ' ' + data.last_name}</li>
            <li>{data.email}</li>
            <li>{data.phone_num}</li>
          </ul>
      </div>
    </div>
  );
}

export default User;

