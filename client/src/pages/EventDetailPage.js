import { Suspense } from "react";
import {
  Await,
  defer,
  json,
  redirect,
  useRouteLoaderData,
} from "react-router-dom";
import EventItem from "../components/EventItem";
import EventsList from "../components/EventsList";
import { fallback } from "../Layout/fallback";
import { getAuthToken } from "../util/auth";
import { host } from "../api/host";

const EventDetailPage = () => {
  const { event, events } = useRouteLoaderData("event-detail");

  return (
    <>
      <Suspense fallback={fallback}>
        <Await resolve={event}>
          {(event) => <EventItem event={event} />}
        </Await>
      </Suspense>
      <Suspense fallback={fallback}>
        <Await resolve={events}>
          {(events) => <EventsList events={events} />}
        </Await>
      </Suspense>
    </>
  );
};

export default EventDetailPage;

const eventLoader = async (id) => {
  const res = await fetch(`${host}/events/${id}/`);
  if (!res.ok)
    throw json({ message: "Kuch to gadbad h" }, { status: res.status });
  const data = await res.json();
  return data.event;
};

const eventsLoader = async () => {
  const res = await fetch(`${host}/events/`);
  if (!res.ok)
    throw json({ message: "Could not fetch data" }, { status: res.status });
  const data = await res.json();
  return data.events;
};

export const loader = async ({ params }) => {
  const eventId = params.eventId;
  return defer({
    event: await eventLoader(eventId),
    events: eventsLoader(),
  });
};

export const action = async ({ params, request }) => {
  const eventId = params.eventId;

  const token = getAuthToken();

  const res = await fetch(`${host}/events/` + eventId, {
    method: request.method,
    headers: {
      "Authorization": 'Bearer ' + token,
    }
  });

  if (!res.ok) {
    return json({ message: "Could not delete data" }, { status: 500 });
  }
  return redirect("/events");
};
