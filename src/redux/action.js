import { createAction } from 'redux-action'

export const setAllArticles = createAction('SET_ALL_ARTICLES', (data) => ({
  articles: data.articles,
  articlesCount: data.articlesCount,
}))

export const setOneArticle = createAction('SET_ONE_ARTICLE', (article) => ({
  article,
}))
export const setWarnings = createAction('SET_WARNINGS', (data) => ({
  warnings: data,
}))
export const setLoaded = createAction('SET_LOADED', (data) => ({
  loaded: data,
}))
export const setUser = createAction('SET_USER_DATA', (data) => ({
  user: data,
}))
export const setUserError = createAction('SET_USER_ERROR', (data = {}) => ({
  error: data,
}))
