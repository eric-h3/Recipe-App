import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import './userrecipes-style.css';
import Card from '../../components/Cards'

var accessToken = localStorage.getItem('access_token');

function UserRecipes(){
    const [output, setOutput] = useState([]);
    const { id } = useParams();
    const[user, setUser] = useState([]);
    const[prof, setProf] = useState([]);
    const[fav, setFav] = useState([]);
    const[recent, setRecent] = useState([]);
    var host = 'http://127.0.0.1:8000';

    const handleDelete = (id) => {
        fetch(`http://127.0.0.1:8000/RecipeDetails/Recipe/${id}/delete/`,
        {
            method: "DELETE",
            headers: { 'Authorization': `Bearer ${accessToken}` }
        }
        )
        .then(response => {
            if (response.ok) {
              window.location.reload();
            } else {
              throw new Error('Network response was not ok');
            }
        })
          .catch(error => {
            console.error(error);
        });
    }

    useEffect(() => {
        async function getRecent(ids){
            var urls =[];
            ids.map(id =>
                urls.push("http://127.0.0.1:8000/RecipeDetails/Recipe/"+ id[0] +"/"));
            await Promise.all(urls.map(url =>
                fetch(url).then(response => response.json())
                ))
                .then(data => {
                    setRecent(recent.concat(data));
                })
            .catch(error => console.error(error));
        }
        async function getFavs(ids){
            var urls =[];
            ids.map(id =>
                urls.push("http://127.0.0.1:8000/RecipeDetails/Recipe/"+ id +"/"));
            await Promise.all(urls.map(url =>
                fetch(url).then(response => response.json())
                ))
                .then(data => {
                    setFav(fav.concat(data));
                })
            .catch(error => console.error(error));
        }
        async function getRecipes() {
            const response = await fetch(
                "http://127.0.0.1:8000/RecipeDetails/userrecipes/"+ id +"/9",
                {
                    method: "GET"
                }
                );
            const data = await response.json();
            setOutput(data);
        }
        async function getUser(id) {
            try{
                const response = await fetch(
                    "http://127.0.0.1:8000/social/profile/display/" + id,
                    {
                        method: "GET"
                    }
                );
                const res = await response.json();
                if (!response.ok) {
                    throw new Error(output.message);
                }
                setUser(res.user);
                document.title=res.user.username+"'s recipes";
                setProf(res.profile);
                console.log(res.profile);
                getFavs(res.profile.fav);
                getRecent(res.profile.last_touched);
            } catch (error) {
                console.error(error);
        }}
        getRecipes();
        getUser(id);
        },[]);

    return(<>
        <div class="d-flex align-items-center justify-content-center mb-5 mt-3">
            <div class="d-flex" style={{alignItems: "center", justifyContent: "center", flexDirection: "column"}}>
              <img src={host + prof.avi}
                alt="Avatar" class="rounded-circle shadow-1-strong me-1 ms-1 border border-dark" style={{height: "50px"}}/>
                <h1 class="mb-1" >{user.username}</h1>
            </div>
        </div>
        <label for="made" style={{color:"black", marginLeft:"50px"}}>User created:</label>
        <div class="cards" id="made">
            {output.map(rec => (
            <div key={rec.id}>
                <button className="btn btn-danger btn-sm" onClick={() => handleDelete(rec.id)}>Delete</button>
                <Card data={rec} />
            </div>
            ))}
        </div>
        <label for="favs" style={{color:"black", marginLeft:"50px"}}>User favourited:</label>
        <div class="cards" id="favs">
            {fav.map((rec)=>(
                <Card data={rec} />
            ))}
        </div>
        <label for="recent" style={{color:"black", marginLeft:"50px"}}>Recently interacted:</label>
        <div class="cards" id="recent">
            {recent.map((rec)=>(
                <Card data={rec} />
            ))}
        </div>
        </>);
            
}

export default UserRecipes
