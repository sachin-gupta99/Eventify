import { Suspense } from "react";
import { Await, defer, json, useLoaderData } from "react-router-dom";
import EventsList from "../components/EventsList";
import { fallback } from "../Layout/fallback";
import { host } from "../api/host";

const EventsPage = () => {
  const data = useLoaderData();
  const events = data.events;

  return (
    <Suspense fallback={fallback}>
      <Await resolve={events}>
        {(loadedEvents) => <EventsList events={loadedEvents} />}
      </Await>
    </Suspense>
  );
};

const utilLoader = async () => {
  const res = await fetch(`${host}/events/`);
  if (!res.ok) {
    throw json({ message: "Could not fetch data" }, { status: res.status });
  }
  const data = await res.json();
  return data.events;
};

export const loader = () => {
  return defer({
    events: utilLoader(),
  });
};

export default EventsPage;
