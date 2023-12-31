import React from 'react'
import { Link } from 'react-router-dom'

import { articlesPATH } from '../../pathes/pathes'

import classes from './not-found.module.scss'

const NotFound = () => {
  return (
    <>
      <div className={classes.message}>
        <p>Oh no! The page is not found. </p>
        <p>Click the button to return to the main page</p>
      </div>
      <Link to={articlesPATH}>
        <button className={classes.btn__back}>Main page</button>
      </Link>
    </>
  )
}
export default NotFound
