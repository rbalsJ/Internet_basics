var currentPage = 1;
var totalPages = 0;
var language = 'none';
var allData = [];

//최소 개발 기준 12 : 네트워크 연결 등의 에러 처리 구현
function onPageLoad() {
    if (navigator.onLine) {
        getData('getFoodKr', 1);
    } else {
        alert('네트워크 연결을 확인해주세요.');
    }
}

onPageLoad();

//최소 개발 기준 2. 공공데이터 포털 부산 맛집서비스 Open Web API 활용
// 최소 개발 기준 13 : jQuery 및 JSON 기능 활용
function getData(serviceName, page) {
    var serviceKey = "HcmyGvGoOir3tA8yg6LEqj9ea6vPsznFVzm9KJ%2F9FWdsy6jtPljP%2BJLFCtp63lQiDNIuQj7%2Bh9bMwt9gTjZitA%3D%3D";
    var url;

    if (serviceName === "getFoodEn") {
        url = "http://apis.data.go.kr/6260000/FoodService/getFoodEn?serviceKey=" + serviceKey + "&numOfRows=12&pageNo=" + page + "&resultType=json";
        language = "getFoodEn";
        // 최소 개발 기준 11 : DOM 활용하여 HTML element 혹은 CSS property 다루기
        document.getElementById("korBtn").innerText = "Korean";
        document.getElementById("engBtn").innerText = "English";
        document.getElementById("jaBtn").innerText = "Japanese";
        document.getElementById("mapBtn").innerText = "View a map";
    } else if (serviceName === "getFoodJa") {
        url = "http://apis.data.go.kr/6260000/FoodService/getFoodJa?serviceKey=" + serviceKey + "&numOfRows=12&pageNo=" + page + "&resultType=json";
        language = "getFoodJa";
        // 최소 개발 기준 11 : DOM 활용하여 HTML element 혹은 CSS property 다루기
        document.getElementById("korBtn").innerText = "韓国語";
        document.getElementById("engBtn").innerText = "英語";
        document.getElementById("jaBtn").innerText = "日本語";
        document.getElementById("mapBtn").innerText = "地図を開く";
    } else {
        url = "http://apis.data.go.kr/6260000/FoodService/getFoodKr?serviceKey=" + serviceKey + "&numOfRows=12&pageNo=" + page + "&resultType=json";
        language = "getFoodKr";
        // 최소 개발 기준 11 : DOM 활용하여 HTML element 혹은 CSS property 다루기
        document.getElementById("korBtn").innerText = "한국어";
        document.getElementById("engBtn").innerText = "English";
        document.getElementById("jaBtn").innerText = "日本語";
        document.getElementById("mapBtn").innerText = "지도 보기";
    }

    var settings = {
        "url": url,
        "method": "GET",
        "timeout": 0,
    };

    $.ajax(settings).done(function (response) {
        console.log(response);

        var result = JSON.parse(response);

        if (serviceName == "getFoodEn") {
            var items = result.getFoodEn.item;
            totalPages = result.getFoodEn.totalPage;
        } else if (serviceName == "getFoodJa"){
            var items = result.getFoodJa.item;
            totalPages = result.getFoodJa.totalPage;
        } else {
            var items = result.getFoodKr.item;
            totalPages = result.getFoodKr.totalPage;
        }

        //최소 개발 기준 3. 서로 다른 <input> 3개 이상 활용
        var searchInput = document.getElementById('searchInput').value.toLowerCase();

        var places = items.map(function (item) {
            return {
                place: item.TITLE,
                address: item.ADDR1,
                image: item.MAIN_IMG_NORMAL,
                content: item.ITEMCNTNTS
            };
        }).filter(function (place) {
            var content = place.content.toLowerCase();
            return content.includes(searchInput);
        });

        var resultDiv = $('#result');
        resultDiv.empty();

        places.forEach(function (place) {
            var gridItem = $('<div>').addClass('grid-item');
            var imageElement = $('<img>').attr('src', place.image).attr('data-address', place.address);
            var placeElement = $('<p>').text('장소: ' + place.place);
            var contentElement = $('<p>').text(place.content);

            imageElement.click(function () {
                var address = $(this).attr('data-address');
                if ($(this).hasClass('show-address')) {
                    $(this).removeClass('show-address');
                    $(this).siblings('.address').remove();
                } else {
                    $(this).addClass('show-address');
                    $(this).after($('<p>').text('주소: ' + address).addClass('address'));
                }
            });

            //최소 개발 기준 10 : grid 활용
            gridItem.append(imageElement);
            gridItem.append(placeElement);
            gridItem.append(contentElement);
            resultDiv.append(gridItem);
        });

        currentPage = page;
        updateNextButtonVisibility();
        updatePrevButtonVisibility();
    });
}

function searchData() {
    getData(language, currentPage);

}

function searchReset() {
    document.getElementById('searchInput').value = "";
}

function getNextPage() {
    var nextPage = currentPage + 1;
    getData(language, nextPage);
}

function getPrevPage() {
    var prevPage = currentPage - 1;
    getData(language, prevPage);
}

// 최소 개발 기준 8 : 잘못된 동작에 대한 에러 핸들링 구현
function updateNextButtonVisibility() {
    var nextButton = $('#nextButton');
    if (currentPage >= totalPages) {
        nextButton.hide();
    } else {
        nextButton.show();
    }
}

// 최소 개발 기준 8 : 잘못된 동작에 대한 에러 핸들링 구현
function updatePrevButtonVisibility() {
    var prevButton = $('#prevButton');
    if (currentPage <= 1) {
        prevButton.hide();
    } else {
        prevButton.show();
    }
}