import React from "react";
import { useRouteError } from "react-router-dom";
import MainNavigation from "../components/MainNavigation";
import PageContent from "../components/PageContent";

const ErrorPage = () => {
  const error = useRouteError();

  console.log(error);
  let title;
  if(error.data)
    title = error.data.message;
  // console.log(title);
  let message = "Something went wrong";

  if (!title) {
    if (error.status === 500) {
      title = "Some Server error";
    }

    if (error.status === 404) {
      title = "Page Not Found";
    }
  }

  return (
    <>
      <MainNavigation />
      <PageContent title={title}>
        <p>{message}</p>
      </PageContent>
    </>
  );
};

export default ErrorPage;
