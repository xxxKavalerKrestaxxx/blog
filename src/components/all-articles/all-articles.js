import React, { useState, useEffect } from 'react'
import { Pagination } from 'antd'
import { useSelector, useDispatch } from 'react-redux'

import SmallArticle from '../small-article/small-article'
import { setLoaded } from '../../redux/action'
import { getAllArticlesWithLikes } from '../../blog-api/blog-api'

import classes from './all-articles.module.scss'

const AllArticles = () => {
  const articles = useSelector((state) => state.articles.articles)
  const articlesCount = useSelector((state) => state.articles.articlesCount)
  const [currentPage, setCurrentPage] = useState(1)
  const dispatch = useDispatch()

  const user = useSelector((state) => state.user.user)

  useEffect(() => {
    dispatch(setLoaded(true))
    const fetchFunc = async () => {
      if (currentPage == 1) await dispatch(getAllArticlesWithLikes(parseInt(0)))
      else await dispatch(getAllArticlesWithLikes(parseInt(currentPage * 20 - 20)))
    }
    fetchFunc(articles)
    dispatch(setLoaded(false))
  }, [currentPage, dispatch, user])

  return (
    <>
      <ul className={classes.list}>
        {articles.map((item, index) => (
          <li key={index - 1}>
            <SmallArticle article={item} />
          </li>
        ))}
      </ul>

      <Pagination
        total={articlesCount}
        style={{ textAlign: 'center', marginBottom: '15px' }}
        pageSize={20}
        showSizeChanger={false}
        onChange={(page) => setCurrentPage(page)}
        current={currentPage}
      />
    </>
  )
}

export default AllArticles
