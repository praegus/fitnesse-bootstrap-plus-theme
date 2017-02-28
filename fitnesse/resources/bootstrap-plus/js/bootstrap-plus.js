$( document ).ready(function() {
   $(".test").each(function() {
        $(this).before('<i class="fa fa-cog icon-suite" aria-hidden="true"></i>&nbsp;');
   });
   $(".suite").each(function() {
        $(this).before('<i class="fa fa-cogs icon-test" aria-hidden="true"></i>&nbsp;');
   });
   $(".static").each(function() {
        $(this).before('<i class="fa fa-file-o icon-static" aria-hidden="true"></i>&nbsp;');
   });
});