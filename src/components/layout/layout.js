import React from 'react'
import { Link, Outlet } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'

import { setUser } from '../../redux/action'
import { articlesPATH, newArticlePATH, profilePATH, signInPATH, signUpPATH } from '../../pathes/pathes'

import classes from './layout.module.scss'

const Layout = () => {
  const errorIc = 'https://cdn-icons-png.flaticon.com/512/147/147140.png'
  const dispatch = useDispatch()
  const buttonLog = () => {
    localStorage.removeItem('token')
    dispatch(setUser(false))
  }
  const user = useSelector((state) => state.user.user)
  if (localStorage.getItem('token')) {
    return (
      <>
        <header className={classes.header}>
          <Link to={articlesPATH}>
            <button className={classes.blog_link}>Blog</button>
          </Link>
          <div className={classes.wrapper}>
            <Link to={newArticlePATH}>
              <button className={classes.create_article}>Create article</button>
            </Link>
            <div className={classes.username}>
              <Link to={profilePATH}>{user?.username}</Link>
            </div>
            <div className={classes.userimage}>
              <Link to={profilePATH}>
                <img src={user?.image || '42'} onError={(e) => (e.currentTarget.src = errorIc)}></img>
              </Link>
            </div>

            <Link to={articlesPATH}>
              <button className={classes.log_out} onClick={buttonLog}>
                Log out
              </button>
            </Link>
          </div>
        </header>
        <main className={classes.main}>
          <Outlet />
        </main>
      </>
    )
  } else
    return (
      <>
        <header className={classes.header}>
          <Link to={articlesPATH}>
            <button className={classes.blog_link}>Blog</button>
          </Link>
          <div className={classes.wrapper}>
            <Link to={signInPATH}>
              <button className={classes.sign_in}>Sign in</button>
            </Link>
            <Link to={signUpPATH}>
              <button className={classes.sign_up}>Sign up</button>
            </Link>
          </div>
        </header>
        <main className={classes.main}>
          <Outlet />
        </main>
      </>
    )
}

export default Layout
