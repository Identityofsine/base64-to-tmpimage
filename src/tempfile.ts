import * as fs from 'fs';

export class TemporaryFileError extends Error {
	constructor(message: string) {
		super(`[TemporaryFileError]` + message);
		this.name = 'TemporaryFileError';
	}
}

export class TemporaryFile {

	path: string = "";
	active: boolean = true;
	deleteTimer: NodeJS.Timeout | undefined;

	/**
		* @param content {Buffer} - The content of the filem should be a buffer
		* @param extension {string} - The extension of the file (e.g. '.txt', '.png') 
		* @param ttk {number} - The time to keep the file in the system in seconds
	*/
	constructor(private content: Buffer, private extension: string, private ttk: number = 30, private onDeleted?: () => void) {
		this.createFile();
	}

	private createFile(): void {
		try {
			fs.writeFileSync(this.path, this.content);
			this.path = `./temp/${new Date().getTime()}${this.extension}`;
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
		return '';
	}

	public static detectExtensionImage(base64: string): string {
		const base64Regex = /^data:image\/(.*?);base64/;
		const extension = base64.replaceAll(" ", "").match(base64Regex);
		if (extension) {
			return `.found`;
		}
		return '';
	}


	public static createFromBase64(base64: string, extension: string, ttk: number = 30, onDeleted?: () => void): TemporaryFile {
		const buffer = Buffer.from(base64, 'base64');
		return new TemporaryFile(buffer, extension, ttk, onDeleted);
	}
}



