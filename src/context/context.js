import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';

const rootUrl = 'https://api.github.com';

const GithubContext = React.createContext();

const GithubProvider = ({children}) =>{
  const [loading,setLoading] = useState(false);
  const [githubUser,setGithubUser] = useState('Aman12207');
  const [repo, setRepo] = useState([]);
  const [followers,setFollowers] = useState ([]);
  const [request,setRequest] = useState(0);
  const[error,setError] = useState({show:false, msg : ""});

  const SearchGithubUser = async (term) =>{
    setError({show:false,msg:""});
    setLoading(true);
    const response = await axios.get(`${rootUrl}/users/${term}`)
    .catch((err)=>{
      setError({show:true, msg : "There Is No User With That Username"})
      console.log(err);
    })
    if(response){
      setGithubUser(response.data);
      const {login,followers_url,repos_url} = response.data;
      // we can do it that way too but here we fetch data from repos first and then from followers
      //fetching repos
    //   const res = await axios.get(`${repos_url}?per_page=100`)
    //   .catch((err)=>{
    //     console.log(err);
    //   })
    //   console.log(res.data)
    //   setRepo(res.data);
    //   //fetching followers
    //   axios.get(`${followers_url}?per_page=100}`)
    //   .then((response)=>{
    //     setFollowers(response.data);
    //   })
    //   .catch((err)=>{
    //     console.log(err);
    //   })
    // }

      // using Promise.allSettled();
      const repositories =  axios(`${repos_url}?per_page=100`);
      const followers = axios(`${followers_url}?per_page=100}`)
      Promise.allSettled([repositories,followers])
      .then((result)=>{
        const [repos,followers] = result;
        const status = "fulfilled";
        console.log(repos,followers);
        if(repos.status === status){
          setRepo(repos.value.data);
          // console.log(repos.value.data);
        }
        if(followers.status === status){
            setFollowers(followers.value.data);
        }
      })
      .catch((err)=>{
        console.log(err);
      })
    }
    
    CheckRequests();
    setLoading(false);
  }

  const CheckRequests = () =>{
    axios.get(`${rootUrl}/rate_limit`).then(({data})=>{
      let {rate : {remaining}} = data;
      setRequest(remaining)
      if(!remaining){
          setError({show:true, msg:"Sorry You have exceeded your hourly rate limit!"})
      }
    }).catch((err)=>{
      console.log(err);
    })
  }
  
  useEffect(()=>{
    CheckRequests();
  },[])

  useEffect(()=>{
    SearchGithubUser('Aman12207')
  },[])
  
  return <GithubContext.Provider value={{loading, githubUser,repo,followers,request,error,SearchGithubUser}}>{children}</GithubContext.Provider>
}

export const useGlobalContext = () =>{
  return useContext(GithubContext);
}

export {GithubContext,GithubProvider}