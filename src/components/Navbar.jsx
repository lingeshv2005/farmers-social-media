const Navbar=()=>{
    return(
        <>
            <nav className="nav-bar">
                <div className="nav-logo">Logo</div>
                <ul>
                    <li><a href="/">Home</a></li>
                    <li><a href="/health-posts">Health Posts</a></li>
                    <li><a href="/farm-updates">Farm Updates</a></li>
                    <li><a href="/community">Community</a></li>
                    <li><a href="/marketplace">Marketplace</a></li>
                    <li><a href="/events">Events</a></li>
                    <li><a href="/notifications">Notifications</a></li>
                    <li><a href="/profile">Profile</a></li>
                </ul>
            </nav>
        </>
    );
}

export default Navbar;