// if this is named loading, this will be used by next for default loading

import classes from "./loading.module.css"
export default function MealsLoadingPage() {
  return (
    <p className={classes.loading}>Fetching Meals</p>
  )
}
