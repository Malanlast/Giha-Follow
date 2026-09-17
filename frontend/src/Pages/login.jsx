function Login() {
  return ( 
    <div className='container' style={{minHeight:"100vh",display:"flex",flexDirection:"column"}}>
    <div style={{marginTop:"1rem"}}>
    <h1>Welcome to Giha Follow</h1>
    <p>Increase your Github Followers.</p>
    </div> 
        <div>
          <img style={{height:"45vh",width:"auto"}} src="/github-globe.gif" alt="github-globe"/>
        </div>
        <div><h2>
        Authentication through GitHub
        </h2>
        <button>get started</button>
        </div> 
      <p>Every logged in user can follow each other by a follow click.</p>
      <footer style={{background:" #141313",color:"white",marginTop:"auto"}}>
      <p><span>@MalanLast</span></p>
      </footer>
    </div>
  )
}

export default Login;