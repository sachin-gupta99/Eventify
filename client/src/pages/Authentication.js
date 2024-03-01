import React from "react";
import { json, redirect } from "react-router-dom";
import AuthenticationForm from "../components/AuthenticationForm";

const Authentication = () => {
  return (
    <div>
      <AuthenticationForm />
    </div>
  );
};

export default Authentication;

export const action = async ({ request, params }) => {
  const data = await request.formData();
  const authData = {
    email: data.get("email"),
    password: data.get("password"),
  };
  const searchParams = new URL(request.url).searchParams;
  const mode = searchParams.get("mode") || "login";

  const res = await fetch("http://localhost:8080/" + mode, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(authData),
  });

  if (res.status === 422 || res.status === 402) {
    return res;
  }

  if (!res.ok) {
    throw json({ message: "Could not authenticate" }, { status: res.status });
  }

  const resData = await res.json();
  const token = resData.token;

  localStorage.setItem('token', token);

  return redirect("/");
};
