import express from 'express';
import { TemporaryFile } from './tempfile';

const app = express();
app.use(express.json({ limit: '50mb' }));

app.get('/', (req, res) => {
	res.send('Hello World');
});

app.post('/', (req, res) => {
	const { file } = req.body;
	const extension = TemporaryFile.detectExtensionImage(file);
	console.log(extension);

	res.sendStatus(200);

});

app.listen(3000, () => {
	console.log('Server is running on port 3000');
});
