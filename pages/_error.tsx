import * as Sentry from '@sentry/nextjs';
import Error, { ErrorProps } from 'next/error';
import { NextPageContext } from 'next';

// Custom error page so unhandled errors (server-side and client-side) are
// reported to Sentry before Next.js renders its default error UI.
function CustomErrorComponent(props: ErrorProps) {
  return <Error statusCode={props.statusCode} />;
}

CustomErrorComponent.getInitialProps = async (contextData: NextPageContext) => {
  // Waits for Sentry to flush on serverless before the function is frozen.
  await Sentry.captureUnderscoreErrorException(contextData);
  return Error.getInitialProps(contextData);
};

export default CustomErrorComponent;
