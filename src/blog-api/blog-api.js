import axios, { AxiosError } from 'axios'

import { setAllArticles, setOneArticle, setWarnings, setLoaded, setUser, setUserError } from '../redux/action'
const url = 'https://blog.kata.academy/api/'
const token = localStorage.getItem('token')

export const getAllArticlesWithLikes = (page = 0) => {
  return async (dispatch) => {
    dispatch(setLoaded(true))
    try {
      const response = await axios.get(`${url}articles?limit=20&offset=${page}`, {
        headers: {
          Authorization: `Token ${token}`,
          'Content-Type': 'application/json',
        },
      })
      if (response.status !== 200) {
        dispatch(setWarnings('Ошибка при получении статей'))
        dispatch(setLoaded(false))
      } else {
        await dispatch(setAllArticles(response.data))
        dispatch(setLoaded(false))
        return response.data
      }
    } catch (error) {
      dispatch(setLoaded(false))
      dispatch(setWarnings('Ошибка при получении статей', `${error.toString()}`))
    }
  }
}

export const getOnePage = (slug) => {
  return async (dispatch) => {
    try {
      const response = await axios.get(`${url}articles/${slug}`, {
        headers: {
          Authorization: `Token ${token}`,
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
export const postRegistration = (data) => {
  return async (dispatch) => {
    try {
      const response = await axios.post(
        `${url}users`,
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
      getAllArticlesWithLikes()
    } catch (error) {
      if (error instanceof AxiosError) {
        const errors = Object.entries(error?.response?.data.errors)[0][0]
        await dispatch(setUserError(errors))
      }
    }
  }
}
export const postLogin = (data) => {
  return async (dispatch) => {
    try {
      dispatch(setLoaded(true))
      const response = await axios.post(
        `${url}users/login`,
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
export const getUser = () => {
  return async (dispatch) => {
    try {
      const response = await axios.get(`${url}user`, {
        headers: {
          Authorization: `Token ${token}`,
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
export const updateProfile = (data) => {
  return async (dispatch) => {
    try {
      const response = await axios.put(
        `${url}user`,
        {
          user: data,
        },
        {
          headers: {
            Authorization: `Token ${token}`,
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
export const createArticle = (data) => {
  return async (dispatch) => {
    try {
      dispatch(setLoaded(true))
      const response = await axios.post(
        `${url}articles`,
        {
          article: data,
        },
        {
          headers: {
            Authorization: `Token ${token}`,
            'Content-Type': 'application/json',
          },
        }
      )
      return response.data
    } catch (error) {
      dispatch(setWarnings('Ошибка при создании статьи', `${error.toString()}`))
    }
  }
}
export const updateArticle = (data, slug) => {
  return async (dispatch) => {
    try {
      const response = await axios.put(
        `${url}articles/${slug}`,
        {
          article: data.updateData,
        },
        {
          headers: {
            Authorization: `Token ${token}`,
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
export const deleteArticle = (slug) => {
  return async (dispatch) => {
    try {
      dispatch(setLoaded(true))
      await axios.delete(`${url}articles/${slug}`, {
        headers: {
          Authorization: `Token ${token}`,
          'Content-Type': 'application/json',
        },
      })
      getAllArticlesWithLikes()
      dispatch(setLoaded(false))
    } catch (error) {
      dispatch(setWarnings('Ошибка при УДАЛЕНИИ статьи', `${error.toString()}`))
      dispatch(setLoaded(false))
    }
  }
}
export const addLike = (slug) => {
  return async (dispatch) => {
    try {
      await axios.post(
        `${url}articles/${slug}/favorite`,
        {},
        {
          headers: {
            Authorization: `Token ${token}`,
            'Content-Type': 'application/json',
          },
        }
      )
    } catch (error) {
      dispatch(setWarnings('Ошибка лайка', `${error.toString()}`))
    }
  }
}
export const deleteLike = (slug) => {
  return async (dispatch) => {
    try {
      await axios.delete(`${url}articles/${slug}/favorite`, {
        headers: {
          Authorization: `Token ${token}`,
          'Content-Type': 'application/json',
        },
      })
    } catch (error) {
      dispatch(setWarnings('Ошибка лайка', `${error.toString()}`))
    }
  }
}
