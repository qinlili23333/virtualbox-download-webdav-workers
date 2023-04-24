export default {
	async fetch(request, env, ctx) {
		const { pathname } = new URL(request.url);
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
			case "PROPFIND": {
				console.log(request.headers);
				const formatBytes = size => {
					const units = {
						K: 1024,
						M: 1024 * 1024,
						G: 1024 * 1024 * 1024
					}
					return units[size.substring(size.length - 1)] * size.substring(0, size.length - 1);
				}
				const InitXML = (body) => {
					const basicbody = `<d:response><d:href>` + pathname + `</d:href><d:propstat><d:prop><d:resourcetype><d:collection/></d:resourcetype><d:quota-used-bytes>120076632</d:quota-used-bytes><d:quota-available-bytes>0</d:quota-available-bytes><d:getcontenttype>application/octet-stream</d:getcontenttype></d:prop><d:status>HTTP/1.1 200 OK</d:status></d:propstat></d:response>`;
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
					let dlpage = await (await fetch("https://download.virtualbox.org/virtualbox" + pathname)).text();
					let fileList = dlpage.substring(dlpage.indexOf("<pre>") + 5, dlpage.indexOf("</pre>")).split("<a ");
					fileList.shift();
					let formatFileList = [{
						name: "000 本服务由琴梨梨提供",
						href: "qinlili.bid",
						time: new Date().toUTCString(),
						size: 114514
					}]
					fileList.forEach((item) => {
						//解析文件列表
						if (item.indexOf("Parent Directory") > 0) { }
						else {
							let parsedItem = [];
							let parsedTemp = item.replace("\n", "").split(" ");
							parsedTemp.forEach((item) => {
								if (item != "") {
									parsedItem.push(item);
								}
							});
							formatFileList.push({
								name: parsedItem[0].substring(parsedItem[0].indexOf(">") + 1, parsedItem[0].indexOf("<") - ((parsedItem[3] == "-") ? 1 : 0)),
								href: parsedItem[0].substring(parsedItem[0].indexOf("\"") + 1, parsedItem[0].lastIndexOf("\"")),
								time: new Date(parsedItem[1] + " " + parsedItem[2] + " GMT").toUTCString(),
								size: parsedItem[3] == "-" ? -1 : formatBytes(parsedItem[3])
							});
						}
					});
					formatFileList.forEach((item) => {
						let formatString = `<d:response><d:href>` + pathname + ((pathname.slice(-1) == "/") ? "" : "/") + item.name + `</d:href><d:propstat><d:prop>`
						if (item.size == -1) {
							formatString += `<d:resourcetype><d:collection/></d:resourcetype><d:quota-used-bytes>120076632</d:quota-used-bytes><d:quota-available-bytes>0</d:quota-available-bytes>`
						} else {
							formatString += `<d:getcontentlength>` + item.size + `</d:getcontentlength><d:resourcetype/>`
						}
						formatString += `<d:getlastmodified>` + item.time + `</d:getlastmodified><d:getcontenttype>application/octet-stream</d:getcontenttype></d:prop><d:status>HTTP/1.1 200 OK</d:status></d:propstat></d:response>`
						itemList.push(formatString);
					});
				}
				return new Response(InitXML(itemList), {
					headers: {
						"DAV": "1,2",
						"Content-Type": "application/xml; charset=utf-8",
						"MS-Author-Via": "DAV",
						"X-Powered-By": "QINLILI23333",
						"X-Github-Project": "https://github.com/qinlili23333/virtualbox-download-webdav-workers/"
					},
					status: 207
				});
			};
			case "GET": {
				if (pathname == "/") {
					return new Response("你说得对，但virtualbox-download-webdav-workers是一款由琴梨梨开发的WebDAV服务器，在这个名为WebDAV的世界里，你将扮演一位名为资源管理器的程序，在浏览中邂逅各式各样的文件，和它们一起击败运营商，同时逐步发现Github的真相。", { status: 418 });
				}
				return Response.redirect("https://download.virtualbox.org/virtualbox" + pathname, 301)
			};
			default: {
				return new Response("你说得对，但virtualbox-download-webdav-workers是一款由琴梨梨开发的WebDAV服务器，在这个名为WebDAV的世界里，你将扮演一位名为资源管理器的程序，在浏览中邂逅各式各样的文件，和它们一起击败运营商，同时逐步发现Github的真相。", { status: 418 });
			}
		}
	},
};
