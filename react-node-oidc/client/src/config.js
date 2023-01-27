function getEnvVar(name) {
  const val = process.env[name];
  if (!val) {
    throw new Error(`env variable ${name} not defined`);
  }
  return val;
}

const config = {
  cognitoClientId: getEnvVar("REACT_APP_COGNITO_CLIENT_ID"),
  congnitoBaseURL: getEnvVar("REACT_APP_COGNITO_BASE_URL"),
};

export default config;
