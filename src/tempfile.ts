import * as fs from 'fs';

export class TemporaryFileError extends Error {
	constructor(message: string) {
		super(`[TemporaryFileError]` + message);
		this.name = 'TemporaryFileError';
	}
}

const base_url = process.env.BASE_URL || 'http://localhost:80';

export class TemporaryFile {

	path: string = "";
	active: boolean = true;
	deleteTimer: NodeJS.Timeout | undefined;
	fileName: string = "";

	/**
		* @param content {Buffer} - The content of the filem should be a buffer
		* @param extension {string} - The extension of the file (e.g. '.txt', '.png') 
		* @param ttk {number} - The time to keep the file in the system in seconds
	*/
	constructor(private content: Buffer, private extension: string, private ttk: number = 60, private onDeleted?: () => void) {
		this.createFile();
	}

	private createFile(): void {
		try {
			this.fileName = `${new Date().getTime()}${this.extension}`;
			this.path = `./temp/${this.fileName}`;
			fs.writeFileSync(this.path, this.content);
			this.startDeleteTimer();
		} catch (err) {
			throw new TemporaryFileError(`Error creating the file (${err})`);
		}
	}

	private startDeleteTimer(): void {
		this.deleteTimer = setTimeout(() => {
			this.deleteFile();
		}, this.ttk * 1000);
	}

	private deleteFile(): void {
		try {
			fs.unlinkSync(this.path);
			this.active = false;
			console.log(`File ${this.fileName} deleted`);
			this.onDeleted?.();
		} catch (err) {
			throw new TemporaryFileError(`Error deleting the file (${err})`);
		}
	}

	/**
		* @returns {Buffer} - The content of the file
	*/
	public getContent(): Buffer {
		return Buffer.from('');
	}

	/**
		* @returns {string} - The path of the file
	*/
	public getPath(): string {
		return this.path;
	}

	/**
		* @returns {string} - URL path of the file
	*/
	public getFileName(): string {
		return base_url + '/' + this.fileName;
	}

	public static createTempFolder(): void {
		const path = './temp';
		try {
			if (!fs.existsSync(path)) {
				fs.mkdirSync(path);
			}
		} catch (err) {
			throw new TemporaryFileError(`Error creating the temp folder (${err})`);
		}
	}

	public static deleteTempFiles(): void {
		const path = './temp';
		try {
			fs.readdir(path, (err, files) => {
				if (err) {
					return;
				}
				files.forEach(file => {
					fs.unlinkSync(`${path}/${file}`);
				});
			});
		} catch (err) {
			throw new TemporaryFileError(`Error deleting the files (${err})`);
		}
	}

	public static detectExtensionImage(base64: string): string {
		const base64Regex = /^data:image\/(.*?);base64/;
		const extension = base64.replaceAll(" ", "").match(base64Regex);
		if (extension) {
			return `.${extension?.[1]}`;
		}
		return '';
	}

	public static createFromBase64(base64: string, extension: string, ttk?: number, onDeleted?: () => void): TemporaryFile {
		const base64Regex = /^data:image\/(.*?);base64,/;
		const buffer = Buffer.from(base64.replace(base64Regex, ''), 'base64');

		return new TemporaryFile(buffer, extension, ttk, onDeleted);
	}

}



