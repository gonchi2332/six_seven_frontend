import Navbar from "../components/Navbar/Navbar";
import PersonalInfo from "./PersonalInfo";

const Dashboard = () =>{
    return(
        <div className="flex flex-col items-center bg-main h-screen">
            <Navbar></Navbar>
            <div className="w-full p-6">
                <PersonalInfo></PersonalInfo>
            </div>
        </div>
    )
}
export default Dashboard;