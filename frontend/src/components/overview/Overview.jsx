import Contributions from './Contributions';
import MostUsedLanguages from './MostUsedLanguages';
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
     <MostUsedLanguages/>
    </div>
  );
}

export default Overview;