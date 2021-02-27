const WebSocket = require('ws')

const wss = new WebSocket.Server({ port: 5000 })

const clients = []

wss.on('connection', function connection(ws) {
	console.log('connection-连接已建立')

	ws.on('message', function incoming(message) {
		console.log('received: %s', message)
		if (message === 'ping') {
			console.log('ping')
			ws.send('pong')
			return
		}
		wss.clients.forEach(client => {
			if (client.readyState === WebSocket.OPEN) {
				client.send(message)
			}
		})
	})

	ws.on('error', function (err) {
		console.log('error：', err)
	})

	ws.on('close', function (reason) {
		console.log('close-连接已关闭：', 'reason:' + reason)
	})
})
