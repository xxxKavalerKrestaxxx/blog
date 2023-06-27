import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { message } from 'antd'

import useBlogAPI from '../../custom-hooks/use-blog-api'
import { setUserError } from '../../redux/action'

import classes from './sing-in.module.scss'

const SignIn = () => {
  const { fetcher } = useBlogAPI()
  const dispatch = useDispatch()

  const navigate = useNavigate()
  const error = useSelector((state) => state.user.error)

  const {
    register,
    formState: { errors },
    handleSubmit,
    setError,
  } = useForm({ mode: 'onBlur' })

  const onSubmit = handleSubmit(async (data) => {
    const { email, password } = data
    const authData = {
      email,
      password,
    }
    await dispatch(fetcher.postLogin(authData))
  })

  useEffect(() => {
    if (error === 'email or password') {
      setError('email', { type: 'custom', message: 'Email is not registered' })
      setError('password', { type: 'custom', message: 'Or password is wrong' })
    }
    if (error === 'none') {
      message.success('good')
      dispatch(setUserError())
      navigate('/articles')
    }
  }, [error, setError])

  return (
    <div className={classes.wrapper}>
      <h2 className={classes.header}>Sign In</h2>
      <form className={classes.form} onSubmit={onSubmit}>
        <label className={classes.label}>
          Email address
          <input
            placeholder="Email address"
            style={errors.email ? { border: '1px solid red' } : { border: '1px solid #d9d9d9' }}
            {...register('email', {
              required: 'This field is required',

              pattern: {
                value:
                  /^[a-z0-9-]+(\.[\w-]+)*@([a-z0-9-]+(\.[a-z0-9-]+)*?\.[a-z]{2,6}|(\d{1,3}\.){3}\d{1,3})(:\d{4})?$/g,
                message: 'Email is not valid',
              },
            })}
          ></input>
        </label>
        <div className={classes.error}>{errors.email && <p>{errors?.email.message}</p>}</div>

        <label className={classes.label}>
          Password
          <input
            style={errors.password ? { border: '1px solid red' } : { border: '1px solid #d9d9d9' }}
            type="password"
            placeholder="Password"
            {...register('password', {
              required: 'This field is required',
              minLength: {
                value: 6,
                message: 'Your password needs to be at least 6 characters.',
              },
              maxLength: {
                value: 40,
                message: 'Your password needs to be max 40 characters.',
              },
            })}
          ></input>
        </label>
        <div className={classes.error}>{errors.password && <p>{errors?.password.message}</p>}</div>

        <button className={classes.submit_btn}>Login</button>
      </form>
      <div className={classes.sign_in}>
        <span style={{ marginRight: '3px' }}>Dont have an account?</span>
        <Link to="/sign-up">Sign up.</Link>
      </div>
    </div>
  )
}

export default SignIn
