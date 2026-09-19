import '../login.css';
import DetailsBox from '../components/login-component/detailsBox';
function Login() {
  return ( 
    <div className='container'>
    <div className='row leftRightBox'>
    <div className='col-12 col-md-5 leftBox'> 
    <div className='row' style={{margin:"auto"}}>
    <div className='col-4' style={{height:"50%",display:"flex",justifyContent:"flex-end",alignItems:"start-end"}}>
    <img className='GihaLogo' src="/GihaLogo.png" alt="logo"/></div>
    <div className='col-8'>
      <h2 style={{marginTop:"0",fontSize:"1rem"}}>MALAN'S DSUS Persent</h2>
      <h1 style={{fontSize:"1.8rem"}}>Giha Follow <i className="bi bi-git"></i></h1>
    </div>
    <p style={{fontSize:"0.9rem",marginTop:"10px",textAlign:"center"}}>
    Discover New Profiles, Make Connections, and Grow Your GitHub Network.
    </p>
    <div className='row circleRow'>
      <div className='circleBox' style={{background:"green"}}>
        <img src="/onePice.jpeg" alt="user1"/>
      </div>
      <div className='circleBox' style={{marginLeft:"-7px",background:"pink"}}>
         <img src="/wolverine.jpeg" alt="user2"/>
      </div>
      <div className='circleBox' style={{marginLeft:"-7px",background:"blue"}}>
         <img src="/blue.jpeg" alt="user3"/>
      </div>
      <div className='circleBox' style={{marginLeft:"-7px",background:"yellow"}}>
         <img src="/ironMan.jpeg" alt="user4"/>
      </div>
    </div>
     <p style={{fontSize:"0.9rem",marginTop:"10px",textAlign:"center"}}>
     Every logged-in user can easily follow other developer with a single click.</p>
    </div>   
    </div> 
        <div className='col-12 col-md-5 right'>
          <img className='gitCat'src="/gitHubCat.gif" alt="github-globe"/>
        <h2 className='rightH2'>
         Secure and Simple Authentication Through Your GitHub Account.
        </h2> 
         <button style={{marginTop:"0"}} className='loginBtn'>Get started</button>
        </div>
    </div>
    <div className='githubSection'>
        <img className='git-globe' src="/github-globe.gif" alt="git-globe-img"/>
        <p style={{textAlign:"center",marginTop:"1rem"}}>
        Providing one platform where users can find, explore, and connect with other GitHub developers through authorised Follow/Unfollow functionality. It reduces the need to search for developers individually on GitHub and provides a simple interface for discovering profiles, viewing developer information, and building connections.
        </p>
        <button className='signUpBtn' style={{marginTop:"0"}}>SignUp with <i className="bi bi-github"></i></button>
    </div>
    <DetailsBox/>
      <footer className='footer'>
      <p style={{margin:"auto"}}>
      <span style={{marginRight:"0.5rem"}}>@MalanLast</span>
      |
      <span style={{marginRight:"0.5rem",marginLeft:"0.5rem"}}>GitHub</span>
      |
      <span style={{marginLeft:"0.5rem"}}>shiothe7@gmail.com</span>
      </p>
      </footer>
    </div>
  )
}

export default Login;