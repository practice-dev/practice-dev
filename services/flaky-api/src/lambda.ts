const colors = ['Red', 'Green', 'Blue'];

function random(n: number) {
  return Math.floor(Math.random() * n);
}

export function handler() {
  const n = random(10);
  // 10% - internal error
  // 10% - success
  // 80% - bad request error
  if (n === 0) {
    return {
      status: 500,
      body: 'Oops error',
    };
  }

  if (n !== 1) {
    return {
      status: 400,
      body: 'Oops error',
    };
  }

  return {
    status: 200,
    body: JSON.stringify({ color: colors[random(colors.length)] }),
    headers: {
      'Content-Type': 'application/json',
    },
  };
}
