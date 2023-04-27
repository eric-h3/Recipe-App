import React from 'react';
import { useEffect, useState } from 'react'
import { Form, Button, Row } from "react-bootstrap";
import { useSearchParams } from "react-router-dom";
import { Carousel } from 'react-responsive-carousel';
import Rating from '@mui/material/Rating';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import './recipe_display-style.css'
import { alignPropType } from 'react-bootstrap/esm/types';

var accessToken = localStorage.getItem('access_token');

async function handleCreate(formData, id){
    try {
        const response = await fetch(
            "http://127.0.0.1:8000/RecipeDetails/Recipe/" + id + '/createcomment/',
            {
                method: "POST",
                body: formData,
                headers: { 'Authorization': `Bearer ${accessToken}` }
            }
        );
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message);
        }
    } catch (error) {
        console.error(error);
    }
}

async function handleRating(rate, id){
    try {
        const formData = new FormData();
        formData.append('rating', rate);
        const response = await fetch(
            "http://127.0.0.1:8000/RecipeDetails/Recipe/" + id + '/update/rating/',
            {
                method: "PUT",
                body: formData,
                headers: { 'Authorization': `Bearer ${accessToken}` }
            }
        );
        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.message);
        }
    } catch (error) {
        console.error(error);
    }
}

function RecipeDisplay() {
    const[value, setValue] = useState(null);
    const[data, setData] = useState([]);
    const[user, setUser] = useState([]);
    const[self, setSelf] = useState([]);
    const[prof, setProf] = useState([]);
    const[ing, setIng] = useState([]);
    const[steps, setSteps] = useState([]);
    const[comm, setComm] = useState([]);
    const[content, setContent] = useState('');
    const [searchParams, setSearchParams] = useSearchParams();
    const [serve, setServe] = useState(0);
    const [formErrors, setFormErrors] = useState({});
    var host = 'http://127.0.0.1:8000';

    const handleFormSubmit = async (event) => {
        event.preventDefault();
        const formData = new FormData();
        formData.append('content', content);
        const response = await handleCreate(formData, searchParams.get("recipe_id"));
        window.location.reload(false);
    };

    const handleListAdd = async (event) =>{
        event.preventDefault();
        try{
            const response = await fetch(
                "http://127.0.0.1:8000/social/cart/"+ localStorage.getItem('user') + "/"+ data.id,
                {
                    method: "GET"
                }
            );
            const res = await response.json();
            if (!response.ok) {
                throw new Error(res.message);
            }
        }catch (error) {console.error(error);}
    };

    const handleFavourite = async (event) =>{
        event.preventDefault();
        try{
            const response = await fetch(
                "http://127.0.0.1:8000/social/favrecipe/"+ localStorage.getItem('user') + "/"+ data.id,
                {
                    method: "GET"
                }
            );
            const res = await response.json();
            if (!response.ok) {
                throw new Error(res.message);
            }
        }catch (error) {console.error(error);}
    }

    useEffect(() =>{
        async function getSelf(){
            try{
                const response = await fetch(
                    "http://127.0.0.1:8000/social/profile/display/" + localStorage.getItem('user'),
                    {
                        method: "GET"
                    }
                );
                const res = await response.json();
                if (!response.ok) {
                    throw new Error(data.message);
                }
                setSelf(res.profile);
            } catch (error) {
                console.error(error);
        }}
        async function getComments(id) {
            try{
                const response = await fetch(
                    "http://127.0.0.1:8000/RecipeDetails/Recipe/" + id+'/comments/',
                    {
                        method: "GET"
                    }
                );
                const res = await response.json();
                if (!response.ok) {
                    throw new Error(data.message);
                }
                setComm(res);
            } catch (error) {
                console.error(error);
        }}
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
                    throw new Error(data.message);
                }
                setUser(res.user);
                setProf(res.profile);
            } catch (error) {
                console.error(error);
        }}
        async function getRecipe(id) {
            try{
                const response = await fetch(
                    "http://127.0.0.1:8000/RecipeDetails/Recipe/" + id+'/',
                    {
                        method: 'GET',
                    }
                );
                const res = await response.json();
                if (!response.ok) {
                    throw new Error(data.message);
                }
                setData(res);
                document.title=res.name;
                getUser(res.author.id);
                setIng(res.ingredients);
                setSteps(res.steps);
                setServe(res.servings)
            } catch (error) {
                console.error(error);
        }}
        getRecipe(searchParams.get("recipe_id"));
        getComments(searchParams.get("recipe_id"));
        getSelf();
    }, []);
    if(!data){
        return (
            <div>No recipe found...</div>
        )
    }
    const authorLink='/Profile/'+user.id
    return(
        <>
        <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.8.2/css/all.css" integrity="sha384-oS3vJWv+0UjzBfQzYUhtDYW+Pj2yciDJxpsK1OYPAYjqT085Qq/1cq5FLXAZQ7Ay" crossorigin="anonymous"></link>
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-GLhlTQ8iRABdZLl6O3oVMWSktQOp6b7In1Zl3/Jr59b6EGGoI1aFkw7cmDA6j6gD" crossorigin="anonymous"></link>
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.3/font/bootstrap-icons.css"></link>
    <div class="container mb-5" id="s1" style={{position:'relative', flexDirection: "column"}}>
        <div class="d-flex align-items-baseline">
            <div class="flex">
                <h1 class = "mt-5" >{data.name}</h1>
            </div>
            <div class="flex ms-5">
                <h5><i class="bi bi-star"></i> {data.av_rating}</h5>
            </div>
            <div class="flex ms-3">
                <h5><i class="bi bi-heart"></i> {data.likes}</h5>
            </div>
        </div>

        <Carousel width="500px" showThumbs={false}>
            <div class="carousel-item active" style={{maxHeight:"100%",maxWidth:"100%"}}>
                <img src={data.main_img} alt="..."/>
            </div>
            <div>
                <video controls src={data.main_vid} style={{maxHeight:"100%",maxWidth:"100%"}}>
                    <source src={data.main_vid} type="video/mp4" />
                    Your browser does not support the video tag.
                </video>
            </div>
        </Carousel>

        <div class="d-flex align-items-center mb-5 mt-3" >
            <div class="d-flex" style={{alignItems: "center", justifyContent: "center", flexDirection: "column"}}>
              <img src={host + prof.avi}
                alt="Avatar" class="rounded-circle shadow-1-strong me-1 ms-1 border border-dark" style={{height: "50px"}}/>
                <p class="mb-1" >By: <a href={authorLink}>{user.username}</a></p>
            </div>
        </div>

        

    </div>
    <div class="container mb-5" style={{position:'relative'}}>
        <h2> Recipe Info</h2>
        <div class="card border border-dark border-1" >
            <div class="row pt-3">
                <div class="col-2 pe-1" >
                    Diets: 
                </div>
                <div class="col-2 ps-1" >
                    {data.diets}
                </div>
                <div class="col-2 pe-1" >
                    Cuisine:
                </div>
                <div class="col-2 ps-1" >
                    {data.cuisine}
                </div>
                <div class="col-2 pe-1" >
                    Base Recipe:
                </div>
                <div class="col-2 ps-1" >
                    {(data.base_recipe)? data.base_recipe: "None"}
                </div>
            </div>
            <div class="row pt-3 pb-3" >
                <div class="col-2 pe-1" >
                    Prep time: 
                </div>
                <div class="col-2 ps-1" >
                    {data.prep_time} min
                </div>
                <div class="col-2 pe-1" >
                    Cook time:
                </div>
                <div class="col-2 ps-1" >
                    {data.cook_time} min
                </div>
                <div class="col-2 pe-1" >
                    Total time:
                </div>
                <div class="col-2 ps-1" >
                    {data.total_time} min
                </div>
            </div>
        </div>
    </div>
    <div class="d-flex justify-content-center mb-5 mt-3" id="rating">
        <p>Rate it:</p>
        <Rating style={{color:"yellow"}}
            name="simple-controlled"
            value={value}
            onChange={(event, newValue) => {
                setValue(newValue);
                handleRating(newValue, data.id)
            }}
        />
        <Button onClick={handleListAdd}>Add to shopping list <i class="bi bi-bag-plus"></i></Button>
        <Button onClick={handleFavourite}>Favourite <i class="fab fa-gratipay"></i></Button>
    </div>
    <div class="container mb-5" style={{ position: 'relative'}}>
        <div class="d-flex align-items-baseline">
            <h2 class="me-1">Ingredients</h2>
            <div class="align-items-baseline">
                <h4 class="ms-2">
                    (Servings: {serve})
                    <div class="clearfix"></div>
                </h4>
            </div>
        </div>

        <div class="card border-dark" style={{ width:"50em", position: 'relative'}}>
        <table class="table-borderless">
            <thead>
                <tr>
                    <th class="col-6">
                        Ingredient name
                    </th>
                    <th class="col-6">
                        Amount 
                    </th>
                </tr>
            </thead>
            {ing.map((ing) =>(
                <tr>
                    <th>{ing.ingredient}</th>
                    <th>{ing.base_amount} {ing.measuring_unit}</th>
                </tr>
            ))}
        </table>
        </div>
    </div>
    <div class="container mb-5" style={{position: "relative"}}>
        <h2>Method Overview</h2>

        <div class="list-group list-group-numbered border border-dark" style={{width: "50em", textAlign: "left"}}>
            {steps.map((step) => (<a href={"#step" + step.number} class="list-group-item btn btn-outline-dark" role="button">
                {step.title} ({step.time_taken}min)
            </a>))}
        </div>
    </div>
    <div class="container mb-5" style={{position: "relative"}}>
        <h2 style={{marginRight: "50px"}}> Method Details</h2>
        {steps.map((step) => (<div id={"step"+step.number} class="card mb-3 border border-dark" style={{width: "50em"}}>
            <div class="card-header align-items-baseline">
                <h3>Step {step.number}</h3> 
            </div>
            <Carousel width="500px" showThumbs={false}>
                <div class="carousel-item active" style={{maxHeight:"100%",maxWidth:"100%"}}>
                    <img src={step.img} alt="..."/>
                </div>
                <div>
                    <video controls style={{maxHeight:"100%",maxWidth:"100%"}}>
                    <source src={step.vid} type="video/mp4" />
                    Your browser does not support the video tag.
                    </video>
                </div>
            </Carousel>
            <div class="card-body">
              <h5 class="card-title">{step.title} ({step.time_taken}min)</h5>
              <p class="card-text">{step.description}</p>
            </div>
        </div>))}
    </div>
        <div class="container mb-5" style={{position: 'relative'}}>
        <div class="card border border-dark" style={{width: "55em"}}>

            <div class="card_body p-3">
                <h2 class="p-3">Comments</h2>

            
                <div className="formbox" style={{position: 'relative', height: "50%"}}>
                    <div class="col-2">
                        <img src={host+self.avi}
                        alt="Avatar" class="rounded-circle shadow-1-strong me-0 ms-5 border border-dark"
                        style={{width: "55px"}}/>
                    </div>

                    <Form onSubmit={handleFormSubmit}>
                        <Row>
                        <Form.Group controlId="formBasicContent">
                            <Form.Label className="labeltext" style={{color: "white"}}>Comment:</Form.Label>
                            <Form.Control
                                type="text"
                                placeholder="Write a comment..."
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                            />
                        </Form.Group>
                        <div className="button text-center">
                        <Button variant="primary" type="submit">
                            Write Comment
                        </Button>
                        </div>
                        </Row>
                    </Form>
                    
                </div>
                {comm.map((c) => ( 
                <div class="row py-2">
                    <div class="col-10">
                        <div class="float-left">
                            <strong>{c.commenter.username}</strong>
                        </div>
                        <div class="clearfix"></div>
                        <p>{c.content}
                        </p>
                    </div>
                </div>
    ))}
           
            </div>
        
        </div>
    
    </div>
        </>
    )
}

export default RecipeDisplay;