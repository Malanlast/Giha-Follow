import Cards from '../components/cards/Cards.jsx';
import DashBoardNavbar from '../components/dashboard/DashBoardNavbar.jsx';
function DashBoard(){
	return(
		<div className='container' style={{height:"100vh"}}>
			<DashBoardNavbar/>
			<Cards/>
		</div>
	);
}
export default DashBoard;