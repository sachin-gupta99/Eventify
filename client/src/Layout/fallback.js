import classes from '../components/EventsList.module.css';

export const fallback = (
  <div className={classes.fallback}>
    <p>Loading...</p>
    <p className="spinner-border"></p>
  </div>
);
