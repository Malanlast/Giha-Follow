import Cards from '../components/cards/Cards.jsx';
import DashBoardNavbar from '../components/dashboard/DashBoardNavbar.jsx';
import Navbar from '../components/navbar/Navbar.jsx';
function DashBoard(){
	return(
		<div className='container' style={{height:"100vh"}}>
			<DashBoardNavbar/>
			<Navbar/>
			<Cards/>
		</div>
	);
}
export default DashBoard;