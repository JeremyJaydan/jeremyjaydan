
import express, { Request, Response } from 'express';

const app = express();

app.get('/', (request: Request, response: Response) => {
  response.render('home_page_template.ejs');
});

app.set('view engine', 'ejs');
app.set('views', 'src/server/templates');

app.use(express.static('public'));

const port = process.env.PORT || 8081;
app.listen(port, () => {
  console.log(`App listening on port ${port}..`);
});
