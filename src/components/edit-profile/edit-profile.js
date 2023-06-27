import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { message } from 'antd'

import { setUserError } from '../../redux/action'
import useBlogAPI from '../../custom-hooks/use-blog-api'

import classes from './edit-profile.module.scss'

const EditProfile = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { fetcher } = useBlogAPI()
  const user = useSelector((state) => state.user.user)

  const error = useSelector((state) => state.user.error)

  const {
    register,
    formState: { errors, isValid },
    handleSubmit,
    watch,
    setError,
  } = useForm({
    mode: 'onChange',
    defaultValues: {
      username: user.username,
      email: user.email,
      password: '',
      image: user.image || null,
    },
  })

  useEffect(() => {
    if (error === 'username') {
      setError('username', { type: 'custom', message: 'username is already taken' })
    }
    if (error === 'email') {
      setError('email', { type: 'custom', message: 'email is already taken' })
    }
    if (error === 'none') {
      message.success('good')
      dispatch(setUserError())
      navigate('/articles')
    }
  }, [error])

  const onSubmit = handleSubmit((data) => {
    console.log(data)
    const changedData = Object.fromEntries(Object.entries(data).filter(([value]) => value !== '' && value !== null))

    dispatch(fetcher.updateProfile(changedData))
  })

  const url =
    watch('image') ||
    'https://avatars.mds.yandex.net/i?id=9f9e6b333ada12f3f2cac1a6dd8f41548a9fe3b0-9067891-images-thumbs&n=13'

  return (
    <div className={classes.wrapper}>
      <h2 className={classes.header}>Edit Profile</h2>
      <form className={classes.form} onSubmit={onSubmit}>
        <label className={classes.label}>
          Username
          <input
            style={errors.username ? { border: '1px solid red' } : { border: '1px solid #d9d9d9' }}
            placeholder="username"
            {...register('username', {
              required: 'This field is requierd',
              minLength: {
                value: 3,
                message: 'Minimum 3 symbols',
              },
              maxLength: {
                value: 20,
                message: 'Maximum 20 symbols',
              },
              pattern: {
                value: /^[a-z][a-z0-9]*$/,
                message: 'Only use lowercase English letters and numbers',
              },
            })}
          />
        </label>
        <div className={classes.error}>{errors.username && <p>{errors?.username.message}</p>}</div>

        <label className={classes.label}>
          Email address
          <input
            placeholder="Email address"
            style={errors.email ? { border: '1px solid red' } : { border: '1px solid #d9d9d9' }}
            {...register('email', {
              required: 'This field is requierd',

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
          New password
          <input
            style={errors.password ? { border: '1px solid red' } : { border: '1px solid #d9d9d9' }}
            type="password"
            placeholder="Password"
            {...register('password', {
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

        <label className={classes.label}>
          Avatar image (url)
          <input
            style={errors.image ? { border: '1px solid red' } : { border: '1px solid #d9d9d9' }}
            type="text"
            placeholder="Avatar image"
            {...register('image', {})}
          ></input>
          <img
            className={classes.checkImg}
            src={url}
            onError={() => setError('image', { type: 'custom', message: 'Invalid image url' })}
          ></img>
        </label>
        <div className={classes.error}>{errors.image && <p>{errors?.image.message}</p>}</div>

        <button className={classes.submit_btn} disabled={!isValid}>
          Save
        </button>
      </form>
    </div>
  )
}

export default EditProfile
