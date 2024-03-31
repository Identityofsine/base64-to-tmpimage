import express from 'express';
import { TemporaryFile } from './tempfile';
import path from 'path';
import * as dotenv from 'dotenv'
dotenv.config()

try {
	TemporaryFile.createTempFolder();
	TemporaryFile.deleteTempFiles();
} catch (e) {
	console.error(e);
}

const app = express();
app.use(express.json({ limit: '50mb' }));

app.get('/:file', (req, res) => {
	try {
		// @ts-ignore
		const file = req.params!.file;
		const dirname = path.resolve();
		res.status(200).sendFile('./temp/' + file, { root: dirname }, function(err) {
			if (err) {
				res.status(404).json({ error: 'File not found' }).send;
			}
		});
	} catch (e: any) {
		res.status(500).json({ error: e }).send();
	}
});

app.post('/', (req, res) => {
	try {
		const { file } = req.body;
		const extension = TemporaryFile.detectExtensionImage(file);
		const temp_file = TemporaryFile.createFromBase64(file, extension);
		const path = temp_file?.getFileName();
		const expiration = new Date(Date.now() + 30 * 60000);
		res.status(203).json({ path: path, expiration: `${expiration.getTime()}` }).send();
	} catch (e) {
		console.error(e);
		res.status(500).json({ error: e }).send();
	}
});

app.listen(3000, () => {
	console.log('Server is running on port 3000');
});
