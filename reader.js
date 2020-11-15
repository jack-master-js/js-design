const fs = require("fs");
const { promises: fsPromises } = fs;
const readline = require('readline');
const zlib = require('zlib');

const filePath = 'data.json'

// 打开文件
fs.open(filePath, 'r+', (err, fd) => {
   if (err) return console.error(err);
   console.log("文件打开成功");

   let buf = Buffer.alloc(1024);
   fs.read(fd, buf, 0, buf.length, 0, (err, bytes) => {
      if (err) console.log(err);
      console.log(bytes + "  字节被读取");

      // 仅输出读取的字节
      if (bytes > 0) {
         let b = buf.slice(0, bytes).toString()
         console.log(JSON.parse(b));
      }

      // 关闭文件
      fs.close(fd, (err) => {
         if (err) console.log(err);
         console.log("文件关闭成功");
      });
   });
});

// 异步读取 
fs.readFile(filePath, (err, data) => {
   if (err) return console.error(err);
   console.log("异步读取 ", JSON.parse(data.toString()));
});

// 同步读取
const data = fs.readFileSync(filePath);
console.log("同步读取 ", JSON.parse(data.toString()));

// promises
(async () => {
   const fsHandle = await fsPromises.open(filePath)
   const file = await fsHandle.readFile()
   console.log("promises 读取 ", JSON.parse(file.toString()));
})()

// stream
let str = ''
const readable = fs.createReadStream(filePath);
readable.setEncoding('UTF8');
readable.on('data', (chunk) => {
   str += chunk;
});
readable.on('end', () => {
   console.log("stream 读取 ", JSON.parse(str));
});

const zip = zlib.createGzip();
const writable = fs.createWriteStream('data.json.gz');
readable.pipe(zip).pipe(writable);

// readline
(async () => {
   const rl = readline.createInterface({
      input: fs.createReadStream(filePath)
   });

   let index = 0
   let result = ''
   for await (const line of rl) {
      index++
      result += line
      console.log(`第 ${index} 行 `, line);
   }
   console.log("readline 读取 ", JSON.parse(result));
})()