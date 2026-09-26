import axios from "axios";
import { useEffect } from "react";

function FollowBtn({isfollowing, user, setIsfollowing}) {
 
 
  return (
	<>
	<button className="btn followBtn d-block mx-auto">
		{isfollowing[user.username]?"Following":"Follow"}
	</button>
	</>
  )
}

export default FollowBtn;