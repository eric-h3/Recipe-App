import React, { useEffect, useState } from "react";
import './style.css';


async function favRecipe(id){
    try{
        const response = await fetch(
            "http://127.0.0.1:8000/social/favrecipe/"+localStorage.user+'/'+ id,
            {method: "GET"}
        );
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message);
        }
    } catch (error) {
        console.error(error);
    }
}

function Card(props){
    const [state, setState] = useState(props.data);
    const [comm, setComm] = useState();

    useEffect(() => {
        
        async function getComments(id) {
            try {
                const response = await fetch(
                    "http://127.0.0.1:8000/RecipeDetails/Recipe/" + id + "/comments/",
                    {
                        method: "GET"
                    }
                    );
                const data = await response.json();
                if (!response.ok) {
                    throw new Error(data.message);
                }
                setComm(Object.keys(data).length)
            } catch (error) {
                console.error(error);
            }
        }
        async function getRecipe(id) {
            try {
                const response = await fetch(
                    "http://127.0.0.1:8000/RecipeDetails/Recipe/" + id + "/",
                    {
                        method: "GET"
                    }
                    );
                const data = await response.json();
                if (!response.ok) {
                    throw new Error(data.message);
                }
                setState(data);
            } catch (error) {
                console.error(error);
            }
        }
        getRecipe(props.data.id);
        getComments(props.data.id);
    }, [props.data]);
    if(!state){
        return(<div>Loading...</div>)
    }
    let recipeLink ="/Recipe/Display?recipe_id="+state.id;
    return(<>
    <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.8.2/css/all.css" integrity="sha384-oS3vJWv+0UjzBfQzYUhtDYW+Pj2yciDJxpsK1OYPAYjqT085Qq/1cq5FLXAZQ7Ay" crossorigin="anonymous"></link>
    <div class="cardcontainer">
        <div class="photo">
            <img src={ state.main_img }/>
        </div>
        <div class="content">
            <p class="txt4">{state.name}</p>
            <p class="txt5">Serves {state.servings}</p>
            <p class="txt2">Time: {state.total_time} min</p>
        </div>
        <div class="footer">
            <p><a class="btn" id = "recipelink" href={recipeLink} >Go to recipe</a>
            <a id="heart" onClick={() => favRecipe(state.id)}><span class="like"><i class="fab fa-gratipay"></i>Favourite</span></a></p>
            <p class="txt3"><span class="comments"><i class="fas fa-comments"></i>{ comm } Comments</span></p>
        </div>
    </div></>);
}

export default Card