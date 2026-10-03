import DashBoardNavbar from '../components/dashboard/DashBoardNavbar.jsx';
import Navbar from '../components/navbar/Navbar.jsx';
function DashBoard(){
	return(
		<div className='container' style={{height:"100vh"}}>
			<DashBoardNavbar/> 
			<Navbar/>
		</div>
	);
}
export default DashBoard;