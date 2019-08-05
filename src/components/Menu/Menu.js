import React, { Component }  from 'react';
import './Menu.css';
import { Link } from 'react-router-dom';

class Menu extends Component {
    render() {
        return (
            <div className="Menu">
                <Link to="/MapEditor">Edit Map</Link>
                <Link to="/">Edit Objects</Link>
                <Link to="/">Edit Verbs</Link>
            </div>
        )
    }
}

export default Menu;