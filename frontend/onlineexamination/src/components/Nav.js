import React from "react";
import { Link, NavLink } from "react-router-dom";

function Nav(){
    return(
        <div className="nav">
            <li><h4><NavLink className="navLink" to='/'>Home</NavLink></h4></li>
            <li><h4><NavLink  className="navLink" to='/about'>About</NavLink></h4></li>
            <li><h4><NavLink  className="navLink" to='/quetions'>Quetions</NavLink></h4></li>

            <li><h4><NavLink  className="navLink" to='/signin'>Sign In</NavLink></h4></li>
        </div>
    )
}

export default Nav;