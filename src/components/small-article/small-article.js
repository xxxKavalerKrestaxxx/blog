import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import moment from 'moment'

import { addLike, deleteLike } from '../../blog-api/blog-api'
import { articlesPATH, gifLoadedPATH, errorImgPATH } from '../../pathes/pathes'

import classes from './small-article.module.scss'

const SmallArticle = ({ article }) => {
  const user = useSelector((state) => state.user.user)
  const [checked, setChecked] = useState(article.favorited)
  const [likeCounter, setLikeCounter] = useState(0)
  const [loadingImg, setLoadingImg] = useState(true)
  const dispatch = useDispatch()

  function setDate(date) {
    if (date) {
      const format = moment(date).format('MMMM D, YYYY')
      return format
    }
  }

  const handleChange = () => {
    setChecked((prevChecked) => !prevChecked)
    if (!checked) {
      setLikeCounter((cur) => cur + 1)
      dispatch(addLike(article.slug))
    }
    if (checked) {
      setLikeCounter((cur) => cur - 1)
      dispatch(deleteLike(article.slug))
    }
  }

  useEffect(() => {
    if (user) {
      setChecked(article.favorited)
    } else setChecked(false)
  }, [user, article])

  return (
    <div className={classes.ShortArticle}>
      <div className={classes.wrapper}>
        <div className={classes.title}>
          <p className={classes.title__text}>
            <Link to={articlesPATH + '/' + article.slug}>{article.title}</Link>
          </p>
          <label>
            <input
              type="checkbox"
              checked={checked}
              className={classes.like}
              onChange={handleChange}
              disabled={!user}
            />
            <span>{article.favoritesCount + likeCounter}</span>
          </label>
        </div>
        <ul className={classes.tag__list}>
          {article.tagList.map((tag, index) => (
            <li key={index}>
              <button className={classes.tag}>{tag}</button>
            </li>
          ))}
        </ul>

        <p className={classes.description}>{article.description}</p>
      </div>
      <div className={classes.user}>
        <div className={classes.user__wrapper}>
          <p className={classes.user__name}>{article.author.username}</p>
          <p className={classes.user__date}>{setDate(article.updatedAt)}</p>
        </div>

        <img
          className={classes.user__avatar}
          src={loadingImg ? gifLoadedPATH : article.author?.image}
          alt="user_avatar"
          onLoad={() => setLoadingImg(false)}
          onError={(e) => (e.currentTarget.src = errorImgPATH)}
        />
      </div>
    </div>
  )
}

export default SmallArticle
