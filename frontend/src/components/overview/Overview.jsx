import Contributions from './Contributions';
import './Overview.css'; 
import Repositories from './Repositories';
import StatsBanner from './StatsBanner';
import WelcomeBanner from './WelcomeBanner';

function Overview({user}) {
  return (
    <div className="container-fluid overview-container">
    <WelcomeBanner user={user}/>
	   <StatsBanner/>
	   <Contributions/>
	   <Repositories/> 
    </div>
  );
}

export default Overview;