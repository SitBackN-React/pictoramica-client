import React from 'react'
// import { Link } from 'react-router-dom'
// import apiUrl from './../../apiConfig'
import AllImages from './AllImages'
import AllBlogs from './AllBlogs'

const HomePage = (props) => {
  const styles = {
    floatContainer: { position: 'absolute', width: '85%' },
    floatChild: { width: '40%', float: 'left', padding: '10px', border: '2px solid gray', display: 'block', marginRight: '20px' }
  }

  return (
    <React.Fragment>
      <h1>Pictoramica</h1>
      <div style={ styles.floatContainer }>
        <div style={ styles.floatChild }>
          <AllImages
            {...props}
          />
        </div>
        <div style={ styles.floatChild }>
          <AllBlogs
            {...props}
          />
        </div>
      </div>
    </React.Fragment>
  )
}

export default HomePage
