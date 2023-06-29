import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Routes, Route } from 'react-router-dom'

import Layout from '../layout/layout'
import AllArticles from '../all-articles/all-articles'
import NotFound from '../not-found/not-found'
import Spinner from '../spinner/spinner'
import BigArticle from '../big-article/big-article'
import { setWarnings, setLoaded, setUser } from '../../redux/action'
import SignIn from '../sign-in/sign-in'
import SignUp from '../sign-up/sing-up'
import EditProfile from '../edit-profile/edit-profile'
import CreateArticle from '../create-article/create-article'
import UpdateArticle from '../update-article/update-article'
import {
  articlesPATH,
  articlesSlugPATH,
  signInPATH,
  signUpPATH,
  profilePATH,
  newArticlePATH,
  editArticlePATH,
} from '../../pathes/pathes'
import { getUser } from '../../blog-api/blog-api'

import classes from './app.module.scss'

const App = () => {
  const dispatch = useDispatch()
  const loaded = useSelector((state) => state.warnings.loaded)
  useEffect(() => {
    const fetcherArticles = async () => {
      if (!navigator.onLine) {
        dispatch(setWarnings('Отсутствует подключение к интернету.'))
      }
      dispatch(setLoaded(true))
      if (localStorage.getItem('token')) {
        await dispatch(getUser())
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
          <Route path="/" element={<Layout />}></Route>
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
            <Route path={articlesPATH} element={<AllArticles />} />
            <Route path={articlesSlugPATH} element={<BigArticle />} />
            <Route path={signInPATH} element={<SignIn />} />
            <Route path={signUpPATH} element={<SignUp />} />
            <Route path={profilePATH} element={<EditProfile />} />
            <Route path={newArticlePATH} element={<CreateArticle />} />
            <Route path={editArticlePATH} element={<UpdateArticle />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </div>
    )
}
export default App
