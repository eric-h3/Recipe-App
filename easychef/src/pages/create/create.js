import React, { useState, useEffect } from "react";
import './create.css';

var accessToken = localStorage.getItem('access_token');

async function handleCreate(formData) {

    const response = await fetch('http://127.0.0.1:8000/RecipeDetails/createrecipe/', {
        method: 'POST',
        body: formData,
        headers: { 'Authorization': `Bearer ${accessToken}` }
    });
    console.log(response);
    if (!response.ok) {
        throw new Error(response.statusText);
    }
    const data = await response.json();
    return data
}

function Create() {
    const [base, setBase] = useState("");
    const [diet, setDiet] = useState("");
    const [servings, setServings] = useState(1);
    const [prepTime, setPrepTime] = useState("");
    const [cookTime, setCookTime] = useState("");
    const [recipeName, setRecipeName] = useState("");
    const [cuisine, setCuisine] = useState("");
    const [mainVid, setMainVid] = useState("");
    const [mainImg, setMainImg] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [stepTotal, setStepTotal] = useState(1);
    const [ingredientTotal, setIngredientTotal] = useState(1);
    const [inputs, setInputs] = useState([
        { title: '', description: '', time_taken: '', img: '', vid: '' },
    ]);
    const [ing, setIng] = useState([
        { id: 1, name: '', base_amount: '', measuring_unit: '', }
    ]);

    async function handleBaseRecipe(base) {

        if (base === '') {
            return
        }

        const response = await fetch('http://127.0.0.1:8000/RecipeDetails/createrecipe/prefill/' + base, {
            method: 'GET',
            headers: { 'Authorization': `Bearer ${accessToken}` }
        });
        console.log(response);
        if (!response.ok) {
            setErrorMessage('Recipe Not Found');
        }
        const data = await response.json();
        setRecipeName(data.name);
        setPrepTime(data.prep_time);
        setCookTime(data.cook_time);
        setCuisine(data.cuisine);
        setDiet(data.diets);

        console.log(data);
        return data
    }
    
    useEffect(() => {
        document.title="Create a recipe"
        const formBase = new FormData();
        formBase.append('base_recipe', base);
        handleBaseRecipe(base);
        
    }, [base])

    // Check if user is logged in
    if (!accessToken) {
        return <h1>Login Required</h1>;
    }
    const handleFormSubmit = async (event) => {
        event.preventDefault();

        try {
            console.log(inputs);

            const formData = new FormData();
            let total_time = prepTime + cookTime;
            formData.append('diets', diet);
            formData.append('servings', servings);
            formData.append('prep_time', prepTime);
            formData.append('cook_time', cookTime);
            formData.append('total_time', total_time);
            formData.append('name', recipeName);
            formData.append('cuisine', cuisine);
            formData.append('ingredient_count', ingredientTotal);
            formData.append('step_count', stepTotal);
            formData.append('main_img', mainImg);
            formData.append('main_vid', mainVid);

            // Add steps to formData
            inputs.forEach((input, index) => {
                let stepPrefix = index + 1 + '_';
                formData.append(`${stepPrefix}number`, index + 1);
                formData.append(`${stepPrefix}title`, input.title);
                formData.append(`${stepPrefix}description`, input.description);
                formData.append(`${stepPrefix}time_taken`, input.time_taken);
                if (input.vid !== '') {
                    formData.append(`${stepPrefix}vid`, input.vid);
                }
                if (input.img !== '') {
                    formData.append(`${stepPrefix}img`, input.img);
                }
            });

            // Add ingredients to formData
            ing.forEach((ingredient, index) => {
                let ingPrefix = index + 1 + '_';
                formData.append(`${ingPrefix}ingredient`, ingredient.name);
                formData.append(`${ingPrefix}base_amount`, ingredient.base_amount);
                formData.append(`${ingPrefix}measuring_unit`, ingredient.measuring_unit);
            });

            const response = await handleCreate(formData);
            let recipeId = response.id
            let url = `/Recipe/Display?recipe_id=${recipeId}`
            // redirect to recipe page
            window.location.href = url;

        } catch (error) {
            setErrorMessage('error occured');
            console.log(errorMessage);
        }
    };

    const handleInputChange = (index, event) => {
        const { name, value } = event.target;
        const newInputs = [...inputs];
        if (event.target.type === 'file') {
            newInputs[index][name] = event.target.files[0];
        } else {
            newInputs[index][name] = value;
        }
        setInputs(newInputs);
    };

    const handleAddInput = () => {
        let object = {
            title: '',
            description: '',
            time_taken: '',
            img: '',
            vid: ''
        }
        setStepTotal(stepTotal + 1);
        setInputs([...inputs, object]);
    };

    const handleRemoveInput = (index) => {
        const newInputs = [...inputs];
        newInputs.splice(index, 1);
        setInputs(newInputs);
        setStepTotal(stepTotal - 1);
    };

    const handleIngChange = (index, event) => {
        const { name, value } = event.target;
        const newIngs = [...ing];
        const ingredient = newIngs.find((ing) => ing.id === index);
        ingredient[name] = value;
        setIng(newIngs);
    };

    const handleAddIngredient = () => {
        let newObject = {
          id: ingredientTotal + 1,
          name: '',
          base_amount: '',
          measuring_unit: ''
        };
        setIngredientTotal(ingredientTotal + 1);
        setIng([...ing, newObject]);
      };
      
      const handleRemoveIngredient = (id) => {
        const newIngs = ing.filter((ing) => ing.id !== id);
        setIng(newIngs);
        setIngredientTotal(ingredientTotal - 1);
      };
      
      

    return (
        <div className="create-container">

            <div className="box" id="create">

                <form style={{ width: '60%' }} onSubmit={handleFormSubmit}>
                    <div className="mb-3">
                        <h1 className="create-text-center">Create a Recipe</h1>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="recipeName" className="create-label">Create based on recipe</label>
                        <input
                            className="form-control col-lg-4 col-md-6"
                            type="search"
                            value={base}
                            placeholder="Search"
                            aria-label="Search"
                            onChange={async (event) => {
                                setBase(event.target.value);
                                setErrorMessage('');
                            }}
                        />
                        {errorMessage && <div className="error"> {errorMessage} </div>}
                    </div>

                    <div className="row">
                        <div className="mb-3 col-md-4">
                            <label htmlFor="recipeName" className="create-label">Recipe Name</label>
                            <input
                                type="text"
                                className="form-control"
                                id="recipeName"
                                placeholder="Enter recipe name"
                                value={recipeName}
                                onChange={(event) => setRecipeName(event.target.value)}
                                required
                            />
                        </div>

                        <div className="mb-3 col-md-4">
                            <label htmlFor="recipeName" className="create-label">Prep Time</label>
                            <input
                                type="number"
                                className="form-control"
                                id="preptime"
                                placeholder="minutes"
                                min="0"
                                value={prepTime}
                                onChange={(event) => setPrepTime(parseInt(event.target.value))}
                                required
                            />
                        </div>

                        <div className="mb-3 col-md-4">
                            <label htmlFor="recipeName" className="create-label">Cook Time</label>
                            <input
                                type="number"
                                className="form-control"
                                id="cooktime"
                                placeholder="minutes"
                                min="0"
                                value={cookTime}
                                onChange={(event) => setCookTime(parseInt(event.target.value))}
                                required
                            />
                        </div>
                    </div>

                    <div className="row">
                        <div className="mb-3 col-md-4">
                            <label htmlFor="diet" className="create-label">Type of Diet</label>
                            <select
                                className="form-control"
                                id="diet"
                                value={diet}
                                onChange={(event) => setDiet(event.target.value)}
                                required
                            >
                                <option value="" disabled hidden>
                                    ----
                                </option>
                                <option>None</option>
                                <option>Keto</option>
                                <option>Paleo</option>
                                <option>Vegetarian</option>
                                <option>Vegan</option>
                                <option>Mediterranean</option>
                                <option>Low Carb</option>
                                <option>Raw</option>
                                <option>No Sugar</option>
                            </select>
                        </div>

                        <div className="mb-3 col-md-4">
                            <label htmlFor="diet" className="create-label">Type of Cuisine</label>
                            <select
                                className="form-control"
                                id="cuisine"
                                value={cuisine}
                                onChange={(event) => setCuisine(event.target.value)}
                                required
                            >
                                <option value="" disabled hidden>
                                    ----
                                </option>
                                <option>America</option>
                                <option>Chinese</option>
                                <option>French</option>
                                <option>Italian</option>
                                <option>Japanese</option>
                                <option>Korean</option>
                                <option>Mexican</option>
                                <option>Thai</option>
                                <option>Other</option>
                            </select>
                        </div>

                        <div className="mb-3 col-md-4">
                            <label htmlFor="servings" className="create-label">Servings</label>
                            <select
                                className="form-control"
                                id="servings"
                                value={servings}
                                onChange={(event) => setServings(event.target.value)}
                                required
                            >
                                <option value="" disabled hidden>----</option>
                                <option>1</option>
                                <option>2</option>
                                <option>3</option>
                                <option>4</option>
                                <option>5</option>
                            </select>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-md-6 mb-3">
                            <label className="create-label">
                                Main Video:
                                <div className="custom-file-upload">
                                    <input type="file" accept="video/*" onChange={(e) => setMainVid(e.target.files[0])} placeholder="Select an video file" />
                                    Choose File
                                </div>
                                <span>
                                    {mainVid ? mainVid.name : ""}
                                </span>
                            </label>
                        </div>
                        <div className="col-md-6 mb-3">
                            <label className="create-label">
                                Main Image:
                                <div className="custom-file-upload">
                                    <input type="file" accept="image/*" onChange={(e) => setMainImg(e.target.files[0])} placeholder="Select an image file" />
                                    Choose File
                                </div>
                                <span>
                                    {mainImg ? mainImg.name : ""}
                                </span>
                            </label>
                        </div>
                    </div>

                    <div className="row">
                        {inputs.map((input, index) => (
                            <div key={index} className="col-md-6 mb-3">
                                <label className="create-label">Title:</label>
                                <input
                                    type="text"
                                    name="title"
                                    placeholder="enter title"
                                    value={input.title}
                                    onChange={(event) => handleInputChange(index, event)}
                                    required
                                />
                                <br />
                                <label className="create-label">Description:</label>
                                <textarea
                                    name="description"
                                    placeholder="describe your step"
                                    value={input.description}
                                    onChange={(event) => handleInputChange(index, event)}
                                    required
                                />
                                <br />
                                <label className="create-label">Time taken:</label>
                                <input
                                    type="number"
                                    name="time_taken"
                                    placeholder="minutes"
                                    min="0"
                                    value={input.time_taken}
                                    onChange={(event) => handleInputChange(index, event)}
                                    required
                                />
                                <br />
                                <label className="create-label">
                                    Step Image (optional):
                                    <div className="btn btn-success btn-sm">
                                        <input
                                            type="file"
                                            name="img"
                                            accept="image/*"
                                            defaultValue={input.img}
                                            onChange={(event) => handleInputChange(index, event)}
                                        />
                                        Choose Image
                                    </div>
                                    <span>
                                        {input.img ? input.img.name : ""}
                                    </span>
                                </label>
                                <br />
                                <label className="create-label">
                                    Step Video (optional):
                                    <div className="btn btn-success btn-sm">
                                        <input
                                            type="file"
                                            name="vid"
                                            accept="video/*"
                                            defaultValue={input.vid}
                                            onChange={(event) => handleInputChange(index, event)}
                                        />
                                        Choose Video
                                    </div>
                                    <span>
                                        {input.vid ? input.vid.name : ""}
                                    </span>
                                </label>
                                <br />

                                <div className="create-text-center">
                                    <button type="button" className="btn btn-danger" onClick={() => handleRemoveInput(index)}>
                                        Remove
                                    </button>
                                </div>
                            </div>
                        ))}
                        <div className="create-text-center">
                            <button type="button" className="btn btn-dark" onClick={handleAddInput}>
                                Add Step
                            </button>
                        </div>
                    </div>

                    <div className="row">
                        {ing.map((ingredient) => (
                            <div key={ingredient.id} className="col-md-6 mb-3">
                                <label className="create-label">Name:</label>
                                <input
                                    type="text"
                                    name="name"
                                    placeholder="enter ingredient name"
                                    value={ingredient.name}
                                    onChange={(event) => handleIngChange(ingredient.id, event)}
                                    required
                                />
                                <br />
                                <label className="create-label">Base Amount:</label>
                                <input
                                    type="number"
                                    name="base_amount"
                                    min="0"
                                    placeholder="enter base amount for one serving"
                                    value={ingredient.base_amount}
                                    onChange={(event) => handleIngChange(ingredient.id, event)}
                                    required
                                />
                                <br />
                                <label className="create-label">Measuring Unit:</label>
                                <input
                                    type="text"
                                    name="measuring_unit"
                                    placeholder="enter measuring unit"
                                    value={ingredient.measuring_unit}
                                    onChange={(event) => handleIngChange(ingredient.id, event)}
                                    required
                                />
                                <br />
                                <div className="create-text-center">
                                    <button type="button" className="btn btn-danger" onClick={() => handleRemoveIngredient(ingredient.id)}>
                                        Remove
                                    </button>
                                </div>
                            </div>
                        ))}
                        <div className="create-text-center">
                            <button type="button" className="btn btn-dark" onClick={handleAddIngredient}>
                                Add Ingredient
                            </button>
                        </div>
                    </div>

                    <div className="create-text-center">
                        <button type="submit" className="btn btn-primary">Create Recipe</button>
                    </div>

                </form>
            </div>
        </div>
    );
}
export default Create;