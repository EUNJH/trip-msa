let username = localStorage.getItem("username");
let userReviewProfile_img;
let userReviewNickname;

function showListSort(type) {
  $("#trip_card").empty();
  $.ajax({
    type: "GET",
    url: `http://localhost:5082/reviews?sort=${type}`,
    contentType: "application/json; charset=utf-8",
    success: function (response) {
      for (let i = 0; i < response.length; i++) {
        let userReviewId = response[i]["id"];
        let userReviewTitle = response[i]["title"];
        let userReviewPlace = response[i]["place"];
        let userReviewFile = response[i]["reviewImgUrl"];
        let userReviewDate = response[i]["createdAt"];
        let userReviewLikes = response[i]["likeCnt"];
        getUser(username);

        let temp_html = `<li style="margin: 0 10px; height: 300px;">
                                        <a onclick="moveTripDetail(${userReviewId})" class="card">
                                            <img src="${userReviewFile}" class="card__image" alt="사용자가 올린 여행지 사진"/>
                                            <div class="card__overlay">
                                                <div class="card__header">
                                                    <svg class="card__arc" xmlns="https://www.w3.org/TR/2018/CR-SVG2-20181004/">
                                                        <path/>
                                                    </svg>
                                                    <div class="card__thumb2">
                                                        <img src="${userReviewProfile_img}" alt="프로필 사진"/>
                                                    </div>
                                                    <div class="card__header-text">
                                                        <h3 class="card__title">${userReviewTitle}</h3>
                                                        <i class="far fa-thumbs-up">${userReviewLikes}</i>
                                                        <span class="card__status">${userReviewDate}</span>
                                                    </div>
                                                </div>
                                                <p class="card__description">${userReviewPlace}</p>
                                                <p class="card__description">by <b>@${userReviewNickname}</b></p>
                                            </div>
                                        </a>
                                    </li>`;
        $("#trip_card").append(temp_html);
      }
    },
    error: function (error) {
      $.ajax({
        type: "GET",
        url: `http://localhost:5092/reviews?sort=${type}`,
        contentType: "application/json; charset=utf-8",
        success: function (response) {
          for (let i = 0; i < response.length; i++) {
            let userReviewId = response[i]["id"];
            let userReviewTitle = response[i]["title"];
            let userReviewPlace = response[i]["place"];
            let userReviewFile = response[i]["reviewImgUrl"];
            let userReviewDate = response[i]["createdAt"];
            let userReviewLikes = response[i]["likeCnt"];
            getUser(username);

            let temp_html = `<li style="margin: 0 10px; height: 300px;">
                                                <a onclick="moveTripDetail(${userReviewId})" class="card">
                                                    <img src="${userReviewFile}" class="card__image" alt="사용자가 올린 여행지 사진"/>
                                                    <div class="card__overlay">
                                                        <div class="card__header">
                                                            <svg class="card__arc" xmlns="https://www.w3.org/TR/2018/CR-SVG2-20181004/">
                                                                <path/>
                                                            </svg>
                                                            <div class="card__thumb2">
                                                                <img src="${userReviewProfile_img}" alt="프로필 사진"/>
                                                            </div>
                                                            <div class="card__header-text">
                                                                <h3 class="card__title">${userReviewTitle}</h3>
                                                                <i class="far fa-thumbs-up">${userReviewLikes}</i>
                                                                <span class="card__status">${userReviewDate}</span>
                                                            </div>
                                                        </div>
                                                        <p class="card__description">${userReviewPlace}</p>
                                                        <p class="card__description">by <b>@${userReviewNickname}</b></p>
                                                    </div>
                                                </a>
                                            </li>`;
            $("#trip_card").append(temp_html);
          }
        },
      });
    },
  });
}

function moveTripDetail(trip_id) {
  window.location.href = `../templates/review.html?id=${trip_id}`;
}

function writeTrip() {
  if (localStorage.getItem("token")) {
    window.location.href = "../templates/form.html";
  } else {
    alert("로그인이 필요한 서비스입니다.");
    window.location.href = "../templates/login.html";
  }
}

function getUser(username) {
  $.ajax({
    type: "GET",
    url: `http://localhost:5081/user/${username}}`,
    contentType: "application/json; charset=utf-8",
    success: function (response) {
      userReviewProfile_img = response["profileImgUrl"];
      userReviewNickname = response["nickname"];
    },error:function(error){
      $.ajax({
        type: "GET",
        url: `http://localhost:5091/user/${username}}`,
        contentType: "application/json; charset=utf-8",
        success: function (response) {
          userReviewProfile_img = response["profileImgUrl"];
          userReviewNickname = response["nickname"];
        }
      });
    }
  });
}
