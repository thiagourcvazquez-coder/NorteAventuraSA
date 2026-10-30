import app from './app.js';

const PORT = Number(process.env.PORT ?? 4000);

app.listen(PORT, () => {
  console.log(`Norte Aventura API → http://localhost:${PORT}`);
});
