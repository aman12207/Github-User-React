import React from 'react';
import styled from 'styled-components';
import { useGlobalContext } from '../context/context';
import { ExampleChart, Pie3D, Column3D, Bar3D, Doughnut2D } from './Charts';

const Languages = () =>{
  const {repo} = useGlobalContext();
  let languages = repo.reduce((total,current)=>{
    const {language} = current;
    if(!language) return total;
    // console.log(language)
    if(total[language])
      total[language] = {label : language , value : total[language].value + 1};
    else 
    total[language] = {label: language ,value : 1}; 
    return total;
  },{})
  
  // now converting it into array 
  const final_lang = Object.values(languages)
  // console.log(final_lang)

  // picking 5 top languages 
  final_lang.sort((first,second)=>{
    return first.value > second.value;
  }).slice(0,5);
  // console.log(final_lang)
  return final_lang;
}

const MaxStars = () =>{
  const {repo} = useGlobalContext();
  let starsInRepo = repo.reduce((total,current)=>{
    const {language,stargazers_count} = current;
    // console.log(language,stargazers_count)
    if(!language) return total;
    if(total[language])
      total[language] = {label : language , value : total[language].value + stargazers_count};
    else 
    total[language] = {label: language ,value : stargazers_count}; 
    return total;
  },{})
  
  // now converting it into array 
  const final = Object.values(starsInRepo)

  // picking 5 top languages with maxm stars
  final.sort((first,second)=>{
    return first.value > second.value;
  }).slice(0,5);
  // console.log(final_lang)
  return final;
}

const Most_popular_forked = () =>{
  const {repo} = useGlobalContext();
  let {stars,forks} = repo.reduce((total,item)=>{
    const {stargazers_count,name,forks} = item;
    total.stars[stargazers_count] = {
      label: name,
      value:stargazers_count
    };
    total.forks[forks] = {
      label: name,
      value:forks
    }
    return total;
  },
  {stars : {},forks:{}})
  const f_stars = Object.values(stars).slice(-5).reverse();
  const f_forks = Object.values(forks).slice(-5).reverse();
  return {f_stars,f_forks}
}

const Repos = () => {
  const final_lang = Languages();   // this function will return all tha languages with their no of repos
  const final_stars = MaxStars();
  const {f_stars,f_forks} = Most_popular_forked();
  return <section className='section'>
      <Wrapper className='section-center'>
        <Pie3D data={final_lang}/>
        <Column3D data={f_stars}/>
        <Doughnut2D data={final_stars}/>
        <Bar3D data={f_forks} />
      </Wrapper>
  </section>
};


const Wrapper = styled.div`
  display: grid;
  justify-items: center;
  gap: 2rem;
  @media (min-width: 800px) {
    grid-template-columns: 1fr 1fr;
  }

  @media (min-width: 1200px) {
    grid-template-columns: 2fr 3fr;
  }

  div {
    width: 100% !important;
  }
  .fusioncharts-container {
    width: 100% !important;
  }
  svg {
    width: 100% !important;
    border-radius: var(--radius) !important;
  }
`;

export default Repos;
