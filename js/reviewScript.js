function getId() {
    const URLSearch = new URLSearchParams(location.search);
    return URLSearch.get('id');
}

let username = localStorage.getItem('username');

function getUserReview(reviewId) {
    $.ajax({
        type: "GET",
        url: `http://localhost:8080/reviews/${reviewId}`,
        success: function (response) {
            $('#title').text(response['title']);
            $('#place').text(response['place']);
            $('#review').text(response['review']);
            getUserInfo();
            $('#file').attr('src', response['reviewImgUrl']);
            $('#date').text(response['createdAt']);
            $('#like').text(response['likeCnt']);

            // 자신이 작성한 리뷰에만 수정/삭제 버튼 뜨게 한다
            if (response['user']['username'] == username) {
                $('#own-check').show();
            } else {
                $('#own-check').hide();
            }
        }
    });
}

function getUserInfo() {
    $.ajax({
        type: "GET",
        url: `http://localhost:5081/user/${username}`,
        success: function (response) {
            $('#nickname').text(response['nickname']);
            $('#profile_img').attr('src', response['profileImgUrl']);
        }
    });
}

// 댓글 달기
function postComment(reviewId) {
    let UserReviewComment = $('#comment_content').val();

    if (UserReviewComment.replaceAll(" ", "").replaceAll("　", "") == "") {
        return alert("댓글을 입력해주세요")
    }

    $.ajax({
        type: "POST",
        url: `http://localhost:8080/reviews/${reviewId}/comment`,
        contentType: 'application/json; charset=utf-8',
        data: JSON.stringify({comment: UserReviewComment}),
        statusCode: {
            401: () => { // 로그인 안 하고 댓글 작성 시
                alert('로그인이 필요한 서비스입니다.');
                window.location.href = "../templates/login.html";
            }
        },
        success: function (response) {
            showComments();
            $('#comment_content').val(""); // 댓글 작성 완료 후 입력창 비우기
        }
    });
}

// 댓글 보여주기
function showComments() {
    $('#comment_list').empty();
    $.ajax({
        type: "GET",
        url: `http://localhost:8080/reviews/${getId()}/comments`,
        data: {},
        success: function (response) {
            for (let i = 0; i < response.length; i++) {
                let commentId = response[i]['id'];
                let profileImg = response[i]['user']['profileImgUrl'];
                let nickname = response[i]['user']['nickname'];
                let comment = response[i]['comment'];
                let date = new Date(response[i]['createdAt']);
                let dateBefore = time2str(date);

                let html_temp = `<div class="mb-3">
                                    <div class="d-flex justify-content-between">
                                        <div class="d-flex align-items-center">
                                            <img src="${profileImg}" width="35px" height="35px" style="object-fit: cover; border-radius: 50%;" />
                                            <span style="margin-left: 5px; font-size: 15px; font-weight: 700;">${nickname}</span>
                                            <span style="margin-left: 5px; font-size: 13px;">${dateBefore}</span>
                                        </div>
                                        <div class="d-flex justify-content-between">
                                            <a id="${commentId}_update" href="javascript:showUpdateCommentModel(${commentId})" style="display: none;"><i class="fas fa-edit" style="color: #6E85B2;"></i></a>
                                            <a id="${commentId}_delete" href="javascript:deleteComment(${commentId})" style="display: none;"><i class="fas fa-trash-alt" style="color: #6E85B2; margin-left: 10px;"></i></a>
                                        </div>
                                    </div>
                                    <div style="margin: 5px 0 0 5px; word-break:break-all; font-size: 14px; font-weight: 400;">${comment}</div>
                                    <div id="${commentId}CommentUpdateInputModel" class="form-post" style="display:none">
                                        <textarea id="${commentId}_comment_update_input" style="width: 100%;" placeholder="수정하실 댓글을 입력하세요" style="display: none">${comment}</textarea>
                                        <a onclick="updateComment(${commentId})" class="button alt">수정하기</a>
                                    </div>
                                 </div>`;

                $('#comment_list').append(html_temp);

                // 로그인한 유저와 댓글을 쓴 유저가 같으면 삭제 아이콘이 뜸
                if (response[i]['user']['username'] === localStorage.getItem('username')) {
                    $(`#${commentId}_update`).css('display', 'block');
                    $(`#${commentId}_delete`).css('display', 'block');
                } else {
                    $(`#${commentId}_update`).css('display', 'none');
                    $(`#${commentId}_delete`).css('display', 'none');
                }
            }
        }
    });
}


// 댓글 삭제하기
function deleteComment(comment_id) {
    if (confirm("삭제하시겠습니까?") === true) {
        $.ajax({
            type: "DELETE",
            url: `http://localhost:8080/reviews/${getId()}/comments/${comment_id}`,
            data: {},
            success: function (response) {
                showComments();
            }
        });
    };
}


// 댓글 수정 모델 출력
function showUpdateCommentModel(commentId) {
    if ($(`#${commentId}CommentUpdateInputModel`).css("display") == "block") {
        $(`#${commentId}CommentUpdateInputModel`).hide();
    } else {
        $(`#${commentId}CommentUpdateInputModel`).show();
    }
}

// 댓글 수정하기
function updateComment(commentId) {
    let comment = $(`#${commentId}_comment_update_input`).val();
    if (comment == "") {
        return alert("수정할 댓글을 입력해주세요")
    }
    let UserReviewComment = {
        commentId: commentId,
        comment: comment
    }
    $.ajax({
        type: "PUT",
        url: `http://localhost:8080/reviews/${getId()}/comments/${commentId}`,
        contentType: 'application/json; charset=utf-8',
        data: JSON.stringify(UserReviewComment),
        statusCode: {
            401: () => { // 로그인 안 하고 댓글 작성 시
                alert('로그인이 필요한 서비스입니다.');
                window.location.href = "../templates/login.html";
            }
        },
        success: function (response) {
            showComments();
            $(`#${commentId}_comment_update_input`).hide();
        }
    });
}


// 리뷰 수정 화면에서 input 창에 이전 데이터 값 보이게 함
function updateUserReview(id) {

    if (!localStorage.getItem('token')) {
        alert('로그인이 필요한 서비스입니다.')
        window.location.href = "../templates/login.html"
    } else {
        sessionStorage.setItem("title", $("#title").text())
        sessionStorage.setItem("place", $("#place").text())
        sessionStorage.setItem("review", $("#review").text())
        sessionStorage.setItem("file", $("#file").attr("src"))

        window.location.href = `../templates/form.html?id=${id}`;
    }
}


// 리뷰 삭제
function deleteUserReview(id) {
    if (confirm("삭제 하시겠습니까?") === true) {
        $.ajax({
            type: "DELETE",
            url: `http://localhost:8080/reviews/${id}`,
            data: {},
            success: function (response) {
                window.location.href = "../templates/reviews.html";
            }
        });
    }
}


// 좋아요 기능
function userReviewLike(trip_id) {
    let like = parseInt($('#like').text());

    if (!localStorage.getItem('token')) {
        alert('로그인이 필요한 서비스입니다.')
        window.location.href = "../templates/login.html"
    } else {
        if ($('#like').hasClass("far")) {

            $.ajax({
                type: "POST",
                url: `http://localhost:8080/reviews/${trip_id}/like`,
                data: {},
                success: function (response) {
                    getUserReview(getId())
                    $('#like').removeClass("far").addClass("fas")
                }
            })
        } else {
            $.ajax({
                type: "DELETE",
                url: `http://localhost:8080/reviews/${trip_id}/like`,
                data: {},
                success: function (response) {
                    getUserReview(getId())
                    $('#like').removeClass("fas").addClass("far")
                }
            });
        }
    }
}

function get_like(id) {
    $.ajax({
        type: "GET",
        url: `http://localhost:8080/reviews/${id}/like`,
        data: {},
        success: function (response) {
            if (response['likeStatus'] == true) {
                $('#like').removeClass("far").addClass("fas");
            } else {
                $('#like').removeClass("fas").addClass("far")
            }
        }
    });
}


// 카카오톡 공유하기
function kakaoShare() {
    $.ajax({
        type: "GET",
        url: `http://localhost:8080/reviews/${getId()}`,
        data: {},
        success: function (response) {
            let share_title = response['title'];
            let share_place = response['place'];
            let share_img = response['reviewImgUrl'];
            let share_like = response['userReviewLikes'].length // 좋아요 수
            let share_comment_count = response['comments'].length // 댓글 수

            Kakao.Link.sendDefault({
                objectType: 'feed',
                content: {
                    title: share_title,
                    description: share_place,
                    imageUrl: share_img,
                    link: {
                        mobileWebUrl: location.href,
                        webUrl: location.href
                    },
                },
                // 나중에 변수 추가할 것임!!
                social: {
                    likeCount: share_like,
                    commentCount: share_comment_count,
                    sharedCount: 1
                },
                buttons: [
                    {
                        title: '구경 가기',
                        link: {
                            mobileWebUrl: location.href,
                            webUrl: location.href
                        }
                    }
                ],
            })
        }
    });
}

function time2str(date) {
    let today = new Date();
    let time = (today - date) / 1000 / 60;  // 분

    if (time < 1) {
        return "방금";
    }

    if (time < 60) {
        return parseInt(time) + "분 전";
    }
    time = time / 60  // 시간
    if (time < 24) {
        return parseInt(time) + "시간 전";
    }
    time = time / 24
    if (time < 7) {
        return parseInt(time) + "일 전";
    }
    return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일`;
}

function autoHeight() {
    $('textarea').keyup(function (e) {
        $(this).css('height', 'auto');
        $(this).height(this.scrollHeight);
    });
}