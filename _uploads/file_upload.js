var upload_range=1;var get_status_url;var seconds=0;var minutes=0;var hours=0;var total_upload_size=0;var total_Kbytes=0;var CPB_loop=false;var CPB_width=0;var CPB_bytes=0;var CPB_time_width=500;var CPB_time_bytes=15;var CPB_hold=true;var CPB_byte_timer;var CPB_status_timer;var BPB_width_inc=0;var BPB_width_new=0;var BPB_width_old=0;var BPB_timer;var UP_timer;
function checkFileNameFormat(){if(!check_file_name_format)return false;for(var i=0;i<upload_range;i++){if(document.uu_upload.elements['upfile_'+i].value!=""){var string=document.uu_upload.elements['upfile_'+i].value;var num_of_last_slash=string.lastIndexOf("\\");if(num_of_last_slash<1){num_of_last_slash=string.lastIndexOf("/");}var file_name=string.slice(num_of_last_slash+1,string.length);var re=/^[\w][\w\.\-\s]{1,100}$/i;if(!re.test(file_name)){alert("Sorry, uploading files in this format is not allowed. Please ensure your file names follow this format. \n\n1. Entire file cannot exceed 100 characters\n2. Format should be filename.extension or filename\n3. Legal characters are 1-9, a-z, A-Z, _, -, space\n");return true;}}}return false;}
function checkAllowFileExtensions(){var d=document;if(!check_allow_extensions_on_client)return false;var check_extensions=imageselected?allow_image_extensions:allow_extensions;for(var i=0;i<upload_range;i++){if(d.uu_upload.elements['upfile_'+i].value!=""){if(!d.uu_upload.elements['upfile_'+i].value.match(check_extensions)){var string=d.uu_upload.elements['upfile_'+i].value;var num_of_last_slash=string.lastIndexOf("\\");if(num_of_last_slash<1){num_of_last_slash=string.lastIndexOf("/");}var file_name=string.slice(num_of_last_slash+1,string.length);var file_extension=file_name.slice(file_name.lastIndexOf(".")).toLowerCase();alert('Sorry, uploading a file with the extension "'+file_extension+'" is not allowed.');return true;}}}return false;}
function checkDisallowFileExtensions(){var d=document;if(!check_disallow_extensions_on_client)return false;for(var i=0;i<upload_range;i++){if(d.uu_upload.elements['upfile_'+i].value!=""){if(d.uu_upload.elements['upfile_'+i].value.match(disallow_extensions)){var string=d.uu_upload.elements['upfile_'+i].value;var num_of_last_slash=string.lastIndexOf("\\");if(num_of_last_slash<1){num_of_last_slash=string.lastIndexOf("/");}var file_name=string.slice(num_of_last_slash+1,string.length);var file_extension=file_name.slice(file_name.indexOf(".")).toLowerCase();alert('Sorry, uploading a file with the extension "'+file_extension+'" is not allowed.');return true;}}}return false;}
function checkNullFileCount(){if(!check_null_file_count)return false;var null_file_count=0;for(var i=0;i<upload_range;i++){if(document.uu_upload.elements['upfile_'+i].value==""){null_file_count++;}}if(null_file_count==upload_range){alert("Vali fail, mida soovid üles laadida.");return true;}else return false;}
function checkDuplicateFileCount(){if(!check_duplicate_file_count)return false;var duplicate_flag=false;var file_count=0;var duplicate_msg="Sul on valitud sama nimega faile mitu korda, kas tahad uploadi katkestada ?\n\n";var file_name_array=new Array();for(var i=0;i<upload_range;i++){if(document.uu_upload.elements['upfile_'+i].value!=""){var string=document.uu_upload.elements['upfile_'+i].value;var num_of_last_slash=string.lastIndexOf("\\");if(num_of_last_slash<1){num_of_last_slash=string.lastIndexOf("/");}var file_name=string.slice(num_of_last_slash+1,string.length);file_name_array[i]=file_name;}}var num_files=file_name_array.length;for(var i=0;i<num_files;i++){for(var j=0;j<num_files;j++){if(file_name_array[i]==file_name_array[j]&&file_name_array[i]!=null){file_count++;}}if(file_count>1){duplicate_msg+='Korduv fail "'+file_name_array[i]+'" lahtris number '+(i+1)+".\n";duplicate_flag=true;}file_count=0;}if(duplicate_flag)return confirm(duplicate_msg);else return false;}
function resetForm(){location.href=self.location;}
function hideProgressBar(){tryLog('hideProgressBar');document.getElementById('progress_bar').style.display="none";}
function showDebugMessage(message){document.getElementById('ubr_debug').innerHTML+=message+'<br />';}function clearDebugMessage(){document.getElementById('ubr_debug').innerHTML='';}
var javaupload=false;
var in_iframe=false;
function showAlertMessage(message){if(javaupload&&in_iframe)return;document.getElementById('ubr_alert').innerHTML=message;}function clearAlertMessage(){document.getElementById('ubr_alert').innerHTML='';}function stopDataLoop(){clearInterval(UP_timer);clearInterval(BPB_timer);CPB_loop=false;uploadDone();}
function iniFilePage(){
	tryLog('iniFilePage');
	var d=document;
	resetProgressBar();clearAlertMessage();for(var i=0;i<upload_range;i++){d.uu_upload.elements['upfile_'+i].disabled=false;d.uu_upload.elements['upfile_'+i].value="";}d.getElementById('upload_button').disabled=false;d.getElementById('progress_bar').style.display="none";d.uu_upload.reset();var nos=d.getElementsByTagName('NOSCRIPT');if(nos)for(var i=0;i<nos.length;i++)nos[i].style.display='none';
}
function resetProgressBar(){var d=document;CPB_loop=false;clearInterval(BPB_timer);clearInterval(UP_timer);seconds=0;minutes=0;hours=0;CPB_width=0;CPB_bytes=0;CPB_hold=true;total_upload_size=0;total_Kbytes=0;d.getElementById('upload_status').style.width='0px';if(show_percent_complete){d.getElementById('percent_complete').innerHTML='0%';}if(show_files_uploaded){d.getElementById('files_uploaded').innerHTML=0;}if(show_files_uploaded){d.getElementById('total_uploads').innerHTML='';}if(show_current_position){d.getElementById('current_position').innerHTML=0;}if(show_current_position){d.getElementById('total_kbytes').innerHTML='';}if(show_elapsed_time){d.getElementById('elapsed_time').innerHTML=0;}if(show_est_time_left){d.getElementById('est_time_left').innerHTML=0;}if(show_est_speed){d.getElementById('est_speed').innerHTML=0;}uploadDone();}
function handleKey(event){if(document.all){if(window.event.keyCode==13)return false;}else{if(event&&event.which==13)return false;}}
function linkUpload(){
	var d=document;
	if(d.getElementById('cat_val').value=='cat_link')return linkUpload2();
	if(checkFileNameFormat())return false;
	if(checkAllowFileExtensions())return false;
	if(checkDisallowFileExtensions())return false;
	if(checkNullFileCount())return false;
	if(checkDuplicateFileCount())return false;
	d.getElementById('upload_button').disabled=true;
	if(show_files_uploaded){
		var total_uploads=0;
		for(var i=0;i<upload_range;i++){if(d.uu_upload.elements['upfile_'+i].value!=""){total_uploads++;}}
		d.getElementById('total_uploads').innerHTML=total_uploads;
	}
	var jsel=d.createElement('SCRIPT');
	var day=new Date;
	var dom;
	if(d.getElementById('ajax_div')){dom=d.getElementById('ajax_div');}else{dom=d.body;}
	jsel.type='text/javascript';
	jsel.src=appendParam(path_to_link_script,'rnd_id='+day.getTime());
	dom.appendChild(jsel);
	dom=null;
	jsel=null;
	day=null;
}
function linkUpload2(){
	var d=document;
	if(d.getElementById('url').value==''){alert('URL peab olema sisestatud!');return false;}
	d.getElementById('upload_button').disabled=true;
	for(var i=upload_range-1;i>=0;i--){removeUploadSlot(i,true);}
	addUploadSlot(0);
//	d.getElementById('total_uploads').innerHTML='1';
	var jsel=d.createElement('SCRIPT');
	var day=new Date;
	var dom;
	if(d.getElementById('ajax_div')){dom=d.getElementById('ajax_div');}else{dom=d.body;}
	jsel.type='text/javascript';
	jsel.src=appendParam(appendParam(path_to_link_script,'rnd_id='+day.getTime()), 'linkmode=1');
	dom.appendChild(jsel);
	dom=null;
	jsel=null;
	day=null;
}
function startUpload(upload_id,debug_upload,fromjava){
	var d=document;
	if(fromjava){
		javaupload=true;
		d.getElementById('upload_button').disabled=true;
		d.body.onbeforeunload=function(e){return js_upload_onbeforeunload;};
	}else{
		d.uu_upload.action=appendParam(appendParam(path_to_upload_script,'X-Progress-ID='+upload_id),'upload_id='+upload_id);
		d.uu_upload.submit();
	}
	for(var i=0;i<upload_range;i++){
		d.uu_upload.elements['upfile_'+i].disabled=true;
	}
	if(d.getElementById('upload_div')){d.getElementById('upload_div').style.display="none";}
	if(!debug_upload){initializeProgressBar(upload_id);}
}
function hideAreas(){if(hide_when_uploading){var apl=document.getElementById('upapp');try{if(apl&&(BrowserDetect.browser!='Chrome'&&BrowserDetect.browser!='Safari'&&BrowserDetect.browser!='Firefox'||true)){apl.width=1;apl.height=1;apl.style.left="0px";apl.style.top="0px";apl.style.width="1px";apl.style.height="1px";}}catch(ex){}var arr=hide_when_uploading.split(',');for(var i=0;i<arr.length;i++){var cont=document.getElementById(arr[i]);if(cont){if(BrowserDetect.browser!='Firefox'||arr[i]!='upContainer'){cont.style.overflow="hidden";cont.style.height="1px";cont.style.width="1px";cont.style.top="0px";cont.style.left="0px";cont.style.position="absolute";}else{cont.style.opacity='0.0';}}}}}
function appendParam(str,addon){return str+(str.indexOf('?')==-1?'?':'&')+addon;}
function initializeProgressBar(upload_id){
	if (path_to_nginx_progress != '') {
		start_nginx_refresher(upload_id);
		return;
	}
	var d=document;
	var jsel=d.createElement('SCRIPT');
	var dom;
	if(d.getElementById('ajax_div')){dom=d.getElementById('ajax_div');}else{dom=d.body;}
	jsel.type='text/javascript';
	jsel.src=appendParam(path_to_set_progress_script,'upload_id='+upload_id);
	dom.appendChild(jsel);
	dom=null;
	jsel=null;
	day=null;
}
if (typeof XMLHttpRequest == "undefined")
  XMLHttpRequest = function () {
    try { return new ActiveXObject("Msxml2.XMLHTTP.6.0"); }
      catch (e) {}
    try { return new ActiveXObject("Msxml2.XMLHTTP.3.0"); }
      catch (e) {}
    try { return new ActiveXObject("Microsoft.XMLHTTP"); }
      catch (e) {}
    //Microsoft.XMLHTTP points to Msxml2.XMLHTTP and is redundant
    throw new Error("This browser does not support XMLHttpRequest.");
  };
function start_nginx_refresher(upload_id) {
	nginx_timer = setInterval(function(){
		nginx_refresher(upload_id);
	}, 1000);
	nginx_start_time = new Date().getTime();
}
var nginx_timer = null;
var nginx_start_time = 0;
var nginx_inited = false;

function tryLog(msg) {return;try{console.log(msg);}catch(e){}}

function nginx_refresher(upload_id) {
	var req = new XMLHttpRequest();
	req.open("GET", path_to_nginx_progress, 1);
	req.setRequestHeader("X-Progress-ID", upload_id);
	req.onreadystatechange = function () {
		if (req.readyState == 4) {
			if (req.status == 200) {
				/* poor-man JSON parser */
				var upload = false;
				try{upload=JSON.parse(req.responseText);}catch(e){}
				switch(upload.state) {
					case 'done':
						if (nginx_timer) {
							clearInterval(nginx_timer);
							nginx_timer = null;
						}
						hideProgressBar();
						stopDataLoop();
						break;
					case 'starting':
						break;
					case 'error':
						break;
					case 'uploading':
						if (!nginx_inited) {
							nginx_inited = true;
							tryLog('initing progressbar, size='+upload.size+' starttime='+ Math.floor(nginx_start_time/1000));
							startProgressBar(upload_id, upload.size, Math.floor(nginx_start_time/1000));
						}
						tryLog('setProgressStatus, done='+upload.received+', spent='+Math.ceil((new Date().getTime()-nginx_start_time)/1000));
						setProgressStatus(upload.received, 1, '', upload.received, Math.ceil((new Date().getTime()-nginx_start_time)/1000));
						break;
				}
			}
		}
	}
	req.send(null);
}
function stopUpload(){try{window.stop();}catch(e){try{document.execCommand('Stop');}catch(e){}}}
function startProgressBar(upload_id,upload_size,start_time){
	total_upload_size=upload_size;
	total_Kbytes=Math.round(total_upload_size/1024);
	get_status_url=appendParam(path_to_get_progress_script,'upload_id='+upload_id+'&start_time='+start_time+'&total_upload_size='+total_upload_size);
	CPB_loop=true;
	hideAreas();
	document.getElementById('progress_bar').style.display="block";
	showAlertMessage("<br /><div class=\"pageTitle\">"+js_upload_inprogress+"</div><br />");
	if(show_current_position){document.getElementById('total_kbytes').innerHTML=total_Kbytes+" ";}
	if(show_elapsed_time){UP_timer=setInterval("getElapsedTime()",1000);}
	if (path_to_nginx_progress == '')
		getProgressStatus();
	if(cedric_progress_bar==1){if(show_current_position){smoothCedricBytes();}smoothCedricStatus();}
}
function setProgressStatus(total_bytes_read,files_uploaded,current_filename,bytes_read,lapsed_time){
	var byte_speed=0;
	var time_remaining=0;
	var dom;
	var d=document;
	if(lapsed_time>0){byte_speed=total_bytes_read/lapsed_time;}
	if(byte_speed>0){time_remaining=Math.round((total_upload_size-total_bytes_read)/byte_speed);}
	if(cedric_progress_bar==1){
		if(byte_speed!=0){
			var temp_CPB_time_width=Math.round(total_upload_size*1000/(byte_speed*progress_bar_width));
			var temp_CPB_time_bytes=Math.round(1024000/byte_speed);
			if(temp_CPB_time_width<5001){CPB_time_width=temp_CPB_time_width;}
			if(temp_CPB_time_bytes<5001){CPB_time_bytes=temp_CPB_time_bytes;}
		}else{
			CPB_time_width=500;
			CPB_time_bytes=15;
		}
	}
	var percent_float=total_bytes_read/total_upload_size;
	var percent=Math.round(percent_float*100);
	var progress_bar_status=Math.round(percent_float*progress_bar_width);
	var remaining_sec=(time_remaining%60);
	var remaining_min=(((time_remaining-remaining_sec)%3600)/60);
	var remaining_hours=((((time_remaining-remaining_sec)-(remaining_min*60))%86400)/3600);
	if(remaining_sec<10){remaining_sec='0'+remaining_sec;}
	if(remaining_min<10){remaining_min='0'+remaining_min;}
	if(remaining_hours<10){remaining_hours='0'+remaining_hours;}
	var time_remaining_f=remaining_hours+':'+remaining_min+':'+remaining_sec;
	var Kbyte_speed=Math.round(byte_speed/1024);
	var Kbytes_read=Math.round(total_bytes_read/1024);
	if(cedric_progress_bar==1){
		if(cedric_hold_to_sync){
			if(progress_bar_status<CPB_width){
				CPB_hold=true;
			}else{
				CPB_hold=false;
				CPB_width=progress_bar_status;
				CPB_bytes=Kbytes_read;
			}
		}else{
			CPB_hold=false;
			CPB_width=progress_bar_status;
			CPB_bytes=Kbytes_read;
		}
		dom=d.getElementById('upload_status');
		dom.style.width=progress_bar_status+'px';
	}else if(bucket_progress_bar==1){
		BPB_width_old=BPB_width_new;
		BPB_width_new=progress_bar_status;
		if((BPB_width_inc<BPB_width_old)&&(BPB_width_new>BPB_width_old)){BPB_width_inc=BPB_width_old;}
		clearInterval(BPB_timer);
		BPB_timer=setInterval("incrementProgressBar()",10);
	}else{
		dom=d.getElementById('upload_status');
		dom.style.width=progress_bar_status+'px';
	}
	if(show_current_position){dom=d.getElementById('current_position');dom.innerHTML=Kbytes_read;}
	if(show_current_file){dom=d.getElementById('current_file');dom.innerHTML=current_filename;}
	if(show_percent_complete){dom=d.getElementById('percent_complete');dom.innerHTML=percent+'%';}
	if(show_files_uploaded){dom=d.getElementById('files_uploaded');dom.innerHTML=files_uploaded;}
	if(show_est_time_left){dom=d.getElementById('est_time_left');dom.innerHTML=time_remaining_f;}
	if(show_est_speed){dom=d.getElementById('est_speed');dom.innerHTML=Kbyte_speed;}
	dom=null;
}
function incrementProgressBar(){var PB_dom=document.getElementById('upload_status');if(BPB_width_inc<BPB_width_new){BPB_width_inc++;PB_dom.style.width=BPB_width_inc+'px';}}
function getProgressStatus(){
	var d=document;
	var jsel=d.createElement('SCRIPT');
	var day=new Date;
	var dom;
	if(d.getElementById('ajax_div')){dom=d.getElementById('ajax_div');dom.innerHTML='';}else{dom=d.body;}
	jsel.type='text/javascript';
	jsel.src=get_status_url+"&rnd_id="+day.getTime();
	dom.appendChild(jsel);
	dom=null;
	jsel=null;
	day=null;
}
function getElapsedTime(){seconds++;if(seconds==60){seconds=0;minutes++;}if(minutes==60){minutes=0;hours++;}var hr=""+((hours<10)?"0":"")+hours;var min=""+((minutes<10)?"0":"")+minutes;var sec=""+((seconds<10)?"0":"")+seconds;var dom=document.getElementById('elapsed_time');dom.innerHTML=hr+":"+min+":"+sec;dom=null;hr=null;min=null;sec=null;}
function smoothCedricStatus(){if(CPB_width<progress_bar_width&&!CPB_hold){CPB_width++;var dom=document.getElementById('upload_status');dom.style.width=CPB_width+'px';dom=null;}if(CPB_loop){clearTimeout(CPB_status_timer);CPB_status_timer=setTimeout("smoothCedricStatus()",CPB_time_width);}}
function smoothCedricBytes(){if(CPB_bytes<total_Kbytes&&!CPB_hold){CPB_bytes++;var dom=document.getElementById('current_position');dom.innerHTML=CPB_bytes;dom=null;}if(CPB_loop){clearTimeout(CPB_byte_timer);CPB_byte_timer=setTimeout("smoothCedricBytes()",CPB_time_bytes);}}
function addUploadSlot(num){if(upload_range<max_upload_slots){if(num==upload_range){var up=document.getElementById('upload_slots');var dv=document.createElement("div");dv.innerHTML='<input type="file" name="upfile_'+upload_range+'" id="upfile_'+upload_range+'" class="input" size="40" onKeypress="return handleKey(event)" />&nbsp;<a href="javascript:;" id="upfile_'+upload_range+'_del" onclick="return removeUploadSlot('+upload_range+')">-</a>';dv.id='upfile_'+upload_range+'_div';up.appendChild(dv);upload_range++;up=null;dv=null;}}return false;}
function addUploadSlot2(slot){}
function removeUploadSlot(slot,force){if(!slot&&!force)return;var d=document;var up=d.getElementById('upload_slots');var dv=d.getElementById('upfile_'+slot+'_div');if(!dv)return;try{up.removeChild(dv);}catch(Ex){}if(slot<upload_range-1){var cnt=1;for(var i=1;i<upload_range-1;i++){var chdv=d.getElementById('upfile_'+i+'_div');var chslot=d.getElementById('upfile_'+i);var chlink=d.getElementById('upfile_'+i+'_del');if(chdv&&chslot&&chlink){chdv.id='upfile_'+cnt+'_div';chslot.id='upfile_'+cnt;chslot.name='upfile_'+cnt;chlink.id='upfile_'+cnt+'_del';chlink.onclick='return removeUploadSlot('+cnt+')';cnt++;}}}upload_range--;return false;}
var imageselected=false;
function selectCat(link){try{var arr={'cat_file':{'picture_stat':'none','upload_slots':'inline-block','link_slots':'none','addslots':''},'cat_picture':{'picture_stat':'block','upload_slots':'inline-block','link_slots':'none','addslots':''},'cat_link':{'picture_stat':'none','upload_slots':'none','link_slots':'inline-block','addslots':'none'}};var i=0;for(i in arr){if(typeof arr[i] == 'function')continue;if(document.getElementById(i))document.getElementById(i).className='uploadcat';}link.className='uploadcatselected';imageselected=link.id=='cat_picture';document.getElementById('cat_val').value=link.id;var j=0;for(j in arr[link.id]){if(typeof arr[link.id][j] == 'function')continue;if(document.getElementById(j))document.getElementById(j).style.display=arr[link.id][j];}}catch(Ex){if(debug)alert(Ex);}return false;}
function preloadimages(){MM_preloadImages('../images/progress_bar_blue.gif','../images/progress_bar_white.gif');}
var debug=false;
function passToApplet(varname,chk){debug=false;var appl=document.applets&&document.applets.length?document.applets[0]:document.getElementById('upapp');if(debug){appl=document.upapp;alert(appl);}if(!appl)return;var val='';try{eval('val='+varname+';');}catch(Ex){if(debug)alert(Ex);}if(debug)alert(varname+'='+val+' chk='+chk);try{appl.setSafeParam(''+varname,''+val,''+chk);}catch(Ex){if(debug)alert(Ex);}}
function noClipboardImage(){alert('Clipboardis ei ole pilti mida serverisse saata!');}
function noClipboardFiles(){alert('Clipboardis ei ole faile mida serverisse saata!');}
function fileTooBig(){alert('Valitud fail on liiga suur!');}
function getValue(id){var elem=document.getElementById(id);if(!elem)return'';if(elem.type.toLowerCase()=='checkbox'){return elem.checked?'1':'0'}return elem.value;}
function uploadDone(){document.body.onbeforeunload=function(e){};}
function autoSend(id){if(!id)return;var obj=document.getElementById(id);if(!obj)return;try{send_through_proxy(obj.value);}catch(ex){}}
function checkInvalidEmail(){var em=document.getElementById('email');if(em.value=='')return;var emval=em.value.toLowerCase();
var invalidEmails={'@hot.ee':['suvaline000','kk','kkk','adasd','ssd','dafdaf','afgfaf','adfsgg','sdgasfgg','sggg','ahahahahb','asass','munn','awdas','dsfdsf','dfdf','asdadsafa','dasd','asdasd','adaff','asjda','adfaf','fgfg','sdfsd','sdfsdf','fgfdsa','werwfsd'],'@asd.ee':['*']};
for(var dompart in invalidEmails){var arr=invalidEmails[dompart];if(emval.indexOf(dompart)==-1)continue;for(var i=0;i<arr.length;i++){if(emval==arr[i]+dompart||arr[i]=='*'){em.value = '';
if(lng == 'est') alert('Emaili sisestamine EI OLE KOHUSTUSLIK!! Ei ole vaja olematuid emaile sisestada!');
else alert('The email field IS NOT REQUIRED!! There is no need to fill it with false data!');			
return;}}}}