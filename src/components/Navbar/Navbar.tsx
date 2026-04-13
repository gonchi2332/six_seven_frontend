const Navbar = () =>{
    const NAVBAR = "w-full bg-secondary p-4 text-white font-inter font-bold text-xl"
    return(
        //TODO: cambiar el nombre estatico por el que nos daran en los endpoints
        //TODO: cambiar la imagen estatica por la que nos daran en los endpoints
        <nav className={NAVBAR}>
            <div>
                <img src="https://www.google.com/url?sa=t&source=web&rct=j&url=https%3A%2F%2Fwww.vecteezy.com%2Ffree-vector%2Fplaceholder&ved=0CBcQjRxqFwoTCOiGpITj6ZMDFQAAAAAdAAAAABAI&opi=89978449" alt="" />
                Ignacio Jaldin Janko
            </div>
        </nav>
    );
}
export default Navbar;