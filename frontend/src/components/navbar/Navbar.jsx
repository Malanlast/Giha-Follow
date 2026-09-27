function Navbar() {
  return (
	<nav class="navbar bg-body-tertiary" style={{marginTop:"1rem"}}>
	<form class="container-fluid justify-content-start">
		<button class="btn btn-sm btn-outline-success me-2" type="button">New Users</button>
		<button class="btn btn-sm btn-outline-secondary" type="button">Followings</button>
	</form>
	</nav>
  )
}

export default Navbar