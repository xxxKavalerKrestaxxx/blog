import React from 'react'
import { Link, Outlet } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'

import { setUser } from '../../redux/action'

import classes from './layout.module.scss'

const Layout = () => {
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
          <Link to="/articles">
            <button className={classes.blog_link}>Blog</button>
          </Link>
          <div className={classes.wrapper}>
            <Link to="/new-article">
              <button className={classes.create_article}>Create article</button>
            </Link>
            <div className={classes.username}>
              <Link to="/profile">{user?.username}</Link>
            </div>
            <div className={classes.userimage}>
              <Link to="/profile">
                <img
                  src={user?.image || '42'}
                  onError={(e) => (e.currentTarget.src = 'https://cdn-icons-png.flaticon.com/512/147/147140.png')}
                ></img>
              </Link>
            </div>

            <Link to="/articles">
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
          <Link to="/articles">
            <button className={classes.blog_link}>Blog</button>
          </Link>
          <div className={classes.wrapper}>
            <Link to="/sign-in">
              <button className={classes.sign_in}>Sign in</button>
            </Link>
            <Link to="/sign-up">
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
