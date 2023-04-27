import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import './index-style.css';
import image from './img/easychef.jpg';
import Card from '../../components/Cards'



function Index(){
    const [rated, setRated] = useState([]);
    const [liked, setLiked] = useState([]);

    useEffect(() => {
        async function getLiked() {
            const response = await fetch(
                "http://127.0.0.1:8000/RecipeDetails/list/-likes/6",
                {
                    method: "GET"
                }
                );
            const data = await response.json();
            setLiked(data);
        }
        async function getRated() {
            const response = await fetch(
                "http://127.0.0.1:8000/RecipeDetails/list/-av_rating/6",
                {
                    method: "GET"
                }
                );
            const data = await response.json();
            setRated(data);
        }
        document.title="Easy Chef - Cooking made simple"
        getRated();
        getLiked();
        },[]);
    return(<>
        <div class="hero-image" style={{ backgroundImage:`url(${image})`,backgroundRepeat:"no-repeat",backgroundSize:"contain", 
            height:"50vh",width:"100vw"
            }}>
        </div>
        <div class="rated-wrapper">
        <h1>Top rated</h1>
        <div class="cards" id="rated">
            {rated.map((rec)=>(
                <Card data={rec} />
            ))}
        </div>
        </div><div class="liked-wrapper">
        <h1>Most liked</h1>
        <div class="cards" id="rated">
            {liked.map((rec)=>(
                <Card data={rec} />
            ))}
        </div>
        </div>
        </>);
            
}

export default Index
