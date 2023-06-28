import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useForm, useFieldArray } from 'react-hook-form'
import { useNavigate, useParams } from 'react-router-dom'
import { message } from 'antd'

import Spinner from '../spinner/spinner'
import { getOnePage, updateArticle } from '../../blog-api/blog-api'
import { articlesPATH } from '../../pathes/pathes'

import classes from './update-article.module.scss'

const UpdateArticle = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const currentArticle = useSelector((state) => state.articles.article)
  const [loaded, setLoaded] = useState(true)
  const { slug } = useParams()
  const tags = currentArticle?.tagList || []
  const tagsForUpdate = tags?.map((tag) => {
    return { tag: tag }
  })
  useEffect(() => {
    const fetchFunc = async () => {
      await dispatch(getOnePage(slug))
      setLoaded(false)
      if (currentArticle) {
        setValue('title', currentArticle.title)
        setValue('description', currentArticle.description)
        setValue('body', currentArticle.body)
        setValue('tags', tagsForUpdate)
      }
    }
    fetchFunc()
  }, [slug])

  const {
    register,
    formState: { errors },
    handleSubmit,
    control,
    setValue,
  } = useForm({
    mode: 'onBlur',
    defaultValues: {
      title: '',
      description: '',
      body: '',
      tags: '',
    },
  })

  const { fields, append, remove } = useFieldArray({
    name: 'tags',
    control,
  })

  const onSubmit = handleSubmit((data) => {
    const { body, description, title, tags } = data
    const tagArr = tags.map((tagObj) => {
      return tagObj.tag
    })

    const authData = {
      updateData: {
        title: title,
        description: description,
        body: body,
        tagList: tagArr,
      },
    }

    if (slug) dispatch(updateArticle(authData, slug))
    navigate(articlesPATH)
    message.success('Article updated!')
  })

  {
    if (loaded) {
      return <Spinner />
    } else {
      return (
        <div className={classes.wrapper}>
          <h2 className={classes.header}>Edit article</h2>
          <form className={classes.form} onSubmit={onSubmit}>
            <label className={classes.label}>
              Title
              <input
                style={errors.title ? { border: '1px solid red' } : { border: '1px solid #d9d9d9' }}
                placeholder="Title"
                {...register('title', {
                  required: 'This field is required',
                  minLength: {
                    value: 3,
                    message: 'Minimum 3 characters',
                  },
                  maxLength: {
                    value: 100,
                    message: 'Maximum 100 characters',
                  },
                })}
              />
            </label>
            <div className={classes.error}>{errors.title && <p>{errors?.title.message}</p>}</div>

            <label className={classes.label}>
              Short description
              <input
                style={errors.description ? { border: '1px solid red' } : { border: '1px solid #d9d9d9' }}
                placeholder="Description"
                {...register('description', {
                  required: 'This field is required',
                  minLength: {
                    value: 3,
                    message: 'Minimum 3 characters',
                  },
                  maxLength: {
                    value: 100,
                    message: 'Maximum 100 characters',
                  },
                })}
              ></input>
            </label>
            <div className={classes.error}>{errors.description && <p>{errors?.description.message}</p>}</div>

            <label className={classes.label}>
              Text
              <textarea
                style={errors.body ? { border: '1px solid red' } : { border: '1px solid #d9d9d9' }}
                placeholder="Text"
                {...register('body', {
                  required: 'This field is required',
                  minLength: {
                    value: 3,
                    message: 'Minimum 3 characters',
                  },
                  maxLength: {
                    value: 4000,
                    message: 'Maximum 4000 characters',
                  },
                })}
              ></textarea>
            </label>
            <div className={classes.error}>{errors.body && <p>{errors?.body.message}</p>}</div>

            <div className={classes.tags}>
              <ul>
                {fields.map((field, index) => {
                  return (
                    <li key={field.id}>
                      <div className={classes.tags__wrapper}>
                        <label className={`${classes.label} ${classes.tag}`}>
                          <input
                            style={errors.tags ? { border: '1px solid red' } : { border: '1px solid #d9d9d9' }}
                            placeholder="Tag"
                            {...register(`tags.${index}.tag`, {
                              minLength: {
                                value: 2,
                                message: 'Minimum 2 characters',
                              },
                              required: 'Tags cannot be empty',
                            })}
                          ></input>
                        </label>
                        <div className={classes.error}>{errors.tags && <p>{errors?.tags[index]?.tag?.message}</p>}</div>
                      </div>
                      <button className={classes.tags__delete} type="button" onClick={() => remove(index)}>
                        Delete
                      </button>
                    </li>
                  )
                })}
              </ul>

              <button className={classes.tags__add} type="button" onClick={() => append({ tag: '' })}>
                Add tag
              </button>
            </div>

            <button className={classes.submit_btn} type="submit">
              Send
            </button>
          </form>
        </div>
      )
    }
  }
}

export default UpdateArticle
