$(document).ready(function() {
$('body').on('click', '#logout', function() {
	$('#logout-form').submit();

 });
// $('body').on('click','#forgotPassword', function(){
// 	 $.ajax({
//         url: '/api/sendEmail/',
//         method: "GET"
//     }).done(function(data){
//     	console.log("done");
//     }); 
// });

});