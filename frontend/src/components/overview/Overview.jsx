import Contributions from './Contributions';
import './Overview.css';
import Repositories from './Repositories';
import WelcomeBanner from './WelcomeBanner';

function Overview() {
  return (
    <div className="container-fluid overview-container">
       <WelcomeBanner/>
	   <Contributions/>
	   <Repositories/>
    </div>
  );
}

export default Overview;