import { useEffect, useState } from "react"
import { Button } from "react-bootstrap";
import image from './default/easychef_logo.png'

async function handleList(id){
    try{
        const response = await fetch(
            "http://127.0.0.1:8000/social/cart/"+ localStorage.getItem('user') + "/"+ id,
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


function Cart(){
    const [self, setSelf] = useState([]);
    const [prof, setProf] = useState([]);
    const [list, setList] = useState([]);
    const [ing, setIng] = useState([]);
    var host = 'http://127.0.0.1:8000';

    const handleListInput = (id) => (event) => {
        event.preventDefault();
        handleList(id);
        setList(list.filter((item) => item.id !== id));
    }

    useEffect(()=>{
        document.title="Shopping List";
        async function getFavs(ids){
            var urls =[];
            ids.map(id =>
                urls.push("http://127.0.0.1:8000/RecipeDetails/Recipe/"+ id +"/"));
            await Promise.all(urls.map(url =>
                fetch(url).then(response => response.json())
                ))
                .then(data => {
                    setList(list.concat(data));
                    for(let i=0; i< data.length; i++){
                        setIng(ing.concat(data[i].ingredients))
                        console.log(data[i].ingredients)
                    }
                })
            .catch(error => console.error(error));
        }
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
                    throw new Error(res.message);
                }
                setSelf(res.user);
                setProf(res.profile);
                getFavs(res.profile.shopping_list);
                console.log(res);
            } catch (error) {
                console.error(error);
        }}
        setIng([]);
        setList([]);
        getSelf();
    }, []);
    if(!self){
        return(<div class="d-flex align-items-center justify-content-center mb-5 mt-3">
        <div class="d-flex" style={{alignItems: "center", justifyContent: "center", flexDirection: "column"}}>
            <h1 class="mb-1" >Login required</h1>
        </div>
    </div>)
    }
    return(<>
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/css/bootstrap.min.css" rel="stylesheet"
        integrity="sha384-GLhlTQ8iRABdZLl6O3oVMWSktQOp6b7In1Zl3/Jr59b6EGGoI1aFkw7cmDA6j6gD" crossorigin="anonymous"/>
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.3/font/bootstrap-icons.css"/>
        <div class="d-flex align-items-center justify-content-center mb-5 mt-3">
            <div class="d-flex" style={{alignItems: "center", justifyContent: "center", flexDirection: "column"}}>
              <img src={host + prof.avi}
                alt="Avatar" class="rounded-circle shadow-1-strong me-1 ms-1 border border-dark" style={{height: "50px"}}/>
                <h1 class="mb-1" >{self.username}'s shopping list</h1>
            </div>
        </div>
    <section class="h-100">
    <div class="container h-100 py-5" style={{width:"100uw"}}>
      <div class="row d-flex justify-content-center align-items-center h-100" style={{width:"100%"}}>
        <div class="col-10">
            {list.map((rec)=>(<div class="card rounded-3 mb-3">
            <div class="card-body p-4">
              <div class="row d-flex justify-content-between align-items-center">
                <div class="col-xs-auto col-sm-6 col-md-3 col-lg-3 col-xl-1">
                  <img src={rec.main_img} class="rounded" alt="main_img" style={{maxHeight:"150px", maxWidth:"190px"}}/>
                </div>
                <div class="col-xs-auto col-sm-6 col-md-3 col-lg-3 col-xl-3">
                  <p class="lead fw-normal mb-4">{rec.name}</p>
                  <p><span class="text-muted">Servings: </span>{rec.servings}</p>
                </div>
                <div class="col-xs-auto col-sm-6 col-md-2 col-lg-2 col-xl-2 offset-lg-1">
                </div>
                <div class="col-xs-auto col-sm-6 col-md-2 col-xl-1">
                  <Button class="btn btn-danger" style={{backgroundColor:"red", borderWidth:"0px"}} onClick={handleListInput(rec.id)}><i class="bi bi-x-lg"></i></Button>
                </div>
              </div>
            </div>
            </div>
            ))}
        <div class="card mb-4">
            <h4>Ingredients</h4>
            <table>
                <tr>
                    <th>Name</th>
                    <th>Amount</th>
                </tr>
            {ing.map((ing)=>(
                <tr>
                    <td>{ing.ingredient}</td>
                    <td>{ing.serving_amount}{ing.measuring_unit}</td>
                </tr>
            ))}
            </table>
        </div>
    </div></div></div></section>
    </>)
}

export default Cart