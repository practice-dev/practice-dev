const colors = ['Red', 'Green', 'Blue'];

function random(n: number) {
  return Math.floor(Math.random() * n);
}

const headers = {
  'Content-Type': 'application/json',
};

export async function handler() {
  const n = random(5);
  // 20% - internal error
  // 20% - success
  // 60% - bad request error
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
