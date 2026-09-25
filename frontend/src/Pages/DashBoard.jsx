import Cards from '../components/Cards.jsx';
import DashBoardNavbar from '../components/DashBoardNavbar.jsx';
function DashBoard(){
	return(
		<div className='container' style={{height:"100vh"}}>
			<DashBoardNavbar/>
			<Cards/>
		</div>
	);
}
export default DashBoard;