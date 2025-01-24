import fs from 'fs'
import path from 'path'
import zlib from 'zlib'

const command = process.argv[2]

const workingDir = process.cwd()

function initializeGitDirectory() {
	fs.mkdirSync(path.join(workingDir, '.git'), { recursive: true })
	fs.mkdirSync(path.join(workingDir, '.git', 'objects'), { recursive: true })
	fs.mkdirSync(path.join(workingDir, '.git', 'refs'), { recursive: true })
	fs.writeFileSync(path.join(workingDir, '.git', 'HEAD'), 'ref: refs/heads/main\n')
	console.log('Initialized git directory')
}

// get the file

switch (command) {
	case 'init':
		initializeGitDirectory()
		break

	case 'cat-file':
		const flag = process.argv[3]
		const hash = process.argv[4]

		if (flag == '-p') {
			const folderPath = path.join(workingDir, '.git', 'objects', hash.slice(0, 2))

			const fileContent = fs.readFileSync(path.join(folderPath, hash.slice(2)))

			const decompressed = zlib.inflateSync(fileContent)

			const [header, content] = decompressed.toString().split('\0')
			process.stdout.write(content)
		}
		break

	default:
		throw new Error(`Unknown command ${command}`)
}
