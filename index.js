const fetch = require('node-fetch');
const AWS = require('aws-sdk');

// While this isn't a scalable solution, it isn't meant to be. The client is
// built as a demo and only supports these three cities.
const LOCATION_TO_COORDINATES = {
  'atlanta': { lat: 33.7676338, lng: -84.5606888 },
  'new-york': { lat: 40.6976684, lng: -74.2605569 },
  'los-angeles': { lat: 34.0207289, lng: -118.6926118 },
};

const getDarkSkySecret = async () => {
  const secretsManager = new AWS.SecretsManager();

  try {
    const params = { SecretId: process.env['DARK_SKY_SECRET_ARN'] };
    const response = await secretsManager
      .getSecretValue(params)
      .promise();
    return JSON.parse(response.SecretString);
  } catch(exc) {
    throw Error('Unable to properly retrieve DarkSky secret.');
  }
};

exports.handler = async (event) => {
  const location =  event.pathParameters.location;
  if (typeof LOCATION_TO_COORDINATES[location] === 'undefined') {
    return { statusCode: 422, body: JSON.stringify({ message: 'Unsupported location.' }) };
  }

  const {lat, lng} = LOCATION_TO_COORDINATES[location];
  const darkSkySecret = await getDarkSkySecret();
  const response = await fetch(`https://api.darksky.net/forecast/${darkSkySecret['secret-key']}/${lat},${lng}`);

  if (response.status === 200) {
    const body = await response.text();
    return { statusCode: 200, body };
  } else {
    return { statusCode: 500, body: JSON.stringify({ message: 'An error occurred.' }) };
  }
};
