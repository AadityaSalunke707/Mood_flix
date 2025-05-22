import React from 'react'

const Search = ({SearchTerm,setSearchTerm}) => {
  return (
    <div className="search">
        <div>
            <img src="search.svg" alt="Search button" />
            <input type="text"
            placeholder="Search through thousand of Movies"
            value={SearchTerm} 
            onChange={(e)=>setSearchTerm(e.target.value)}
            />
        </div>
    </div>
  )
}

export default Search