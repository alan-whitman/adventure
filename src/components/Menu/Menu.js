import React, { Component }  from 'react';
import './Menu.css';
import { Link } from 'react-router-dom';

class Menu extends Component {
    render() {
        return (
            <div className="Menu">
                <Link to="/MyGames">My Games</Link>
            </div>
        )
    }
}

export default Menu;