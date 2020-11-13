const http = require('http');	
const numCPUs = require('os').cpus().length;	
const cluster = require('cluster');	
if(cluster.isMaster){	
    console.log('Master process id is',process.pid);	
    // fork workers	
    for(let i= 0;i<numCPUs;i++){	
        const worker = cluster.fork();
        worker.send(`hi worker#${worker.id} from master`);
        worker.on('message', (msg) => {
            console.log(`master receive ${msg}`)
        })
    }
    cluster.on('exit',function(worker,code,signal){	
        console.log('worker process died,id',worker.process.pid)	
    })	
}else{
    console.log(`Worker ${process.pid} started`);

    process.send('hi master from worker')
    process.on('message', (msg) => {
        console.log(`worker ${process.pid} receive ${msg}`);
    });
    // Worker可以共享同一个TCP连接	
    // 这里是一个http服务器	
    http.createServer(function(req,res){	
        res.writeHead(200);	
        res.end(`${process.pid}`);	
    }).listen(8000);	
}