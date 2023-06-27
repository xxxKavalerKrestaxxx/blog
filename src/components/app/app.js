import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Routes, Route } from 'react-router-dom'

import Layout from '../layout/layout'
import useBlogAPI from '../../custom-hooks/use-blog-api'
import AllArticles from '../all-articles/all-articles'
import NotFound from '../not-found/not-found'
import Spinner from '../spinner/spinner'
import BigArticle from '../big-article/big-article'
import { setWarnings, setLoaded, setUser } from '../../redux/action'
import SignIn from '../sign-in/sign-in'
import SignUp from '../sign-up/sing-up'
import EditProfile from '../edit-profile/edit-profile'
import CreateArticle from '../create-erticle/create-article'
import UpdateArticle from '../update-article/update-article'

import classes from './app.module.scss'

const App = () => {
  const dispatch = useDispatch()
  const loaded = useSelector((state) => state.warnings.loaded)
  const { fetcher } = useBlogAPI()
  useEffect(() => {
    const fetcherArticles = async () => {
      if (!navigator.onLine) {
        dispatch(setWarnings('Отсутствует подключение к интернету.'))
      }
      dispatch(setLoaded(true))
      if (localStorage.getItem('token')) {
        await dispatch(fetcher.getUser())
      } else {
        dispatch(setUser(false))
      }

      dispatch(setLoaded(false))
    }

    fetcherArticles()
  }, [])

  if (loaded) {
    return (
      <div className={classes.App}>
        <Routes>
          <Route index element={<AllArticles />} />
          <Route path="sign-in" element={<SignIn />} />
        </Routes>
        <Spinner />
      </div>
    )
  } else
    return (
      <div className={classes.App}>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<AllArticles />} />
            <Route path="articles" element={<AllArticles />} />
            <Route path="articles/:slug" element={<BigArticle />} />
            <Route path="sign-in" element={<SignIn />} />
            <Route path="sign-up" element={<SignUp />} />
            <Route path="profile" element={<EditProfile />} />
            <Route path="new-article" element={<CreateArticle />} />
            <Route path="articles/:slug/edit" element={<UpdateArticle />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </div>
    )
}
export default App
