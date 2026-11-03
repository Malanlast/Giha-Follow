import Contributions from './Contributions';
import './Overview.css';
import RecentActivity from './RecentActivity';
import Repositories from './Repositories';
import StatsBanner from './StatsBanner';
import WelcomeBanner from './WelcomeBanner';

function Overview() {
  return (
    <div className="container-fluid overview-container">
       <WelcomeBanner/>
	   <StatsBanner/>
	   <Contributions/>
	   <Repositories/>
	   <RecentActivity/>
    </div>
  );
}

export default Overview;