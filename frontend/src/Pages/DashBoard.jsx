// import DashBoardNavbar from '../components/dashboard/DashBoardNavbar.jsx';
// import Navbar from '../components/navbar/Navbar.jsx';
import Repository from '../components/repository/Repository.jsx';
function DashBoard(){
	return(
		<div className='container' style={{height:"100vh"}}>
			{/* <DashBoardNavbar/> */}
			<Repository/>
			{/* <Navbar/> */}
		</div>
	);
}
export default DashBoard;