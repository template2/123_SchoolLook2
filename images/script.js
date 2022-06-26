/* -----------------------------------------
	123 Responsive SchoolLook2 Tistory Skin
	Version 1.1
	2022.06.21
	https://blogpack.tistory.com
	email: extflash@gmail.com
	Distributed under MIT License
----------------------------------------- */

let isMobile = false;//모바일 기기 체크 확인 변수
let isSquareThumbnail = false; //정사각 썸네일 여부

document.addEventListener('DOMContentLoaded', function(){

	//polyfill for IE11
	if(window.NodeList && !NodeList.prototype.forEach) {
		NodeList.prototype.forEach = Array.prototype.forEach;
	}
	if(window.HTMLCollection && !HTMLCollection.prototype.forEach) {
		HTMLCollection.prototype.forEach = Array.prototype.forEach;
	}
	if (!('remove' in Element.prototype)) {
		Element.prototype.remove = function() {
			if (this.parentNode) {
				this.parentNode.removeChild(this);
			}
		};
	}

	//IE체크
	if ( (/MSIE (\d+\.\d+);/.test(navigator.userAgent) || navigator.userAgent.indexOf("Trident/") > -1) ){ 
		document.querySelector('html').classList.add('ie11');
	}

	isSquareThumbnail = document.querySelector('html.square-thumbnail') != null ? true:false;//썸네일 비율 결정

	checkMobile(); // 모바일 체크
	setMobileCategory(); //모바일 메뉴로 카테고리 붙였다 뗌

	if(document.querySelector('html').classList.contains('place-thumbnail')){
		setNoImage(); //이미지 없는 썸네일 배경 이미지 처리
	}

	let el_morepage = document.querySelector(".paging-view-more");
	if( el_morepage != null){
		viewMore();
	}

	//하단 인라인 사이드바 감춤 체크
	if( document.querySelectorAll('.inline-sidebar .box_aside').length == 0){
		document.querySelector('.inline-sidebar').style.display = 'none';
	}

	/* 스크롤 할 때 오프셋 높이 제한 값 이상이면 탑 이동 버튼 표시 */
	window.addEventListener("scroll", function(event){
		if(this.document.querySelector('#header .menu.on') == null){
			let height = window.pageYOffset;
			let btntop = document.querySelector('.btn-top');
			if(height > 160){
				if(document.querySelector('#header .menu.on') == null)
					document.querySelector('#header').classList.add('on');
				if ( btntop != null ){
					if(btntop.classList.contains('hideanim')){
						btntop.classList.remove('hideanim');
						event.stopPropagation();
					}
				}
			}else{
				if(document.querySelector('#header.on') != null)
					document.querySelector('#header.on').classList.remove('on');
				if ( btntop != null )
					btntop.classList.add('hideanim');
			}
			if(document.querySelector('.progressbar') != null)setProgress();
		}
	});

	//모바일 메뉴 아이콘 클릭 처리
	document.querySelector(".mobile-menu").addEventListener("click", function(event){
		let mobile_menu = document.querySelector(".mobile-menu");

		if ( mobile_menu.classList.contains("on") ){
			mobile_menu.classList.remove("on");
			document.querySelector("#header .menu").classList.remove("on");

			if(document.querySelector('.btn-top.hideanim') == null){
				document.querySelector("#header").classList.add("on");
			}
			if(document.querySelector('#dimmed.hideanim') == null){
				document.querySelector("#dimmed").classList.add("hideanim");
			}
			if(document.querySelector('body.overflowlock') != null){
				document.querySelector("body").classList.remove("overflowlock");
			}
		} else {
			document.querySelector("#header").classList.remove('on');
			mobile_menu.classList.add("on");
			document.querySelector("#header .menu").classList.add("on");
			if(document.querySelector('#dimmed.hideanim') != null){
				document.querySelector("#dimmed").classList.remove("hideanim");
			}
			if(document.querySelector('body.overflowlock') == null){
				document.querySelector("body").classList.add("overflowlock");
			}
		}
	});

	//리사이즈 처리
	window.addEventListener("resize", function(){
		checkMobile();
		setMobileCategory();
		
		if(document.querySelector('html.toc-enable.toc-fix .entry-content') && document.querySelector('.toc')){
			positioningToc();
		}
	});

	//모바일 테이블과 아이프레임 처리
	if ( isMobile && document.querySelector(".entry-content") != null ){
		mobileTable();
		iframeWrap();
	}

	//탑으로 애니메이션 스크롤 하는 버튼
	if(document.querySelector('.btn-top') != null){
		document.querySelector('.btn-top').addEventListener('click', function(){
			window.scrollTo({top: 0,left: 0, behavior: 'smooth'});
			return false;
		});
	}

	if (document.querySelector(".entry-content") != null){
		if(document.querySelector('#copyposthtml') != null){
			document.querySelector('#copyposthtml').addEventListener('click', function(){
				copyClipboard('html');
			});
		}
		if(document.querySelector('#copyposttext') != null){
			document.querySelector('#copyposttext').addEventListener('click', function(){
				copyClipboard('text');
			});
		}
		if(document.querySelector('#copylinkhtml') != null){
			document.querySelector('#copylinkhtml').addEventListener('click', function(){
				copyClipboard('link');
			});
		}
	}

	//구글 번역 커스텀 아이콘 클릭 이벤트 처리 코드
	if(document.querySelector('.g-translate-flags .translation-links') != null){
		document.querySelector('.translation-links').addEventListener('click',function(event) {
			let el = event.target;
			if(el != null){
				while(el.nodeName == 'FONT' || el.nodeName == 'SPAN'){el = el.parentElement;}//data-lang 속성이 있는 태그 찾기
				const tolang = el.dataset.lang; // 변경할 언어 코드 얻기
				const gtcombo = document.querySelector('.goog-te-combo');
				if (gtcombo == null) {
					alert("Error: Could not find Google translate Combolist.");
					return false;
				}
				gtcombo.value = tolang; // 변경할 언어 적용
				gtcombo.dispatchEvent(getEventObject('change')); // 변경 이벤트 트리거
			}
			return false;
		});
	}

	//자동목차
	if(document.querySelector('html.toc-enable .entry-content') != null){
		TOC();
		if(document.querySelector('html.toc-enable.toc-fix') &&  document.querySelector('.toc')){
			positioningToc();
		}
	}

	//레이지로드
	window.lazyLoad = lazyLoad;//전역으로 등록
	if(document.querySelector('html.seo-lazyload') != null && document.querySelector('html.ie11') == null){
		const imgs = document.querySelectorAll('article img');
		lazyLoad(imgs, document.querySelector('html.square-thumbnail') != null ? true:false);
	}

	//다크모드 토글
	if(document.querySelector('.darkmode')){
		if(localStorage.getItem("darkmode") == 'on'){
			//다크모드 켜기
			document.body.dataset.darkmode='on';
			document.querySelector('#toggle-radio-dark').checked = true;
		}
		//다크모드 이벤트 핸들러
		document.querySelector('.darkmode').addEventListener("click", e=>{
			if(e.target.classList.contains('todark')){
				document.body.dataset.darkmode='on';
				localStorage.setItem("darkmode", "on");
			}else if(e.target.classList.contains('tolight')){
				document.body.dataset.darkmode='off';
				localStorage.setItem("darkmode", "off");
			}
		},false);
		document.body.style.display = 'block';//다크모드 사용할 때 다크모드 CSS 적용 후 표시
	}else{
		localStorage.removeItem("darkmode");
	}

	//커버 슬라이더 위치 이동
	if(document.querySelector('#content .cover-slider')){
		document.querySelector('#header .search').insertAdjacentElement('afterend',document.querySelector('#content .cover-slider'));
	}

	//모바일 메뉴 이벤트 버블링 제거하기
	if(document.querySelector("#dimmed") != null){
		const events = ["scroll","touchmove","touchend","mousewheel"];
		for(let i = 0;i < events.length;i++){
			document.querySelector('#dimmed').addEventListener(events[i], handleLockEvent);
		}
	}

});//DOMContentLoaded


/* -----------------------------------
	티스토리 스킨용 공통 사용 함수
   ----------------------------------- */

//클립보드 복사
function copyClipboard(datatype){
	if(document.querySelector(".entry-content") != null){
		let contentElement = document.createElement('div');
		if(datatype == 'text' || datatype == "html"){
			contentElement.innerHTML = document.querySelector(".entry-content").innerHTML;
			contentElement.querySelectorAll('.revenue_unit_wrap').forEach(function(adsense){
				adsense.remove();
			});
			contentElement.querySelector('.container_postbtn').remove();
		}else{
			contentElement.innerHTML = document.querySelector(".hgroup h1").innerHTML;
			contentElement.querySelectorAll('span').forEach(function(link){
				link.remove();
			});
			copylink = "<a href=\""+window.location.href+"\">"+contentElement.innerText+"</a>";
		}
	
		let holder = document.createElement('div');
		if(datatype == 'text'){
			holder.innerText = contentElement.innerText;
		}else if(datatype == 'html'){
			holder.innerHTML = contentElement.innerHTML;
		}else{
			holder.innerHTML = copylink;
		}
		contentElement.remove();

		//복사할 내용 홀더 부착
		holder.setAttribute('width', '0');
		holder.setAttribute('height', '0');
		document.querySelector('body').appendChild(holder);
		//영역 선택
		window.getSelection().removeAllRanges()
		let range = document.createRange();
		range.selectNode(holder);
		window.getSelection().addRange(range);
		//클립보드 복사
		document.execCommand('copy');
		holder.remove();
		return false;	
	}
}

// 쿠키 얻기
function getCookie(name){
	name = new RegExp(name + '=([^;]*)');
	return name.test(document.cookie) ? unescape(RegExp.$1) : '';
}

//터치 이벤트 락 핸들 함수
function handleLockEvent(event){
	event.preventDefault();
	event.stopPropagation();
	return false;
}

// 이미지 없는 썸네일 자리 채우기용 투명 이미지 태그 붙이기
function setNoImage(){
	const posts = document.querySelectorAll(".post-item, .cover-list ul li, .recent-posts > li, .cover-list-a ul li, .cover-thumbnail-list ul li, .cover-gallery ul li");
	if(posts.length && posts.length > 0){
		for(let i = 0;i < posts.length;i++){
			if(posts[i].querySelector('.thum') != null && posts[i].querySelector('.thum img') == null){
				if(isSquareThumbnail){
					posts[i].querySelector('.thum').innerHTML = '<img src="data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==">' + posts[i].querySelector('.thum').innerHTML;
				}else{
					posts[i].querySelector('.thum').innerHTML = '<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAMAAAACCAQAAAA3fa6RAAAADklEQVR42mNkAANGCAUAACMAA2w/AMgAAAAASUVORK5CYII=">' + posts[i].querySelector('.thum').innerHTML;
				}
				posts[i].classList.add('noimage');
			}
		}
	}
}

//모바일 사이드바로 카테고리 이동
function setMobileCategory(){
	if(window.getComputedStyle(document.querySelector('#header .category-menu'),null).display == 'none' || isMobile){
		if(document.querySelectorAll('.category-menu > .inner > .category').length){
			if(document.querySelector('#profile') != null){
				document.querySelector('#profile').insertAdjacentHTML('afterend','<div id="mobile_category" class="box_aside"><div class="tit_aside">Category</div></div>');
			}else{
				document.querySelector('#wrap_sidebar1').insertAdjacentHTML('afterbegin','<div id="mobile_category" class="box_aside"><div class="tit_aside">Category</div></div>');
			}
			let mc = document.querySelector('.category-menu > .inner > .category');
			if(mc != null){				
				document.querySelector('#mobile_category').appendChild(mc);
			}
		}
		//document.querySelector('#header .category-menu').style.display = 'block';
	}else{
		if(document.querySelector('#wrap_sidebar1 > #mobile_category') != null){
			let mc = document.querySelector('#mobile_category .category');
			if(mc != null){
				document.querySelector('.category-menu > .inner').insertBefore(mc, document.querySelector('.category-menu > .inner').firstElementChild);
				document.querySelector('#mobile_category').remove();
			}
		}
	}
}

//모바일 메뉴 펼쳐졌으면 클릭 트리거
function clickMobileMenu(){
	if(document.querySelector('#header .menu.on') != null && document.querySelector('.mobile-menu') != null){
		document.querySelector('.mobile-menu').dispatchEvent(getEventObject('click'));
	}
}

// 더보기 버튼 UI 초기화
function viewMoreInit(){
	let nextUrl = document.querySelector(".pagination .next").getAttribute("href");
	let posts = document.querySelectorAll(".pagination a")
	if(posts && posts.length > 0){
		posts.forEach(function(post){
			post.style.display = 'none';
		});
	}
	if( nextUrl ){
		document.querySelector(".pagination .inner").insertAdjacentHTML('beforeend','<a href="javascript:void(0)" class="btn view-more"><span>더보기</span></a>');
		document.querySelector(".pagination .view-more").addEventListener("click", function(){
			loadNext(nextUrl);// 비동기 다음 페이지 가져오기
			return false;
		});
	}
}

// 더보기 방식 버튼 최초 초기화
function viewMore(){
	let el_items = document.querySelectorAll('.post-item');
	let el_viewmore = document.querySelectorAll('.paging-view-more');
	if ( el_items.length ){
		if ( el_viewmore.length ){
			viewMoreInit(); // 더보기 버튼 UI 초기화
		} else {
			let current_num = document.querySelector(".pagination .selected").textContent,
				total_num = document.querySelector(".pagination .next") != null ? document.querySelector(".pagination .next").previousElementSibling.textContent : document.querySelector(".pagination a:last").textContent;
			
			document.querySelector(".pagination .inner").insertAdjacentHTML('beforeend','<span class="current">'+current_num+'/'+total_num+'</span>');
			document.querySelector(".pagination .inner .current").style.color = document.querySelector('.title h1 a').style.color;
		}
	}
}

// 비동기 다음 페이지 목록 가져오기
function loadNext(url){
	let xmlhttp = getXMLHttpRequest();
	xmlhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
		
		let holder = document.createElement("div");
		let res = document.querySelector('html').appendChild(holder);
		res.style.display = "none";
		res.innerHTML = this.responseText;

		let nextPostItems = res.querySelectorAll(".post-item"),
		paginationInner = res.querySelector(".pagination").innerHTML;

		if ( nextPostItems && nextPostItems.length > 0 ){

			//이전 더보기 마킹 삭제
			const pimgs = document.querySelectorAll('.appendimg');
			pimgs.forEach(function(img){
				img.classList.remove('appendimg');
			});

			nextPostItems.forEach(function(post){
				document.querySelector("#content .inner").appendChild(post);
				if(post.querySelector('img') != null)
					post.querySelector('img').classList.add('appendimg');
			});
		
			//레이지 로드
			if(document.querySelector('html.seo-lazyload') != null && document.querySelector('html.ie11') == null){
				const imgs = document.querySelectorAll('.appendimg');
				if(imgs.length > 0){
					lazyLoad(imgs, isSquareThumbnail);
				}
			}
			
			//프로그래스바 업데이트
			if(document.querySelector('.progressbar') != null)setProgress();

			res.remove();//비동기 데이터 삭제

			document.querySelector(".pagination").innerHTML = paginationInner;
			if(document.querySelector('html.place-thumbnail') != null){
				setNoImage(); //이미지 없는 썸네일 배경 이미지 처리
			}
			viewMoreInit(); // 더보기 버튼 UI 초기화
		} else {
			document.querySelector('.pagination').remove();
		}

		}
	};
	xmlhttp.open("GET", url, true);
	xmlhttp.send();
}

//XMLHttpRequest 객체 호환성 구현
function getXMLHttpRequest(){
    let xhr = false;
    try {
        xhr = new XMLHttpRequest();
    }
    catch(err1) {
        //인터넷 익스플로러 비동기 객체 생성 체크
        try {
            xhr = new ActiveXObject("Msxml2.XMLHTTP");
        }
        catch(err2) {
            try {
                xhr = new ActiveXObject("Microsoft.XMLHTTP");
            }
            catch(err3) {
                xhr = false;
            }
        }
    }
    return xhr;
}

//이벤트 객체 얻기
function getEventObject(eventtype){
	let event = null;
	if(eventtype != ''){
		if(document.querySelector('html.ie11') != null){
			event = document.createEvent("Event");
			event.initEvent(eventtype, false, true); 					
		}else{
			event = new Event(eventtype);
		}
	}
	return event;
}

// 모바일기기체크 - @media로 체크
function checkMobile(){
	if ( window.innerWidth <= 1023 ){ 
		isMobile = true;
	}else{
		isMobile = false;
	}
}

// 모바일에서 테이블 감싸서 스와이프로 볼 수 있게 함.
function mobileTable(){
	let tables = document.querySelectorAll(".entry-content table");

	if( tables.length > 0 ){
		for(let i = 0;i < tables.length;i++){
			if ( (tables[i].style.tableLayout === "fixed" || tables[i].classList.contains("txc-table")) && !tables[i].parentElement.classList.contains("table-wrap") ){
				tables[i].outerHTML = ('<div class="table-wrap">'+tables[i].outerHTML+'</div>');
			}
		};
	}
}

// 모바일에서 아이프레임 감싸서 스와이프로 볼 수 있게 함.
function iframeWrap(){
	let iframes = document.querySelectorAll(".entry-content iframe");

	if( iframes.length > 0 ){
		for(let i = 0;i < iframes.length;i++){
			if ( !iframes[i].parentElement.classList.contains("iframe-wrap") ){
				iframes[i].outerHTML = '<div class="iframe-wrap">'+iframes[i].outerHTML+'</div>';
			}
		};
	}
}

//프로그래스바 
function setProgress() {          
    let topPos = document.documentElement.scrollTop;
    let remain = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    let percentage = (topPos / remain) * 100;
    document.querySelector(".progress").style.width = percentage + "%";
}

// 목차 생성 함수
function TOC(){
    if(document.querySelector('html.toc-enable .entry-content') != null){
        
        let toc = '';//목차 생성 결과 문자열
        
        const toc_level = document.querySelector('html.toc-level3') != null ? 3 : (document.querySelector('.toc-level4') != null ? 4 : 2);//뎁스제한
        const toc_fold = document.querySelector('html.toc-fold') != null ? true:false;//하위 목차 접음
        const toc_autonumber = document.querySelector('html.toc-autonumber') != null ? true:false;//자동 넘버링
        const toc_title = document.querySelector('html.toc-title') != null ? true:false;//"목차" 표시
        const toc_indexing = document.querySelector('html.toc-fix.toc-indexing') != null ? true:false;//목차 인덱싱
        let toc_h2 = 1, toc_h3 = 1, toc_h4 = 1;
        
        //목록 HTML 생성용 템플릿
        const str_open_list = "<li class=\"{0}\"><ul class=\"toc-h{1}\">";
        const str_close_list = "</ul></li>";
        const str_list_item = "<li><a href=\"#toc{0}\">{1}{2}</a></li>";

        //제목 아이템 찾기
        const headlist = toc_level == 2 ? document.querySelectorAll('.entry-content h2') : (toc_level == 3 ? document.querySelectorAll('.entry-content h2, .entry-content h3') : document.querySelectorAll('.entry-content h2, .entry-content h3, .entry-content h4'));//목차 태그 수집
    
        //목차 트리 및 북마크 링크
        headlist.forEach(function(item){
            //console.log(item.innerText+"\n"); //찾은 제목 텍스트
            if(item.nodeName == "H2"){
                toc += toc_h4 > 1 ? str_close_list:"";
                toc += toc_h3 > 1 ? str_close_list:"";
                toc += toc_h2 == 1 ? (toc_title ? "<li class=\"title\">목차</li>":""):"";
                toc += str_list_item.format(toc_h2, (toc_autonumber ? toc_h2+". ":""), item.innerText);
                item.id = "toc"+toc_h2;
                toc_h2++;
                toc_h3 = 1;
                toc_h4 = 1;
            }else if(item.nodeName == "H3" && toc_level > 2){
                toc += toc_h4 > 1 ? str_close_list:"";
                toc += toc_h3 == 1 ? str_open_list.format(toc_fold?"fold":"","3"):"";
                toc += str_list_item.format(""+toc_h2+toc_h3, (toc_autonumber ? toc_h3+". ":""), item.innerText);
                item.id = "toc"+toc_h2+toc_h3;
                toc_h3++;
                toc_h4 = 1;
            }else if(item.nodeName == "H4" && toc_level > 3){
				if(!item.parentElement.classList.contains('another_category')){
					toc += toc_h4 == 1 ? str_open_list.format(toc_fold?"fold":"","4"):"";
					toc += str_list_item.format(""+toc_h2+toc_h3+toc_h4, (toc_autonumber ? toc_h4+". ":""), item.innerText);
					item.id = "toc"+toc_h2+toc_h3+toc_h4;
					toc_h4++;
				}
            }
        });

        if(toc != ''){
			toc = "<ul class=\"toc\">"+toc;
            toc += (toc_h4 > 1 ? str_close_list:"");
            toc += (toc_h3 > 1 ? str_close_list:"");
            toc += "</ul>";
            //console.log(toc); //생성된 최종 목차 HTML

			let toc_wrap_element = document.createElement('div');
			toc_wrap_element.innerHTML = toc;

			if(document.querySelector('.entry-content .tt_article_useless_p_margin') != null){
				document.querySelector('.entry-content .tt_article_useless_p_margin').prepend(toc_wrap_element);
			}else{
				document.querySelector('.entry-content').prepend(toc_wrap_element);
			}
			
            // 폴딩 구현
            if(toc_fold){
                const folded = document.querySelectorAll('.toc .fold');
                if(folded.length > 0){
                    folded.forEach(function(item){
                        item.previousElementSibling.innerHTML = item.previousElementSibling.innerHTML+"<a href=\"javascript:void(0)\" class=\"togglefold\"></a>";
                    });
                    document.querySelectorAll('.togglefold').forEach(function(item){
                        item.addEventListener('click', function(event){
                            if(event.target.parentElement.nextElementSibling.classList.contains('fold')){
                                event.target.parentElement.nextElementSibling.classList.remove('fold');
                                event.target.classList.add('unfold');
                            }else{
                                event.target.parentElement.nextElementSibling.classList.add('fold');
                                event.target.classList.remove('unfold');
                            }
                        })
                    });
                }
            }
        }

		//목차 인덱싱 구현
		if(toc_indexing && !document.querySelector('.toc.fix-off')){
			[...headlist].forEach(async item => {
				await onTOCVisible(item);
			});
		}
    }
}

//TOC 고정시 위치 자동 이동 처리
function positioningToc(){
	if(document.documentElement.clientWidth <= 1620 || (document.querySelector('.narrow-layout') && document.documentElement.clientWidth <= 1520)){
		if(!document.querySelector('.toc.fix-off'))
			document.querySelector('.toc').classList.add('fix-off');
	}else{
		if(document.querySelector('.toc.fix-off'))
			document.querySelector('.toc').classList.remove('fix-off');
	}
}

/* 이미지가 뷰포트 안이면 비동기로 이미지 로딩 */
function onTOCVisible(element, options = {}){
	// 기본 교차 옵저버 옵션 설정
	const intersectionObserverOptions = {
		rootMargin: '0px',
		threshold: 0,
		...options,
	};

	//이미지가 처음 화면 도큐먼트 뷰포트 영역 안에 표시되면 리졸브 콜백을 실행하는 프로미스 객체를 리턴
	return new Promise(resolve => {
		//옵저버 객체 생성
		const observer = new IntersectionObserver(async (entries, observer) => {
			// 뷰포트와 교차한 목록
			entries.forEach((entry)=>{
				// 도큐먼트 루트와 교차했는지 체크
				if (entry.isIntersecting && !document.querySelector('.toc.fix-off')) {
					//목차 하일라이트
					if(document.querySelector('.toc a[href="#'+entry.target.id+'"]') != null){
						if(document.querySelector('.toc .text-invert')){
							document.querySelector('.toc .text-invert').classList.remove('text-invert');
						}
						document.querySelector('.toc a[href="#'+entry.target.id+'"]').classList.add('text-invert');
					}
					resolve();
				}
			})
		}, intersectionObserverOptions);
		observer.observe(element);
	});
}

/* 이미지 레이지로드 처리 */
function lazyLoad(imgs, isSquareThumbnail){
	if(imgs.length > 0){
		/* 페이지 안의 이미지 "src" 속성을 "data-src" 속성으로 옮기고 "lazyload" 클래스 부여 */
		imgs.forEach(function(img){
			const rect = img.getBoundingClientRect();
			if(!(rect.bottom > window.pageYOffset && rect.top < window.pageYOffset+(window.innerHeight || document.documentElement.clientHeight))){
				if(img.getAttribute('srcset') != null){
					img.setAttribute('data-srcset', img.getAttribute('srcset'));
					if(isSquareThumbnail){
						img.setAttribute('srcset', 'data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==');
					}else{
						img.setAttribute('srcset', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAMAAAACCAQAAAA3fa6RAAAADklEQVR42mNkAANGCAUAACMAA2w/AMgAAAAASUVORK5CYII=');
					}
				}
				if(img.getAttribute('src') != null){
					img.setAttribute('data-src', img.getAttribute('src'));
					if(isSquareThumbnail){
						img.setAttribute('src', 'data:image/gif;base64,R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==');
					}else{
						img.setAttribute('src', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAMAAAACCAQAAAA3fa6RAAAADklEQVR42mNkAANGCAUAACMAA2w/AMgAAAAASUVORK5CYII=');
					}
				}
				img.classList.add('lazyload');			
			};
		});
	}

	//"src"를 처리함 이미지 태그에 프로미스 비동기 함수를 매핑
	[...document.querySelectorAll('#content img.lazyload')].forEach(async img => {
		await onElementVisible(img);
		if(img.getAttribute('src') != null){
			img.setAttribute('src', img.getAttribute('data-src'));
		}
		if(img.getAttribute('srcset') != null){
			img.setAttribute('srcset', img.getAttribute('data-srcset'));
		}
	});
}

/* 이미지가 뷰포트 안이면 비동기로 이미지 로딩 */
function onElementVisible(element, options = {}){
	// 기본 교차 옵저버 옵션 설정
	const intersectionObserverOptions = {
		rootMargin: '0px',
		threshold: 0,
		...options,
	};

	//이미지가 처음 화면 도큐먼트 뷰포트 영역 안에 표시되면 리졸브 콜백을 실행하는 프로미스 객체를 리턴
	return new Promise(resolve => {
		//옵저버 객체 생성
		const observer = new IntersectionObserver(async entries => {
			// 뷰포트와 교차한 목록
			const [entry] = entries;

			// 도큐먼트 루트와 교차했는지 체크
			if (entry.isIntersecting) {
				// 프로미스 리졸브 실행
				resolve();
				// 옵저버를 종료해 한번만 실행되도록 함
				observer.disconnect();
			}
		}, intersectionObserverOptions);
		observer.observe(element);
	});
}

//문자열 포매팅 프로토타입 메서드 구현
String.prototype.format = function() {
    var formatted = this;
    for (var i = 0; i < arguments.length; i++) {
        var regexp = new RegExp('\\{'+i+'\\}', 'gi');
        formatted = formatted.replace(regexp, arguments[i]);
    }
    return formatted;
};