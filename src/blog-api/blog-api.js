import axios, { AxiosError } from 'axios'

import { setAllArticles, setOneArticle, setWarnings, setLoaded, setUser, setUserError } from '../redux/action'

export default class BlogAPI {
  constructor() {
    ;(this.url = 'https://blog.kata.academy/api/'), (this.token = localStorage.getItem('token'))
  }

  getAllArticles(page = 1) {
    return async (dispatch) => {
      try {
        const response = await fetch(`${this.url}articles?offset=${page}`)
        if (!response.ok) {
          dispatch(setWarnings('Ошибка при получении статей'))
        } else {
          const data = await response.json()
          dispatch(setAllArticles(data))
          return data
        }
      } catch (error) {
        dispatch(setLoaded(false))
        dispatch(setWarnings('Ошибка при получении статей', `${error.toString()}`))
      }
    }
  }
  getAllArticlesWithLikes(page = 1) {
    return async (dispatch) => {
      try {
        const response = await axios.get(`${this.url}articles?offset=${page}`, {
          headers: {
            Authorization: `Token ${this.token}`,
            'Content-Type': 'application/json',
          },
        })
        if (response.status !== 200) {
          dispatch(setWarnings('Ошибка при получении статей'))
        } else {
          await dispatch(setAllArticles(response.data))
          return response.data
        }
      } catch (error) {
        dispatch(setLoaded(false))
        dispatch(setWarnings('Ошибка при получении статей', `${error.toString()}`))
      }
    }
  }

  getOnePage(slug) {
    return async (dispatch) => {
      try {
        const response = await axios.get(`https://blog.kata.academy/api/articles/${slug}`, {
          headers: {
            Authorization: `Token ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json',
          },
        })

        if (response.status !== 200) {
          dispatch(setWarnings('Ошибка при получении статьи'))
        } else {
          await dispatch(setOneArticle(response.data.article))
          return response.data.article
        }
      } catch (error) {
        dispatch(setWarnings('Ошибка при получении статьи', `${error.toString()}`))
      }
    }
  }
  postRegistration(data) {
    return async (dispatch) => {
      try {
        const response = await axios.post(
          `${this.url}users`,
          {
            user: data,
          },
          {
            headers: {
              'Content-Type': 'application/json',
            },
          }
        )
        localStorage.setItem('token', response.data.user.token)
        await dispatch(setUserError('none'))
        dispatch(setUser(response.data.user))
        this.getAllArticlesWithLikes()
      } catch (error) {
        if (error instanceof AxiosError) {
          const errors = Object.entries(error?.response?.data.errors)[0][0]
          await dispatch(setUserError(errors))
        }
      }
    }
  }
  postLogin(data) {
    return async (dispatch) => {
      try {
        dispatch(setLoaded(true))
        const response = await axios.post(
          `${this.url}users/login`,
          {
            user: data,
          },
          {
            headers: {
              'Content-Type': 'application/json',
            },
          }
        )

        await dispatch(setUserError('none'))
        dispatch(setUser(response.data.user))
        dispatch(setLoaded(false))
        localStorage.setItem('token', response.data.user.token)
      } catch (error) {
        if (error instanceof AxiosError) {
          const errors = Object.entries(error?.response?.data.errors)[0][0]
          await dispatch(setUserError(errors))
          dispatch(setLoaded(false))
        }
      }
    }
  }
  getUser() {
    return async (dispatch) => {
      try {
        const response = await axios.get(`${this.url}user`, {
          headers: {
            Authorization: `Token ${this.token}`,
            'Content-Type': 'application/json',
          },
        })
        dispatch(setUser(response.data.user))
      } catch (error) {
        if (error instanceof AxiosError) {
          const errors = Object.entries(error?.response?.data.errors)[0][0]
          dispatch(setUserError(errors))
        }
      }
    }
  }
  updateProfile = (data) => {
    return async (dispatch) => {
      try {
        const response = await axios.put(
          `${this.url}user`,
          {
            user: data,
          },
          {
            headers: {
              Authorization: `Token ${this.token}`,
              'Content-Type': 'application/json',
            },
          }
        )

        dispatch(setUserError('none'))
        dispatch(setUser(response.data.user))
        localStorage.setItem('token', response.data.user.token)
      } catch (error) {
        if (error instanceof AxiosError) {
          const errors = Object.entries(error?.response?.data.errors)[0][0]
          dispatch(setUserError(errors))
        }
      }
    }
  }
  createArticle(data) {
    return async (dispatch) => {
      try {
        dispatch(setLoaded(true))
        const response = await axios.post(
          `${this.url}articles`,
          {
            article: data,
          },
          {
            headers: {
              Authorization: `Token ${this.token}`,
              'Content-Type': 'application/json',
            },
          }
        )
        dispatch(setLoaded(false))
        return response.data
      } catch (error) {
        dispatch(setWarnings('Ошибка при создании статьи', `${error.toString()}`))
      }
    }
  }
  updateArticle(data, slug) {
    return async (dispatch) => {
      try {
        const response = await axios.put(
          `${this.url}articles/${slug}`,
          {
            article: data.updateData,
          },
          {
            headers: {
              Authorization: `Token ${this.token}`,
              'Content-Type': 'application/json',
            },
          }
        )
        return await dispatch(setOneArticle(response.data))
      } catch (error) {
        dispatch(setWarnings('Ошибка при создании статьи', `${error.toString()}`))
      }
    }
  }
  deleteArticle(slug) {
    return async (dispatch) => {
      try {
        dispatch(setLoaded(true))
        await axios.delete(`${this.url}articles/${slug}`, {
          headers: {
            Authorization: `Token ${this.token}`,
            'Content-Type': 'application/json',
          },
        })
        this.getAllArticlesWithLikes()
        dispatch(setLoaded(false))
      } catch (error) {
        dispatch(setWarnings('Ошибка при УДАЛЕНИИ статьи', `${error.toString()}`))
      }
    }
  }
  addLike(slug) {
    return async (dispatch) => {
      try {
        await axios.post(
          `${this.url}articles/${slug}/favorite`,
          {},
          {
            headers: {
              Authorization: `Token ${this.token}`,
              'Content-Type': 'application/json',
            },
          }
        )
      } catch (error) {
        dispatch(setWarnings('Ошибка лайка', `${error.toString()}`))
      }
    }
  }
  deleteLike(slug) {
    return async (dispatch) => {
      try {
        await axios.delete(`${this.url}articles/${slug}/favorite`, {
          headers: {
            Authorization: `Token ${this.token}`,
            'Content-Type': 'application/json',
          },
        })
      } catch (error) {
        dispatch(setWarnings('Ошибка лайка', `${error.toString()}`))
      }
    }
  }
}
