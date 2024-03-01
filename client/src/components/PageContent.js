import React from 'react'
import classes from './PageContent.module.css';

const PageContent = (props) => {
  return (
    <div className={classes.main}>
        <h1>{props.title}</h1>
        {props.children}
    </div>
  )
}

export default PageContent