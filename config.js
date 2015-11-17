module.exports = {
	documentService: {
		host: 'localhost',
    	path: '/documents/xxxx/',
    	port: '8701'
	},
	perDoc: {
		maxGetRequests: 6,
		secondsBtwRequests: 2
	},
	totalRuns: 30
}