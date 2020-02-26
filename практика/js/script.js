 function Sim(sldrId) {

     let id = document.getElementById(sldrId);
     if (id) {
         this.sldrRoot = id
     } else {
         this.sldrRoot = document.querySelector('.sim-slider')
     };

     // Carousel objects
     this.sldrList = this.sldrRoot.querySelector('.sim-slider-list');
     this.sldrElements = this.sldrList.querySelectorAll('.sim-slider-element');
     this.sldrElemFirst = this.sldrList.querySelector('.sim-slider-element');
     this.leftArrow = this.sldrRoot.querySelector('div.sim-slider-arrow-left');
     this.rightArrow = this.sldrRoot.querySelector('div.sim-slider-arrow-right');
     this.indicatorDots = this.sldrRoot.querySelector('div.sim-slider-dots');

     // Initialization
     this.options = Sim.defaults;
     Sim.initialize(this)
 };

 Sim.defaults = {

     // Default options for the carousel
     loop: true, // Бесконечное зацикливание слайдера
     auto: true, // Автоматическое пролистывание
     interval: 5000, // Интервал между пролистыванием элементов (мс)
     arrows: true, // Пролистывание стрелками
     dots: true // Индикаторные точки
 };

 Sim.prototype.elemPrev = function(num) {
     num = num || 1;

     let prevElement = this.currentElement;
     this.currentElement -= num;
     if (this.currentElement < 0) this.currentElement = this.elemCount - 1;

     if (!this.options.loop) {
         if (this.currentElement == 0) {
             this.leftArrow.style.display = 'none'
         };
         this.rightArrow.style.display = 'block'
     };

     this.sldrElements[this.currentElement].style.opacity = '1';
     this.sldrElements[prevElement].style.opacity = '0';

     if (this.options.dots) {
         this.dotOn(prevElement);
         this.dotOff(this.currentElement)
     }
 };

 Sim.prototype.elemNext = function(num) {
     num = num || 1;

     let prevElement = this.currentElement;
     this.currentElement += num;
     if (this.currentElement >= this.elemCount) this.currentElement = 0;

     if (!this.options.loop) {
         if (this.currentElement == this.elemCount - 1) {
             this.rightArrow.style.display = 'none'
         };
         this.leftArrow.style.display = 'block'
     };

     this.sldrElements[this.currentElement].style.opacity = '1';
     this.sldrElements[prevElement].style.opacity = '0';

     if (this.options.dots) {
         this.dotOn(prevElement);
         this.dotOff(this.currentElement)
     }
 };

 Sim.prototype.dotOn = function(num) {
     this.indicatorDotsAll[num].style.cssText = 'background-color:#BBB; cursor:pointer;'
 };

 Sim.prototype.dotOff = function(num) {
     this.indicatorDotsAll[num].style.cssText = 'background-color:#556; cursor:default;'
 };

 Sim.initialize = function(that) {

     // Constants
     that.elemCount = that.sldrElements.length; // Количество элементов

     // Variables
     that.currentElement = 0;
     let bgTime = getTime();

     // Functions
     function getTime() {
         return new Date().getTime();
     };

     function setAutoScroll() {
         that.autoScroll = setInterval(function() {
             let fnTime = getTime();
             if (fnTime - bgTime + 10 > that.options.interval) {
                 bgTime = fnTime;
                 that.elemNext()
             }
         }, that.options.interval)
     };

     // Start initialization
     if (that.elemCount <= 1) { // Отключить навигацию
         that.options.auto = false;
         that.options.arrows = false;
         that.options.dots = false;
         that.leftArrow.style.display = 'none';
         that.rightArrow.style.display = 'none'
     };
     if (that.elemCount >= 1) { // показать первый элемент
         that.sldrElemFirst.style.opacity = '1';
     };

     if (!that.options.loop) {
         that.leftArrow.style.display = 'none'; // отключить левую стрелку
         that.options.auto = false; // отключить автопркрутку
     } else if (that.options.auto) { // инициализация автопрокруки
         setAutoScroll();
         // Остановка прокрутки при наведении мыши на элемент
         that.sldrList.addEventListener('mouseenter', function() { clearInterval(that.autoScroll) }, false);
         that.sldrList.addEventListener('mouseleave', setAutoScroll, false)
     };

     if (that.options.arrows) { // инициализация стрелок
         that.leftArrow.addEventListener('click', function() {
             let fnTime = getTime();
             if (fnTime - bgTime > 1000) {
                 bgTime = fnTime;
                 that.elemPrev()
             }
         }, false);
         that.rightArrow.addEventListener('click', function() {
             let fnTime = getTime();
             if (fnTime - bgTime > 1000) {
                 bgTime = fnTime;
                 that.elemNext()
             }
         }, false)
     } else {
         that.leftArrow.style.display = 'none';
         that.rightArrow.style.display = 'none'
     };

     if (that.options.dots) { // инициализация индикаторных точек
         let sum = '',
             diffNum;
         for (let i = 0; i < that.elemCount; i++) {
             sum += '<span class="sim-dot"></span>'
         };
         that.indicatorDots.innerHTML = sum;
         that.indicatorDotsAll = that.sldrRoot.querySelectorAll('span.sim-dot');
         // Назначаем точкам обработчик события 'click'
         for (let n = 0; n < that.elemCount; n++) {
             that.indicatorDotsAll[n].addEventListener('click', function() {
                 diffNum = Math.abs(n - that.currentElement);
                 if (n < that.currentElement) {
                     bgTime = getTime();
                     that.elemPrev(diffNum)
                 } else if (n > that.currentElement) {
                     bgTime = getTime();
                     that.elemNext(diffNum)
                 }
                 // Если n == that.currentElement ничего не делаем
             }, false)
         };
         that.dotOff(0); // точка[0] выключена, остальные включены
         for (let i = 1; i < that.elemCount; i++) {
             that.dotOn(i)
         }
     }
 };

 window.onload = function() {
     new Sim();

     var modalContainer = document.querySelector('.modalContainer');
     var modalContent = document.querySelector('.modalContent');
     var modalWindow = document.querySelector('.GoToPopup');

     modalWindow.addEventListener('click', function() {
         modalContainer.style.display = 'flex'
     });

     // close.addEventListener('click', function(e){
     //  modalContainer.style.display = 'none'
     //  e.stopPropogination()
     // });

     modalContainer.addEventListener('click', function() {
         modalContainer.style.display = 'none'
     });

     modalContent.addEventListener('click', function(e) {
         e.stopPropagation();
     });
 }

 // search
 // window.onload = function() {
 // var input,search,pr,result,result_arr, locale_HTML, result_store;

 // locale_HTML = document.body.innerHTML;   // сохраняем в переменную весь body (Исходный)

 // function FindOnPage(name, status) {

 //   input = document.getElementById(name).value; //получаем значение из поля в html

 //   if(input.length<3&&status==true) {
 //     alert('Для поиска вы должны ввести три или более символов');
 //     function FindOnPageBack() { document.body.innerHTML = locale_HTML; }   //обнуляем стили
 //   }

 //         if(input.length>=3)
 //   {
 //               function FindOnPageGo() {
 //                      search = '/'+input+'/g';  //делаем из строки регуярное выражение
 //          pr = document.body.innerHTML;   // сохраняем в переменную весь body
 //          result = pr.match(/>(.*?)</g);  //отсекаем все теги и получаем только текст
 //          result_arr = [];   //в этом массиве будем хранить результат работы (подсветку)

 //                      for(var i=0; i<result.length;i++) {
 //             result_arr[i] = result[i].replace(eval(search), '<span style="background-color:yellow;">'+input+'</span>'); //находим нужные элементы, задаем стиль и сохраняем в новый массив
 //       }
 //          for(var i=0; i<result.length;i++) {
 //       pr=pr.replace(result[i],result_arr[i])  //заменяем в переменной с html текст на новый из новогом ассива
 //       }
 //          document.body.innerHTML = pr;  //заменяем html код
 //               }
 //         }
 //         function FindOnPageBack() { document.body.innerHTML = locale_HTML; }   //обнуляем стили
 //         if(status) { FindOnPageBack(); FindOnPageGo(); } //чистим прошлое и Выделяем найденное
 //   if(!status) { FindOnPageBack(); } //Снимаем выделение
 // }     
 // //          input = document.getElementById(name).value; //получаем значение из поля в html
 // //             var warning = true;
 // //   for(var i=0;i<result.length;i++) {
 // //   if(result[i].match(eval(search))!=null) {
 // //       warning = false;
 // //     }
 // //   }
 // //   if(warning == true) {
 // //     alert('Не найдено ни одного совпадения');
 // //   }
 // };


 function ShowCategories() {
     let dropDown = document.querySelector('.drop_down');
     if ($('.drop_down').css('marginLeft') == '-500px') {
         dropDown.style.transition = '1s';
         dropDown.style.marginLeft = '0px';
     } else {
         dropDown.style.transition = '1s';
         dropDown.style.marginLeft = '-500px';
     }


 }