import FollowBtn from "./FollowBtn";
function FollowingUser({users, currUser, isfollowing, setIsfollowing}) {
	const followingUsers=users
	.filter(user=>user._id!==currUser._id)
	.filter(user=>isfollowing[user.username]);
  return (
	<>
		{
		followingUsers.map((user)=>(
		<div className="col-6 col-md-3 " key={user._id}>
		<div className='card cardDesign'>
		<img style={{cursor:"pointer"}}
		onClick={()=>window.open(user.profileUrl,"_blank")}
		src={user.avatar} alt={user.username} className='card-img-top'/>
		<div className="card-body">
			<h4 className="card-title">{user.name}</h4>
			<h5 className="card-subtitle mb-2 text-body-secondary">{user.username}</h5>
			<p className="card-text">{user.bio}</p>
			<FollowBtn 
			    isfollowing={isfollowing}
				user={user}
				setIsfollowing={setIsfollowing}
			/>
		</div>
		</div>
		</div>
		))
		}
	</>
  )
}

export default FollowingUser;