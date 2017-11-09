var flag = false;
var currentTabId;
var server_url='http://edc.boxintheship.com';
var item_nums = 0;

/**
 * ===========================================================
 * BOF 自定义函数 
 */
function setIcon() {
	var icon2="icon/icon2.png";
	var icon1="icon/icon.png";
	chrome.browserAction.setIcon({path:flag?icon2:icon1});	
}

function ajaxPostJosn(url,data){
	$.ajax({
		url: url,
    	cache: false,
    	type: "POST",
    	data: data,
    	dataType: "json"}).done(function(msg) {
		chrome.tabs.sendMessage(currentTabId, {"cmd":"end"}, function(response) {});
	}).fail(function(jqXHR, textStatus) {});
}
/**
 * ===========================================================
 * EOF 自定义函数
 */

chrome.browserAction.onClicked.addListener(function(tab) {
	flag = flag?false:true; //开关
	setIcon();//按钮图标
	currentTabId = tab.id;
	chrome.tabs.getSelected(null, function(tab) {
		sendMsg(tab.id);
	});
});


chrome.webNavigation.onCompleted.addListener(function( tab ){
	if( flag ){ sendMsg( tab.tabId ); }
});

chrome.runtime.onMessage.addListener(
	function(request, sender, sendResponse){
		var arr = request.msg;
		item_nums+=arr.length-2;
		if(item_nums < 2001){
			ajaxPostJosn(server_url+"/collect/tools/ebay/creategroup",{'gpName':arr[0],'results':arr[1]});
			for(var i=2;i<=arr.length;i++){	
				ajaxPostJosn(server_url+"/collect/tools/ebay/purchasehistory",{'itemId':arr[i],'gpName':arr[0]});
			}
			
			cmd = request.cmd;
			if('end' == cmd){
				flag = false;//确保不会自动运行
				setIcon();
			}
		}else{
			alert("最大限制MAX:2000");
			flag = false;
			setIcon();
			window.open('http://edc.boxintheship.com/collect/tools/ebay/joblist/');
		}
	}
);

function sendMsg(tabid){
	chrome.tabs.sendMessage(tabid, {greeting: "Start Working"}, function(response) {});
}