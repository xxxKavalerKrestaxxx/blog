import { combineReducers } from 'redux'

const articlesState = {
  articles: [],
  article: '',
}

const articlesReducer = (state = articlesState, action) => {
  switch (action.type) {
    case 'SET_ALL_ARTICLES':
      return {
        ...state,
        articles: action.payload.articles,
        articlesCount: action.payload.articlesCount,
      }
    case 'SET_ONE_ARTICLE':
      return {
        ...state,
        article: action.payload.article,
      }

    default:
      return state
  }
}
const warningsAndLoadState = {
  loaded: false,
  warnings: [],
}

const warningsAndLoadReducer = (state = warningsAndLoadState, action) => {
  switch (action.type) {
    case 'SET_WARNINGS':
      return {
        ...state,
        warnings: state.warnings.concat(action.payload.warnings),
      }
    case 'SET_LOADED':
      return {
        ...state,
        loaded: action.payload.loaded,
      }

    default:
      return state
  }
}

const userState = {
  user: {},
  error: {},
}
const userReducer = (state = userState, action) => {
  switch (action.type) {
    case 'SET_USER_DATA':
      return {
        ...state,
        user: action.payload.user,
      }
    case 'SET_USER_ERROR':
      return {
        ...state,
        error: action.payload.error,
      }

    default:
      return state
  }
}

const rootReducer = combineReducers({
  articles: articlesReducer,
  warnings: warningsAndLoadReducer,
  user: userReducer,
})

export default rootReducer
