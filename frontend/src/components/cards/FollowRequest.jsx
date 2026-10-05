import FollowBtn from "./FollowBtn";
function FollowRequest({isFollowRequest, isfollowing, setIsfollowing}) {
  return (
	<>
		{
		isFollowRequest.filter(user=>!isfollowing[user.username])
		.map((user)=>(
		<div className="col-6 col-md-3" key={user._id}>
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

export default FollowRequest;