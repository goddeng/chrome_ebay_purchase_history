//注册前台页面监听事件
chrome.extension.onMessage.addListener(
		function(request, sender, sendResponse){
			getList( sendResponse );
		}
);

//获取评论列表
function getList( sendResponse ){
	itemList=[];
	splitstr="@_@";
	err_page=true;
	var url=window.location.href;
	
	//店铺列表
	var listStore=$("#ListViewInner > li");
	if(listStore.length > 0){
		err_page=false;
		var nextPage = $("#Pagination td.pagn-next a").attr("href");
		var results = $("span.rcnt").text().replace(/,/gi,'');
		itemList.push("store:"+document.title);
		itemList.push(results);
    	listStore.each(function(){
    		itemList.push($(this).attr('listingid'));
    	});
    	
		var nextPage=$("#Pagination td.pagn-next a").attr("href");
		if(typeof(nextPage) == "undefined"){
			sendMsg( itemList, "end" );
			window.open('http://edc.boxintheship.com/collect/tools/ebay/joblist/');
		}else{
			if(nextPage.length > 0 && nextPage != 'javascript:;'){
				sendMsg( itemList, "next" );
				window.location.href = nextPage;
			}else{
				sendMsg( itemList, "end" );
				window.open('http://edc.boxintheship.com/collect/tools/ebay/joblist/');
			}
		}
	}
	

	//分类列表
	var listCategory=$("ul.b-list__items_nofooter > li");
	if(listCategory.length > 0){
		err_page=false;
		var nextPage = $("a[rel=next]").attr("href");
		var results = $("h2.srp-controls__count-heading").text().match(/of(.*?)results/i)[1].replace(/[ ]/g, "").replace(/,/gi,'');
		itemList.push("category:"+document.title);
		itemList.push(results);
		
		listCategory.each(function(){
			itemLink=$(this).find("div.s-item__wrapper > div.s-item__info > a.s-item__link").attr("href");			
			linkArr=itemLink.substring(0, itemLink.indexOf("?")).split("\/");
			itemId=linkArr[linkArr.length-1];
    		itemList.push(itemId);
    	});
		
		if(typeof(nextPage) == "undefined"){
			sendMsg(itemList, "end");
			window.open('http://edc.boxintheship.com/collect/tools/ebay/joblist/');
		}else{
			sendMsg(itemList, "next");
			window.location.href = nextPage;			
		}
	}
	
	if(err_page){
		alert("该页面没有符合的数据 :)");
		sendMsg(itemList, "end");
	}
}

//将获取内容传递给后台文件进行处理
function sendMsg( msg, cmd){
	chrome.extension.sendMessage({"msg": msg, "cmd": cmd}, function(response) {});
}