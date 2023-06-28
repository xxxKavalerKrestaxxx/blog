import React, { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import ReactMarkdown from 'react-markdown'
import { useDispatch, useSelector } from 'react-redux'
import moment from 'moment'
import { Popconfirm, message } from 'antd'

import Spinner from '../spinner/spinner'
import { getOnePage, addLike, deleteLike, deleteArticle } from '../../blog-api/blog-api'
import { articlesPATH } from '../../pathes/pathes'

import classes from './big-article.module.scss'
import './big-article.css'

const BigArticle = () => {
  const { slug } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const oneArticle = useSelector((state) => state.articles.article)
  const [checked, setChecked] = useState(false)
  const [loadingImg, setLoadingImg] = useState(true)
  const [likeCounter, setLikeCounter] = useState(0)
  const [loading, setLoading] = useState(true)
  const user = useSelector((state) => state.user.user)
  useEffect(() => {
    const fetchFunc = async () => {
      await dispatch(getOnePage(slug))
      setLoading(false)
    }
    fetchFunc()
  }, [slug])

  const handleLikeChange = () => {
    setChecked((checked) => !checked)

    if (!checked) {
      setLikeCounter((cur) => cur + 1)
      dispatch(addLike(slug))
    }
    if (checked) {
      setLikeCounter((cur) => cur - 1)
      dispatch(deleteLike(slug))
    }
  }

  const setDate = (date) => {
    if (date) {
      const format = moment(date).format('MMMM D, YYYY')
      return format
    }
  }
  const onDeleted = () => {
    dispatch(deleteArticle(slug))
    message.success('deleted')
    navigate(articlesPATH)
  }

  useEffect(() => {
    if (oneArticle) {
      setChecked(oneArticle.favorited)
    }
  }, [oneArticle])
  const buttons =
    oneArticle?.author?.username === user.username && user ? (
      <>
        <Popconfirm
          className={classes.ant_popover}
          placement="bottom"
          title="Delete the article"
          content="Are you sure to delete this article?"
          onConfirm={onDeleted}
          okText="Yes"
          cancelText="No"
        >
          <button className={classes.delete}>Delete</button>
        </Popconfirm>
        <Link to="edit">
          <button className={classes.edit}>Edit</button>
        </Link>
      </>
    ) : null

  if (loading)
    return (
      <div>
        <Spinner />
      </div>
    )
  else
    return (
      <>
        <div className={classes.Article}>
          <div className={classes.wrapper}>
            <div className={classes.title}>
              <p className={classes.title__text}>{oneArticle?.title} </p>
              <label>
                <input
                  type="checkbox"
                  className={classes.like}
                  checked={checked}
                  onChange={handleLikeChange}
                  disabled={!user}
                />
                <span>{oneArticle?.favoritesCount ? oneArticle?.favoritesCount + likeCounter : likeCounter}</span>
              </label>
            </div>
            <ul className={classes.tag__list}>
              {oneArticle?.tagList?.map((tag, index) => {
                return (
                  <li key={index}>
                    <button className={classes.tag}>{tag}</button>
                  </li>
                )
              })}
            </ul>

            <p className={classes.description}>{oneArticle?.description}</p>
            <div>
              <ReactMarkdown>{oneArticle.body}</ReactMarkdown>
            </div>
          </div>
          <div className={classes.userinfo}>
            <div className={classes.user}>
              <div className={classes.user__wrapper}>
                <p className={classes.user__name}>{oneArticle?.author?.username}</p>
                <p className={classes.user__date}>{setDate(oneArticle?.updatedAt)}</p>
              </div>
              <img
                className={classes.user__avatar}
                src={
                  loadingImg
                    ? 'https://powerusers.microsoft.com/t5/image/serverpage/image-id/118082i204C32E01666789C/image-size/large/is-moderation-mode/true?v=v2&px=999'
                    : oneArticle?.author?.image
                }
                alt="user_avatar"
                onLoad={() => setLoadingImg(false)}
                onError={(e) => (e.currentTarget.src = 'https://cdn-icons-png.flaticon.com/512/147/147140.png')}
              />
            </div>
            <div className={classes.user__buttons}>{buttons}</div>
          </div>
        </div>
      </>
    )
}

export default BigArticle
