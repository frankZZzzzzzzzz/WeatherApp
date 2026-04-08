import express from 'express'

const app = express();
/*
app.get('/', (request, reposonse) => {
    reposonse.send('NOPE');
});
*/
app.use(express.static('./src/Website/HomePage'));
app.listen(process.env.PORT || 3000, () => console.log('http://localhost:3000'));
