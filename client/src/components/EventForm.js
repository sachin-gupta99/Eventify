import {
  Form,
  useActionData,
  useNavigate,
  useNavigation,
  useSubmit,
  json,
  redirect,
} from "react-router-dom";
import { getAuthToken } from "../util/auth";

import classes from "./EventForm.module.css";

function EventForm({ method, event }) {
  const navigate = useNavigate();
  const navigation = useNavigation();
  const submit = useSubmit();

  const isSubmitting = navigation.state === "submitting";

  const editHandler = () => {
    const event = {
      title: document.querySelector("#title").value,
      image: document.querySelector("#image").value,
      date: document.querySelector("#date").value,
      description: document.querySelector("#description").value,
    };
    submit(event, { method: "PATCH" });
  };

  const cancelHandler = () => {
    navigate(`/events/${event.id}`);
  };

  const data = useActionData();

  return (
    <Form method={method} className={classes.form}>
      {data && data.errors && (
        <ul>
          {Object.values(data.errors).map((err) => (
            <li key={err}>{err}</li>
          ))}
        </ul>
      )}
      <p>
        <label htmlFor="title">Title</label>
        <input
          id="title"
          type="text"
          name="title"
          defaultValue={event ? event.title : ""}
          required
        />
      </p>
      <p>
        <label htmlFor="image">Image</label>
        <input
          id="image"
          type="url"
          name="image"
          defaultValue={event ? event.image : ""}
          required
        />
      </p>
      <p>
        <label htmlFor="date">Date</label>
        <input
          id="date"
          type="date"
          name="date"
          defaultValue={event ? event.date : ""}
          required
        />
      </p>
      <p>
        <label htmlFor="description">Description</label>
        <textarea
          id="description"
          name="description"
          rows="5"
          defaultValue={event ? event.description : ""}
          required
        />
      </p>
      <div className={classes.actions}>
        <button type="button" onClick={cancelHandler} disabled={isSubmitting}>
          Cancel
        </button>
        <button
          disabled={isSubmitting}
          onClick={method === "PATCH" ? editHandler : ""}
        >
          {isSubmitting ? "submitting..." : "Save"}
        </button>
      </div>
    </Form>
  );
}

export default EventForm;

export const action = async ({ request, params }) => {
  // console.log('Hello');
  const data = await request.formData();
  const event = {
      title: data.get('title'),
      image: data.get('image'),
      date: data.get('date'),
      description: data.get('description'),
  };

  let url = "http://localhost:8080/events/";

  if(request.method === "PATCH") {
    // console.log('Hello');
    url += params.eventId;
  }

  const token = getAuthToken();
  // console.log(request.method);

  const res = await fetch(url, {
      method: request.method,
      headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + token
      },
      body: JSON.stringify(event),
  });

  if(res.status === 422) {
      return res;
  }

  if(!res.ok) {
      throw json({message: "Could not save data"}, {status: res.status});
  }

  return redirect('/events');

};
