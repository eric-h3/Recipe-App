import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import {  Button } from "react-bootstrap";
import { BiChevronLeft, BiChevronRight } from 'react-icons/bi';
import './search-style.css';
import Card from '../../components/Cards'



function Search(){
    const [output, setOutput] = useState([]);
    const [searchParams, setSearchParams] = useSearchParams();
    const [query, setQuery] = useState(searchParams.get("query"));
    const [page, setPage] = useState(searchParams.get("page"));

    const nextPage = (event) =>{
        event.preventDefault();
        const npage = parseInt(page)
        window.location.href="/Search?query="+ query + "&page="+eval(npage+1);
    }
    const prevPage = (event) =>{
        event.preventDefault();
        if(page>1){
            window.location.href="/Search?query="+ query + "&page="+eval(page-1);
        }
    }

    useEffect(() => {
        async function getRecipes() {
            const response = await fetch(
                "http://127.0.0.1:8000/RecipeDetails/search/"+query+"/"+page+"/",
                {
                    method: "GET"
                }
                );
            const data = await response.json();
            setOutput(data);
        }
        getRecipes();
        document.title="Search results for '"+ query+"'";
        },[]);
    return(<>
    <h1>Page {searchParams.get("page")} of results for "{searchParams.get("query")}"</h1>
        <div class="cards">
            {output.map((rec)=>(
                <Card data={rec} />
            ))}
        </div>
        <div class="d-flex align-items-center justify-content-center mb-5 mt-3">
            <Button onClick={prevPage}><BiChevronLeft/></Button>
            <Button onClick={nextPage}><BiChevronRight/></Button>
        </div>
        </>);
            
}

export default Search
