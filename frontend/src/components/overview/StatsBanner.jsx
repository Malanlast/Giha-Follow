import './StatsBanner.css';
import { useEffect, useState } from "react";
import axios from "axios";
const statsConfig=[
    {
        id:1,
        label:"Followers",
        icon:"bi-people",
        color:"followers",
        key:"followers"
    },
    {
        id:2,
        label:"Following",
        icon:"bi-person-check",
        color:"following",
        key:"following"
    },
    {
        id:3,
        label:"Total Stars",
        icon:"bi-star",
        color:"stars",
        key:"totalStars"
    },
];
function StatsBanner() {
    const[stats,setStats]=useState({
        followers:0,
        following:0,
        totalStars:0
    });
    const [loading, setLoading]=useState(true);
    useEffect(()=>{
        const fetchGitHubStats=async()=>{
            try{
                const response=await axios.get(
                    "http://localhost:5000/api/users/github-stats",
                    {withCredentials:true}
                );
                setStats(response.data);
            }catch(err){
                console.log("Failed to fetch GitHub stats:",
                    err.response?.data || err.message
                );
            }finally{
                setLoading(false);
            }
        };
        fetchGitHubStats();
    },[]);
  return (
    <section className="stats-banner">
        {statsConfig.map((stat)=>(
            <div className="stats-card" key={stat.id}>
                <div className={`stats-icon ${stat.color}`}>
                    <i className={`bi ${stat.icon}`}></i>
                </div>
                <div className="stats-info">
                    <h3>
                        {loading
                        ?"..."
                        :stats[stat.key].toLocaleString("en-IN")}
                    </h3>
                    <p>{stat.label}</p>
                </div>
            </div>
        ))}
    </section>
  );
}
export default StatsBanner;