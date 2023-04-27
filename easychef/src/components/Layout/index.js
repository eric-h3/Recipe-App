import { Outlet } from "react-router-dom"
import NavigationBar from '../Navbar';
import './style.css';

const Layout = () => {
    const isLoggedIn = localStorage.getItem('access_token') !== null;
    return (
        <>
            <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.8.2/css/all.css" integrity="sha384-oS3vJWv+0UjzBfQzYUhtDYW+Pj2yciDJxpsK1OYPAYjqT085Qq/1cq5FLXAZQ7Ay" crossOrigin="anonymous"></link>
            <NavigationBar isLoggedIn={isLoggedIn}/>
            <Outlet />
        </>
    )
}

export default Layout