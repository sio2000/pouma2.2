export function isNetlifyRuntime() {
  return (
    process.env.NETLIFY === "true" ||
    process.env.NETLIFY_DEV === "true" ||
    Boolean(process.env.AWS_LAMBDA_FUNCTION_NAME)
  );
}

export function useNetlifyBlobs() {
  if (process.env.USE_FILE_STORAGE === "true") return false;
  return isNetlifyRuntime();
}
