import './loginComponent.css';
function DetailsBox() {
  return (
	<>
	<div className='row cardBox'>
      <div className='col-12 col-md-3 detailsCard'>
        <h2>
        Discover Users</h2>
        <hr/>
        <p>Explore profiles of users who have joined the platform and view their GitHub information in one place.</p>
      </div>
      <div className='col-12 col-md-3 detailsCard'>
        <h2>
        Follow & Connect</h2>
        <hr/>
         <p>Follow or unfollow other users through authorised GitHub functionality with a simple click.</p>
      </div>
      <div className='col-12 col-md-3 detailsCard'>
        <h2>
        User Profiles</h2>
        <hr/>
         <p>View useful profile information such as username, bio, followers, following, repositories, and GitHub profile link.</p>
      </div> 
    </div>
	</>
  )
}

export default DetailsBox;