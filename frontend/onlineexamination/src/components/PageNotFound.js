import React from "react";
import { Link } from "react-router-dom";

function PageNotFound(){
    return(
        <div>
            <h1>404</h1>
            <h4>page not found</h4>
            <Link to='/'>Go to Home</Link>
        </div>
    )
}


export default PageNotFound