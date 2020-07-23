const colors = ['Red', 'Green', 'Blue'];

function random(n: number) {
  return Math.floor(Math.random() * n);
}

const headers = {
  'Content-Type': 'application/json',
};

export async function handler() {
  const n = random(10);
  // 10% - internal error
  // 10% - success
  // 80% - bad request error
  if (n === 0) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Oops error' }),
      headers,
    };
  }

  if (n !== 1) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Oops error' }),
      headers,
    };
  }

  return {
    statusCode: 200,
    body: JSON.stringify({ color: colors[random(colors.length)] }),
    headers,
  };
}
