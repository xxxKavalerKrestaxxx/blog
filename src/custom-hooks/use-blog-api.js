import { useMemo } from 'react'

import BlogAPI from '../blog-api/blog-api'

const useBlogAPI = () => {
  const fetcher = useMemo(() => new BlogAPI(), [])
  return {
    fetcher,
    getAllArticles: fetcher.getAllArticles,
    getOnePage: fetcher.getOnePage,
    setUserError: fetcher.setUserError,
    getUser: fetcher.getUser,
    updateArticle: fetcher.updateArticle,
  }
}

export default useBlogAPI
