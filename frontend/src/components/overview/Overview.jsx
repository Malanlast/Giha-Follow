import Contributions from './Contributions';
import './Overview.css';
import WelcomeBanner from './WelcomeBanner';

function Overview() {
  return (
    <div className="container-fluid overview-container">
       <WelcomeBanner/>
	   <Contributions/>
    </div>
  );
}

export default Overview;