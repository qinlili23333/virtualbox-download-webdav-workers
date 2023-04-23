/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `npx wrangler dev src/index.js` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `npx wrangler publish src/index.js --name my-worker` to publish your worker
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */
export default {
	async fetch(request, env, ctx) {
		//Windows资源管理器验证
		switch (request.method) {
			case "OPTIONS": {
				return new Response(null, {
					headers: {
						"MS-Author-Via": "DAV",
						"X-Powered-By": "QINLILI23333",
						"X-Github-Project": "https://github.com/qinlili23333/virtualbox-download-webdav-workers/",
						"Allow": "OPTIONS,GET,HEAD,PROPFIND"
					}
				});
			};
			case "PROPFIND":
			case "GET": {
				const InitXML = (body) => {
					const basicbody = `<d:response><d:href>/</d:href><d:propstat><d:prop><d:resourcetype><d:collection/></d:resourcetype><d:quota-used-bytes>117262336</d:quota-used-bytes><d:quota-available-bytes>0</d:quota-available-bytes><d:getcontenttype>application/octet-stream</d:getcontenttype></d:prop><d:status>HTTP/1.1 200 OK</d:status></d:propstat></d:response>`;
					let xml = `<?xml version="1.0" encoding="utf-8" ?><d:multistatus xmlns:d="DAV:" xmlns:s="http://qinlili.bid/ns">`;
					xml += basicbody;
					body.forEach((item) => {
						xml += item;
					});
					xml += `</d:multistatus>`;
					return xml
				}
				let itemList = []
				if (!(request.headers.get("Depth") == 0)) {

				}
				return new Response(InitXML(itemList), {
					headers: {
						"DAV": "1,2",
						"MS-Author-Via": "DAV",
						"X-Powered-By": "QINLILI23333",
						"X-Github-Project": "https://github.com/qinlili23333/virtualbox-download-webdav-workers/"
					}
				});
				break;
			};
			default: {
				return new Response("你说得对，但virtualbox-download-webdav-workers是一款由琴梨梨开发的WebDAV服务器，在这个名为WebDAV的世界里，你将扮演一位名为资源管理器的程序，在浏览中邂逅各式各样的文件，和它们一起击败运营商，同时逐步发现Github的真相。");
			}
		}
	},
};
