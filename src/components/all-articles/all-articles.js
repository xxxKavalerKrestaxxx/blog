import React, { useState, useEffect } from 'react'
import { Pagination } from 'antd'
import { useSelector, useDispatch } from 'react-redux'

import SmallArticle from '../small-article/small-article'
import useBlogAPI from '../../custom-hooks/use-blog-api'

import classes from './all-articles.module.scss'

const AllArticles = () => {
  const articles = useSelector((state) => state.articles.articles)
  const articlesCount = useSelector((state) => state.articles.articlesCount)
  const [currentPage, setCurrentPage] = useState(1)
  const dispatch = useDispatch()
  const { fetcher } = useBlogAPI()
  const user = useSelector((state) => state.user.user)

  useEffect(() => {
    const fetchFunc = async () => {
      await dispatch(fetcher.getAllArticlesWithLikes(currentPage))
    }
    fetchFunc(articles)
  }, [currentPage, dispatch, user])

  return (
    <>
      <ul className={classes.list}>
        {articles.map((item, index) => (
          <li key={index}>
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
