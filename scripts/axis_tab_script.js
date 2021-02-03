var num=5


function add(num_var){

  if(num >= 2 && num < 5){
    num=num+num_var;;
  }

  $(".num").text(num);

}

function minus(num_var){

  if(num <= 5 && num > 2){
    num=num+num_var;;
  }

  $(".num").text(num);

}

function check(){
  if (num == 2){
    $(".text").text("minimum axes in focus view");
    $(".text").css("border-color","#CC4A5A");
    $(".text").css("color","#CC4A5A");


  }else if (num == 5){
    $(".text").text("maximum axes in focus view")
    $(".text").css("border-color","#FEC907");
    $(".text").css("color","#FEC907");
     $(".fill_stock").removeClass("fill_stock_open");

  }else{
    $(".text").text("number of axes in focus view");
    $(".text").css("border-color","#fff");
    $(".text").css("color","#fff");
}


  
}
$(".minus").click(
function(){
  // num=num-1;
  // $(".num").text(num);
  minus(-1);
  check();
  
});
$(".add").click(
function(){
  // num=num+1;
  // $(".num").text(num);
  add(1);
  check();
})