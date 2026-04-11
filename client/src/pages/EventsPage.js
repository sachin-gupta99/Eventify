import { Suspense } from "react";
import { useLoaderData, defer, Await, useSearchParams } from "react-router-dom";
import EventsList from "../components/EventsList";
import { host } from "../api/host";

function EventsPage() {
  const { events } = useLoaderData();
  const [searchParams, setSearchParams] = useSearchParams();
  const searchTerm = searchParams.get('search') || '';

  function handleSearch(e) {
    const value = e.target.value;
    if (value) {
      setSearchParams({ search: value });
    } else {
      setSearchParams({});
    }
  }

  return (
    <>
      <div style={{ padding: "1rem 2rem" }}>
        <input
          type="text"
          placeholder="Search events by title..."
          value={searchTerm}
          onChange={handleSearch}
          style={{
            width: "100%",
            padding: "0.75rem 1rem",
            fontSize: "1.1rem",
            borderRadius: "6px",
            border: "1px solid #ccc",
            outline: "none",
          }}
        />
      </div>
      <Suspense fallback={<p style={{ textAlign: "center" }}>Loading...</p>}>
        <Await resolve={events}>
          {(loadedEvents) => <EventsList events={loadedEvents} />}
        </Await>
      </Suspense>
    </>
  );
}

export default EventsPage;

async function utilLoader(search) {
  const url = search
    ? `${host}/events/?search=${encodeURIComponent(search)}`
    : `${host}/events/`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Could not fetch events.");
  }
  const resData = await response.json();
  return resData.events;
}

export function loader({ request }) {
  const url = new URL(request.url);
  const search = url.searchParams.get('search') || '';
  return defer({
    events: utilLoader(search),
  });
}
