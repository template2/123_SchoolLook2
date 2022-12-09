/* -----------------------------------------
	123 Responsive SchoolLook2 Tistory Skin
	Version 1.11
	2022.12.09
	https://blogpack.tistory.com
	email: extflash@gmail.com
	Distributed under MIT License
----------------------------------------- */

window.addEventListener('DOMContentLoaded', function(){
    //커버 썸네일 목록 초기화
    if( document.querySelectorAll(".cover-thumbnail-list, .cover-gallery").length > 0 ){
        document.querySelectorAll(".cover-thumbnail-list, .cover-gallery").forEach(function(el){
                let len = el.querySelectorAll('ul li').length;
                el.classList.add('type'+(len>4?parseInt(len/2):len));
        });
    
        document.querySelectorAll(".cover-thumbnail-list .thum, .cover-gallery figure").forEach(function(el){
            if(el.querySelectorAll('img').length == 0){
                el.innerHTML += '<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAMAAAACCAQAAAA3fa6RAAAADklEQVR42mNkAANGCAUAACMAA2w/AMgAAAAASUVORK5CYII=">';
                el.classList.add('noimage');
            }
        });
    }
    
    // 링크없는 더보기 버튼 삭제
    if(document.querySelectorAll('a.more-btn[href=""]').length > 0){
        document.querySelectorAll('a.more-btn[href=""]').forEach(function(el){
            el.remove();
        });
    }

    //링크없는 하이퍼링크 삭제 처리
    if(document.querySelectorAll('.cover-thumbnail-list a[href=""], .cover-ribbon a[href=""]').length > 0){
        document.querySelectorAll('.cover-thumbnail-list a[href=""], .cover-ribbon a[href=""]').forEach(function(el){
            while (el.childNodes.length) {
                el.parentElement.appendChild(el.firstChild);
            }
            el.remove();
        });
    }
    //커버슬라이더 호출
    if(document.querySelectorAll('.cover-slider').length > 0){
        coverSlider();    
    }
});

//커버슬라이더
function coverSlider(){
    document.querySelectorAll(".cover-slider").forEach(function(slider){
        
        //환경설정

        // 슬라이드 애니메이션 타입을 html 태그에서 얻기
        // 'movingforward':오른쪽방향 이동(next클릭), 'movingbackward': 왼쪽방향 이동(prev클릭), 'fadingforward': 페이드인아웃 오른쪽 방향(next클릭), 'fadingbackward': 페이드인아웃 왼쪽 방향(prev클릭)
        let ANIMTYPE = document.documentElement.dataset.coverSliderType != undefined ? document.documentElement.dataset.coverSliderType:'movingforward';
        //슬라이드 교체 간격
        let INTERVALSEC = document.documentElement.dataset.coverSliderInterval != undefined ? document.documentElement.dataset.coverSliderInterval:5; // 커버 슬라이드 교체 간격. 기본값 5(초)


        //애니메이션 내부처리용 변수
        let interval = INTERVALSEC*1000; // 슬라이드 이동 간격 - 기본설정 5000(5초), 0이면 멈춤, 슬라이드 교체 간격
        let animateTime = 500; // 슬라이드 이동시간 - 기본설정 500(0.5초), 커지면 느리게 애니메이션
        let bIndicatorJump = true; // 인디케이터 클릭시 슬라이드 순차 이동 없이 점프함.
        let bShowIndex = false;

        let sliderItems = undefined, // 슬라이드 아이템들 객체 리스트
        indicatorItems = undefined, // 슬라이드 아이템들 객체 리스트
        itemsLength = 0, // 슬라이드 아이템 갯수
        currIndex = 0, // 슬라이드 인덱스
        looper = undefined; // 슬라이드 인터벌 타이머 객체
        let timeouts = [];

        //애니메이션 타입별 트랜지션 기본값 설정
        slider.classList.add(ANIMTYPE);
        animDirection = ANIMTYPE == "movingbackward" || ANIMTYPE == "fadingbackward" ? -1:1;
        animDirectionCss = animDirection == 1 ? ".next":".prev";
        
        sliderItems = slider.querySelectorAll(".inner ul li");
        itemsLength = sliderItems.length;

        //커버 슬라이드 있으면
        if ( itemsLength > 1 ){

            //좌우 이동 버튼 생성
            slider.innerHTML += '<button type="button" class="prev"><span>이전</span></button><button type="button" class="next"><span>다음</span></button>';

            looper = setLoop();//자동 루프

            //인디케이터 생성
            slider.innerHTML += '<ol class="cover-slider-indicator"></ol>';
            for(let i=0;i<itemsLength;i++){
                let element = document.createElement('li');
                element.setAttribute('index', i);

                if(animDirection==1 && i==0){
                    element.classList.add('active');
                }else if(animDirection==-1 && i==itemsLength-1){
                    element.classList.add('active');
                }

                element.addEventListener('click', function(event){
                    let clickedIndicator = parseInt(event.target.getAttribute('index'));
                    if(currIndex != clickedIndicator){
                        if(!bIndicatorJump)
                        {
                            //슬라이드 순차 이동
                            cascadeSlides(currIndex, clickedIndicator); // 중간 슬라이드 건너뛰고 마지막 슬라이드로 바로 이동.
                        }else{
                            //슬라이드 점프
                            jumpSlides(currIndex, clickedIndicator); // 중간 슬라이드 건너뛰고 마지막 슬라이드로 바로 이동.
                        }
                    }
                });

                slider.querySelector('.cover-slider-indicator').appendChild(element);
                indicatorItems = slider.querySelectorAll('ol li');
            }

            //슬라이더 방향 초기화
            if(animDirection==1){
                slider.querySelectorAll('ul li')[0].classList.add('active');
            }else{
                slider.querySelectorAll('ul li')[itemsLength-1].classList.add('active');
                currIndex = itemsLength-1;
            }

            // < 클릭
            slider.querySelector('.prev').addEventListener("click", function(){
                if(slider.querySelector('li.inactive') == null){
                    if(looper != undefined){looper=clearInterval(looper)};//임시로 루프 죽이고

                    if(ANIMTYPE.indexOf('forward') > 0){
                        changeDirection();
                    }

                    slider.querySelectorAll('ul li')[currIndex].classList.remove('active');
                    indicatorItems[currIndex].classList.remove('active');
                    slider.querySelectorAll('ul li')[currIndex].classList.add('inactive');

                    currIndex = currIndex-1 < 0 ? sliderItems.length-1 : currIndex-1;
                    slider.querySelectorAll('ul li')[currIndex].classList.add('active');
                    indicatorItems[currIndex].classList.add('active');

                    if(looper == undefined)looper = setLoop();//루프 재설정
                }
            });
            
            // > 클릭
            slider.querySelector(".next").addEventListener("click", function(){
                if(slider.querySelector('li.inactive') == null){
                    if(looper != undefined){looper=clearInterval(looper)};//임시로 루프 죽이고

                    if(ANIMTYPE.indexOf('backward') > 0){
                        changeDirection();
                    }

                    slider.querySelectorAll('ul li')[currIndex].classList.remove('active');
                    indicatorItems[currIndex].classList.remove('active');
                    slider.querySelectorAll('ul li')[currIndex].classList.add('inactive');
    
                    currIndex = currIndex+1 >= sliderItems.length ? 0 : currIndex+1;
                    slider.querySelectorAll('ul li')[currIndex].classList.add('active');
                    indicatorItems[currIndex].classList.add('active');

                    if(looper == undefined)looper = setLoop();//루프 재설정
                }
            });

            //사라지는 슬라이드 속성 제거
            slider.querySelectorAll('ul li').forEach(function(item){
                item.addEventListener('transitionend', function(){
                    item.classList.remove('inactive');
                });
            });
        
            //슬라이딩 방향 전환
            function changeDirection(){
                slider.classList.remove(ANIMTYPE);
                ANIMTYPE = ANIMTYPE.indexOf('forward') > 0 ? ANIMTYPE.substring(0,6)+'backward':ANIMTYPE.substring(0,6)+'forward';
                slider.classList.add(ANIMTYPE);
                animDirection = ANIMTYPE == "movingbackward" || ANIMTYPE == "fadingbackward" ? -1:1;
                animDirectionCss = animDirection == 1 ? ".next":".prev";        
            }

            //슬라이드 자동 루핑
            function setLoop(){
                if(interval > 0){
                    return setInterval(
                        function autoScrollSlider(){
                            slider.querySelector(animDirectionCss).dispatchEvent(getEventObject('click'));
                        }, interval
                    );
                }
            }

            //인디케이터 캐스캐이드 이동
            function cascadeSlides(curr, dest){
                //슬라이드 순차 이동
                let sliding_Size = Math.abs(curr - dest);
                for(let j = 0;j<sliding_Size;j++){
                    (function(direction, index){
                        timeouts.push(setTimeout(function(){
                            if(slider.querySelector('li.inactive') != null)slider.querySelector('li.inactive').classList.remove('inactive');
                            slider.querySelector(direction==1?'.next':'.prev').dispatchEvent(getEventObject('click'));
                        },animateTime*index));
                        }
                    )((curr < dest ? 1:-1), j);
                }
            }

            //인디케이터 점프 이동
            function jumpSlides(curr, dest){
                if(looper != undefined){looper=clearInterval(looper)};//임시로 루프 죽이고

                siblings(slider.querySelectorAll('ul li')[currIndex]).forEach(function(item){
                    item.classList.remove('inactive');
                });
                slider.querySelectorAll('ul li')[curr].classList.remove('active');
                slider.querySelectorAll('ul li')[curr].classList.add('inactive');
                indicatorItems[curr].classList.remove('active');

                slider.querySelectorAll('ul li')[dest].classList.add('active');
                indicatorItems[dest].classList.add('active');
                currIndex = dest;

                if(looper == undefined)looper = setLoop();//루프 재설정
            }
                        
            //add mobile touch
            slider.addEventListener("touchstart", function(event){
                let touch = event.touches[0];
                touchstartX = touch.clientX,
                touchstartY = touch.clientY;
            });

            //add mobile touch end
            slider.addEventListener("touchend", function(event){
                if( event.touches.length == 0 ){
                    let touch = event.changedTouches[event.changedTouches.length - 1];
                    touchendX = touch.clientX,
                    touchendY = touch.clientY,
                    touchoffsetX = touchendX - touchstartX,
                    touchoffsetY = touchendY - touchstartY;

                    if ( Math.abs(touchoffsetX) > 10 && Math.abs(touchoffsetY) <= 100 ){
                        if (touchoffsetX < 0 ){
                            slider.querySelector(".next").dispatchEvent(getEventObject('click'));
                        } else {
                            slider.querySelector(".prev").dispatchEvent(getEventObject('click'));
                        }
                    }
                }
            });
            
            if(bShowIndex){
                slider.querySelectorAll('.index').forEach(function(idx){
                    slider.html((idx+1)+'/'+itemsLength);
                });
            }
            
        }//itemsLength > 1

        //슬라이더 클릭 링크 처리
        slider.querySelectorAll('ul li').forEach(function(el){
            if(el.dataset.url != ''){
                el.classList.add('pointer');
                el.addEventListener('click', function(e){
                    window.location.assign(e.target.closest('li').dataset.url);
                });
            }
        });

    });
}//coverSlider() End

//jQuery .siblings() equivalent
function siblings(t) {
    let children = t.parentElement.children;
    let tempArr = [];

    for (let i = 0; i < children.length; i++) {
        tempArr.push(children[i]);
    }

    return tempArr.filter(function(e){
        return e != t;
    });
}

//jQuery .is() equivalent
function is(el, selector) {
    let div = document.createElement('div');
    div.innerHTML = el.outerHTML;
    return div.querySelector(selector);
}