import '../login.css';
function Login() {
  return ( 
    <div className='container'>
    <div className='content-container'>
    <h1>Welcome to Giha Follow</h1>
    <p>Increase your Github Followers.</p>
    </div> 
        <div>
          <img className='git-globe' src="/github-globe.gif" alt="github-globe"/>
        </div>
        <div><h2>
        Authentication through GitHub
        </h2>
        <button>get started</button>
        </div> 
      <p>Every logged in user can follow each other by a follow click.</p>
      <footer className='footer'>
      <p><span>@MalanLast</span></p>
      </footer>
    </div>
  )
}

export default Login;