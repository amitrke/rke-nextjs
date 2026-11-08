import Error from 'next/error';

// Explicit 404 page so it stays statically optimised alongside the custom _error page.
export default function NotFound() {
  return <Error statusCode={404} />;
}
