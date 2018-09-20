var thisId;

$(document).on("click",".comment", function() {
    var thisId = $(this).attr("id");
    getComments(thisId);
    postComment(thisId);
    $(".all-comments").empty();
    return thisId;
});

//GET COMMENTS FROM DB
function getComments(thisId){
$(".all-comments").empty();
$("#comment-title").text("");
$("#comment-body").text("");
console.log(thisId);
$.ajax({
    method: "GET",
    url: "/comments/" + thisId
  })
    .then(function(data) {
      console.log(data);
      
      for (let i = 0; i < data.length; i++){
      var comment = $("<div class='comment'>")
      comment.append("<h2>" + data[i].title + "</h2>");
      comment.append("<button type='submit' class='comment-delete' data-id="+data[i]._id+">X</button>")
      comment.append("<p>" + data[i].body + "</p>");
      $(".all-comments").append(comment);
      }
    });
}

//ADD COMMENT TO DB
function postComment(thisId){
$(document).on("click","#add-comment-btn", function(event){
    event.preventDefault();
    var title =  $("#comment-title").val().trim();
    var body = $("#comment-body").val().trim();
    $("#comment-title").text("");
    $("#comment-body").text("");
    console.log("comment to DB");
    console.log(thisId);
    var postNum = thisId;

    $.ajax({
        method: "POST",
        url: "/post/" + thisId,
        data: {
            postnum: postNum,
            title: title,
            body: body
          }
      })
      .then(function(data) {
        console.log(data + " added to db");
      });
getComments(thisId);

});
}

//DELETE COMMENT FROM DB
$(document).delegate("click",".comment-delete", function(event){
    event.preventDefault();
    console.log("delete this");
    var id = $(this).data("id");
    console.log(id);
    // $.ajax({
    //     method: "DELETE",
    //     url: "/delete/" + thisId,
    //     data:{ 
    //         id: id
    //     }
    //   })
    //   .then(function(data) {
    //     console.log(data + " deleted from comments");
    //   });
});